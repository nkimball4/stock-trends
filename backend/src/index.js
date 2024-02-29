const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const routes = require('./routes/routes')
const connectDB = require('./db/connectDB')
const Company = require('./db/models/companyEntryModel')
const PastCompany = require('./db/models/pastCompanyEntryModel')
const {getBreakoutCompanies} = require('./controllers/searchController')
const {searchMarketTweets} = require('./controllers/twitterController')

const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use('/api', routes)
app.get('/api/tweets', async (req, res) => {
    const response = await searchMarketTweets();
    res.json(response)
})


app.listen(PORT, async () => {
    console.log(`=======> Server started on port ${PORT} <=======`);

    cron.schedule('16 * * * *', async () => {

        const breakoutResponse = await getBreakoutCompanies();
        
        if (breakoutResponse){
            const companies = await Company.find({});

            for (const company of companies) {
                try {
                    console.log(`Moving company ${company.company} to PastCompany collection`);
                    const pastCompany = new PastCompany(company.toObject());
                    await pastCompany.save(); // save the document
                    console.log(`Company ${company.company} moved to PastCompany collection.`);
                } catch (error) {
                    console.error(`Error moving company ${company.company} to PastCompany collection: ${error.message}`);
                }
            }
            await Company.deleteMany({})
            const companiesArr = JSON.parse(breakoutResponse)
    
            for (const company of companiesArr) {
                try {
                    const newCompany = new Company(company);
                    await newCompany.save();
                    console.log(`Company ${company.company} added to the database.`);
                } catch (error) {
                    console.error(`Error saving company ${company.company}: ${error.message}`);
                }
            }
        }
    });
    
});