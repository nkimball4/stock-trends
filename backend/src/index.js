const express = require('express');
const https = require('https');
const cron = require('node-cron');
const cors = require('cors');
const routes = require('./routes/routes')
const connectDB = require('./db/connectDB')
const Company = require('./db/models/companyEntryModel')
const PastCompany = require('./db/models/pastCompanyEntryModel')
const SearchCompany = require('./db/models/searchCompanyEntryModel');
const {getBreakoutCompanies} = require('./controllers/searchController')
const {searchMarketTweets} = require('./controllers/twitterController')

const PORT = 8000;

/**
 * Server initialization
 */


const app = express();
app.use(express.json());
app.use(cors()); // Enable cross origin resource sharing
connectDB();

/**
 * Set up endpoints using imported router
 */
app.use('/api', routes)
app.get('/api/tweets', async (req, res) => {
    const response = await searchMarketTweets();
    res.json(response)
})


app.listen(PORT, async () => {
    console.log(`=======> Server started on port ${PORT} <=======`);

    /**
     * Cron job: every hour...
     * 
     * Get the trending companies
     * 
     * Move previous companies to a pastCompanies collection (so that we can track the performance of the stock recommendations)
     * 
     * Flush the current company collection, add trending companies to company collection
     */
    cron.schedule('28 * * * *', async () => {

        const breakoutResponse = await getBreakoutCompanies();

        if (breakoutResponse){
            const companies = await Company.find({});

            for (const company of companies) {
                try {
                    console.log(`Moving company ${company.company} to PastCompany collection`);
                    const pastCompany = new PastCompany(company.toObject());

                    await pastCompany.save();

                    console.log(`Company ${company.company} moved to PastCompany collection.`);
                } catch (error) {
                    console.error(`Error moving company ${company.company} to PastCompany collection: ${error.message}`);
                }
            }
            /* Delete current companies now that they have been moved to pastCompanies */
            console.log("=> Flushing company DB")
            await Company.deleteMany({})
            console.log("=> Parsing response")
            const companiesArr = breakoutResponse
            console.log("=> Saving companies")
            for (const company of companiesArr) {
                try {
                    const newCompany = new Company(company);
                    console.log("=> Saving " + company)
                    await newCompany.save();
                    console.log(`Company ${company.company} added to the database.`);
                } catch (error) {
                    console.error(`Error saving company ${company.company}: ${error.message}`);
                }
            }
        }
    });


    // /**
    //  * Flush the cache
    //  */
    cron.schedule('*/15 * * * *', async () => {
        const fifteenMinutesAgo = new Date(Date.now() - (15 * 60 * 1000));
        const companies = await SearchCompany.find({ timestamp: { $lt: fifteenMinutesAgo } });
        
        companies.forEach(company => {
            console.log(`Company with timestamp ${company.timestamp} is older than 15 minutes. Removing from cache`);
        });
    });
    
});