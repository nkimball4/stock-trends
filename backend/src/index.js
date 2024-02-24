const express = require('express');
const cron = require('node-cron');
const searchRoutes = require('./routes/searchRoutes')
const {getBreakoutCompanies} = require('./controllers/searchController')
const {searchMarketTweets} = require('./controllers/twitterController')

const PORT = 8000;

const app = express();
app.use(express.json());

app.use('/api', searchRoutes)
app.get('/api/tweets', async () => {
    await searchMarketTweets();
})

app.listen(PORT, () => {
    console.log(`=======> Server started on port ${PORT} <=======`);

    cron.schedule('0 0 * * *', () => {
        console.log("Scheduled cron job")
    })
});