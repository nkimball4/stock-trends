const {OpenAI} = require('openai');
const dotenv = require('dotenv')
const {searchMarketTweets, searchSpecificCompanyTweets} = require('./twitterController')
const Company = require('../db/models/companyEntryModel')
const PastCompany = require('../db/models/pastCompanyEntryModel')
const SearchCompany = require('../db/models/searchCompanyEntryModel');
const yahooFinance = require('yahoo-finance2').default;
const {prompt1} = require('../mockData/prompts')

dotenv.config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


/**
 * 
 * Gets tweets mentioning the company given as a query parameter
 * Sends these tweets to gpt-4 using OpenAI API with a prompt describing its task to analyze public sentiment and determine the outlook for the stock price (Places extra weighting on tweets from reputable sources (high follower counts, professional account descriptions))
 * Returns AI response as a JSON HTTP response
 */
const getSentimentForSearch = async (req, res) => {

    console.log("=> Getting sentiment for company " + req.query.company)

    if (await checkCompanyValid(req.query.company)){

        const companyName = await getCompanyName(req.query.company)

        console.log("=> Checking cache")
        const cachedCompanies = await SearchCompany.find({});
        for (let i = 0; i < cachedCompanies.length; i++){
            if (cachedCompanies[i].financialData.shortName === companyName){
                console.log("=> Cached entry found")
                res.json({
                    ai_response: cachedCompanies[i].ai_response,
                    financialData: JSON.stringify(cachedCompanies[i].financialData),
                    historicalPriceData: JSON.stringify(cachedCompanies[i].historicalPriceData),
                    sector: JSON.stringify(cachedCompanies[i].sector)
                });

                /**
                 * kill function here
                 */
                return;
            }
        }


        const allTweets = await searchSpecificCompanyTweets(companyName);
        
        let i;
        for (i = 0; i < allTweets.length; i++){
            console.log("--> " + allTweets[i].text)
        }
        
        const aiTweetsInput = "Company: " + companyName + " Tweets: " + JSON.stringify(allTweets);
        console.log(aiTweetsInput);
    
        try{
            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages: [
                    {
                        role: "system",
                        content: "In the movie limitless, Eddie Morra trades stocks based on \"the rumour mill\" (i.e, what people are saying about the stock rather than statistics). You are an expert in this type of stock trading. Given a group (passed as a JSON object) of tweet information about a particular company/stock, you can determine if the chatter on the company is positive or negative, and therefore whether to buy, sell, or hold the stock. You will be passed a JSON object containing the following fields: user - the username of the individual who tweeted, userDescription - the twitter bio of the user who made the tweet, userFollowerCount - the follower count of the user, text - the actual text content of the tweet. You will respond with nothing except a standard JSON object (not a string, and please don't use ```json) with the following fields: 'reasoning' - detailed reasoning specific to the company that led you to this verdict (Use the company's name, do not be vague), 'tweets' - an array of notable tweets that swayed you towards your verdict (each tweet given as a JSON object as it was passed to you), 'final_verdict' - buy, sell, or hold, and 'confidence_rate' - the percentage confidence rate in the verdict (a number only, no percentage sign). Make sure to exclude any innappropriate tweets from 'positive_tweets'"
                    },
                    {
                        role: "user",
                        content: aiTweetsInput
                    }
                ]
            });
    
            const {financialData, historicalPriceData, sector} = await pullFinancialInfo(req.query.company);
            
            // console.log("types: " + typeof(aiResponse.choices[0]) + " " + typeof(financialData) + " " + typeof(historicalPriceData) + " " + typeof(sector));

            const response = {
                ai_response: aiResponse.choices[0].message.content,
                financialData: financialData,
                historicalPriceData: historicalPriceData,
                sector: sector
            }

            const searchCompany = new SearchCompany(response);
            await searchCompany.save();

            response.financialData = JSON.stringify(financialData);
            response.historicalPriceData = JSON.stringify(historicalPriceData);
            response.sector = JSON.stringify(sector);

            res.json(response);
    
            console.log("RESPONSE: " + JSON.stringify(aiResponse.choices[0]))
        }
        catch (error){
            console.error(error);
        }
    }
}

/**
 * 
 * Gets tweets returned by searchMarketTweets (tweets containing #IPO, or #FinTech or #TechStartups, ... etc.) 
 * Sends these tweets to gpt-4 using OpenAI API with a prompt describing its task to find rising companies with high potential based on positive public sentiment. (Places extra weighting on tweets from reputable sources (high follower counts, professional account descriptions))
 * Returns AI response as a JSON HTTP response
 */
