const express = require('express');
const cron = require('node-cron');
const connectDB = require('./db/connectDB')
const updateWatchlistForUsers = require('./controllers/updateWatchlistForUsers')
const User = require('../src/db/models/userModel')
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const Queue = require('bull');
const { Queue: QueueMQ, Worker } = require('bullmq');
const { ExpressAdapter } = require('@bull-board/express');


const PORT = 8001;
const redisOptions = {
    port: 6379,
    host: 'localhost',
    password: '',
    tls: false,
  };
const createQueueMQ = (name) => new QueueMQ(name, { connection: redisOptions });

const app = express();
connectDB();


const queueMQ = createQueueMQ('watchlistsMQ');

const worker = new Worker(queueMQ.name, async (job) => {
    console.log("inside worker callback")
    const users = await User.find({});
    await updateWatchlistForUsers(users);
}, {connection: redisOptions});


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
    queues: [new BullMQAdapter(queueMQ)],
    serverAdapter,
});

app.use('/ui', serverAdapter.getRouter());

app.use('/add', (req, res) => {
    const opts = req.query.opts || {};

    if (opts.delay) {
        opts.delay = +opts.delay * 1000;
    }

    queueMQ.add('Add', { title: req.query.title }, opts);

    res.json({
        ok: true,
    });
});

app.listen(PORT, async () => {
    console.log(`=======> Worker started on port ${PORT} <=======`);

    cron.schedule('44 * * * *', async () => {
        console.log("Running cron")
        queueMQ.add('run-update-watchlists', {})

    });


});