const getBreakoutCompanies = async (req, res) => {

    console.log("=> Getting breakout companies")

    const allTweets = await searchMarketTweets();
    const aiTweetsInput = JSON.stringify(allTweets);

    try{
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                {
                    role: "system",
                    content: "As an expert in gauging public sentiment, you will analyze tweets to spot rising companies with high potential, driven by growing positive sentiment, possibly signaling future success. You will be passed a JSON array containing information about various tweets. You should place extra weighting on the tweets that come from reputable sources (i.e. accounts with higher follower counts and professional descriptions who specialize in stock trading / analysis). You will respond with nothing other than a standard JSON array (don't use ticks like ```), and each element in the array will be a JSON object with the following fields: 'company' - the company's stock symbol/ticker (if you can't find this, then don't give me the company at all), 'positive_tweets' - an array with some notable tweets indicating positive sentiment (this array of tweets should be an array of JSON objects as they were passed to you), 'recommendation' - a final recommendation on whether to further investigate investing in the company (this should include a couple sentences of reasoning), 'confidence_ rate' - a percentage confidence rate (number only, no percentage sign). Make sure to exclude any innappropriate tweets from 'positive_tweets'"
                },
                {
                    role: "user",
                    content: aiTweetsInput
                }
            ]
        });

        /**
         * Get financial info for each company returned by GPT
         */
        
        
        let aiResponseParsed = JSON.parse(aiResponse.choices[0].message.content);

        console.log(aiResponseParsed)

        for (let i = 0; i < aiResponseParsed.length; i++){
            const yahooInfo = await pullFinancialInfo(aiResponseParsed[i].company);
            aiResponseParsed[i].yahooInfo = yahooInfo;
        }

        // res.json(aiResponseParsed)
        return aiResponseParsed;
    }
    catch (error){
        console.error(error);
        return null
    }
}

/**
 * 
 * Pulls trending / breakout company data from the database and sends it as an HTTP response
 */
const pullTrendingFromDB = async (req, res) => {
    try {
        console.log("=> Pulling trending companies from DB")
        let companies = await Company.find({});
        if (companies.length === 0){
            companies = await PastCompany.find({}).limit(3);
        }
        res.json(companies);
    } catch (error) {
        console.error('Error pulling companies from DB:', error);
        throw error;
    }
}

const checkCompanyValid = async (ticker) => {

    let companyValid;
    try {
        const financialData = await yahooFinance.quote(ticker);
        if (financialData){
            companyValid = true;
        }
    }
    catch(error){
        companyValid = false
    }

    return companyValid;
}

const getCompanyName = async (ticker) => {
    let companyName;
    if (await checkCompanyValid(ticker)){
        const searchYahoo = await yahooFinance.search(ticker);

        companyName = searchYahoo.quotes[0].shortname
    }
    return companyName;
}

const sendFinancialInfo = async (req, res) => {
    // const {financialData, historicalPriceData, sector} = await pullFinancialInfo(req.query.company);

    // console.log("=> financialData: " + financialData)

    // res.json({
    //     financialData: financialData,
    //     historicalPriceData: historicalPriceData,
    //     sector: sector
    // })

    const searchYahoo = await yahooFinance.search(req.query.company)
    res.json({
        searchYahoo: searchYahoo
    })
}

const pullFinancialInfo = async (company) => {
    console.log("=> Pulling financial info for company: " + company)

    /**
     * Get ticker
     */
    const searchYahoo = await yahooFinance.search(company)
    let ticker;

    try{
        ticker = searchYahoo.quotes[0].symbol;
        /**
         * Get financial data using ticker
         */
        console.log("=> Company ticker: " + ticker)
        const financialData = await yahooFinance.quote(ticker);
    
        /**
         * Get historical price data for last 3 months using ticker 
         */
        var currentDate = new Date();
    
        // Subtract three months from date
        currentDate.setMonth(currentDate.getMonth() - 3);
    
        // Format the date as 'YYYY-MM-DD'
        var formattedDate = currentDate.toISOString().slice(0, 10);
    
        const queryOptions = {period1: formattedDate}
        const historicalPriceData = await yahooFinance.historical(ticker, queryOptions);
    
        const sector = searchYahoo.quotes[0].sector
    
        return {
            financialData,
            historicalPriceData,
            sector
        }
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {getSentimentForSearch, getBreakoutCompanies, pullTrendingFromDB, sendFinancialInfo}