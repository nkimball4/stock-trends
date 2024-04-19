const {OpenAI} = require('openai');
const dotenv = require('dotenv')
const {searchMarketTweets, searchSpecificCompanyTweets} = require('./twitterController')
const Company = require('../db/models/companyEntryModel')
const PastCompany = require('../db/models/pastCompanyEntryModel')
const SearchCompany = require('../db/models/searchCompanyEntryModel');
const User = require('../db/models/userModel');
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

    /**
     * Last minute adjustment, was checking validity of company names using the yahoo finance API. Unfortunately this went down this week and is down for the time being.
     */
    // if (await checkCompanyValid(req.query.company)){
    if (true){
        /**
         * Get full name for company from searched ticker
         */
        const companyName = await getCompanyName(req.query.company)

        /**
         * Check cache for company name. If the company has been searched, return the cached entry. 
         */
        console.log("=> Checking cache")
        const cachedCompanies = await SearchCompany.find({});
        for (let i = 0; i < cachedCompanies.length; i++){
            if (cachedCompanies[i].financialData.shortName === companyName){
                console.log("=> Cached entry found")
                res.json({
                    ai_response: cachedCompanies[i].ai_response,
                    financialData: JSON.stringify(cachedCompanies[i].financialData),
                    historicalPriceData: JSON.stringify(cachedCompanies[i].historicalPriceData),
                    companyName: JSON.stringify(cachedCompanies[i].companyName),
                    sector: JSON.stringify(cachedCompanies[i].sector)
                });

                /**
                 * kill function here
                 */
                return;
            }
        }

        /**
         * If not cached, pull recent tweets containing the company's name
         */
        const allTweets = await searchSpecificCompanyTweets(companyName);
        
        let i;
        for (i = 0; i < allTweets.length; i++){
            console.log("--> " + allTweets[i].text)
        }
        
        const aiTweetsInput = "Company: " + companyName + " Tweets: " + JSON.stringify(allTweets);
        console.log(aiTweetsInput);
    
        /**
         * Send tweet information as a JSON object to GPT-4 using OpenAI's API, with the prompt: 
         * 
         * In the movie limitless, Eddie Morra trades stocks based on \"the rumour mill\" (i.e, what people are saying about the stock rather than statistics). 
         * You are an expert in this type of stock trading. Given a group (passed as a JSON object) of tweet information about a particular company/stock, you can determine if the 
         * chatter on the company is positive or negative, and therefore whether to buy, sell, or hold the stock. You will be passed a JSON object containing the following fields: 
         * user - the username of the individual who tweeted, 
         * userDescription - the twitter bio of the user who made the tweet, 
         * userFollowerCount - the follower count of the user, 
         * text - the actual text content of the tweet. 
         * You will respond with nothing except a standard JSON object (not a string, and please don't use ```json) with the following fields: 
         * 'reasoning' - detailed reasoning specific to the company that led you to this verdict (Use the company's name, do not be vague), 
         * 'tweets' - an array of notable tweets that swayed you towards your verdict (each tweet given as a JSON object as it was passed to you), 
         * 'final_verdict' - buy, sell, or hold, and 
         * 'confidence_rate' - the percentage confidence rate in the verdict (a number only, no percentage sign).
         *  
         * Exclude any innappropriate tweets from 'positive_tweets'
         */
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
    
            /**
             * Using the yahooFinance API, pull price data for the last 3 months, as well as live stock data
             * (Currently, API is down so this data is static and coming from the database)
             */
            const {financialData, historicalPriceData, sector} = await pullFinancialInfo(req.query.company);
            
            /**
             * Create response object containing the AI's response, the Yahoo Finance financial data for the company, companyName, and sector
             */
            const response = {
                ai_response: aiResponse.choices[0].message.content,
                financialData: financialData,
                historicalPriceData: historicalPriceData,
                companyName: companyName,
                sector: sector,
            }

            /**
             * Cache this response
             */
            const searchCompany = new SearchCompany(response);
            await searchCompany.save();

            /**
             * Convert response to string and send
             */
            response.financialData = JSON.stringify(financialData);
            response.historicalPriceData = JSON.stringify(historicalPriceData);
            response.sector = JSON.stringify(sector);

            res.status(200).json(response);
    
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

    /**
     * Pulls tweet information for tweets containing relevant hashtags (outlined in searchMarketTweets function)
     */
    const allTweets = await searchMarketTweets();
    const aiTweetsInput = JSON.stringify(allTweets);

    /**
     * Send tweet information as a JSON object to GPT-4 using OpenAI's API, with the prompt: 
     * 
     * "As an expert in gauging public sentiment, you will analyze tweets to spot rising companies with high potential, driven by growing positive sentiment, 
     * possibly signaling future success. You will be passed a JSON array containing information about various tweets. You should place extra weighting on the tweets that come 
     * from reputable sources (i.e. accounts with higher follower counts and professional descriptions who specialize in stock trading / analysis). 
     * You will respond with nothing other than a standard JSON array (don't use ticks like ```), and each element in the array will be a JSON object with the following fields: 
     * 'company' - the company's stock symbol/ticker (if you can't find this, then don't give me the company at all), 
     * 'positive_tweets' - an array with some notable tweets indicating positive sentiment (this array of tweets should be an array of JSON objects as they were passed to you), 
     * 'recommendation' - a final recommendation on whether to further investigate investing in the company (this should include a couple sentences of reasoning), 
     * 'confidence_ rate' - a percentage confidence rate (number only, no percentage sign).
     * 
     * Exclude any innappropriate tweets from 'positive_tweets'"
     */
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
         * Get financial info for each company returned by AI
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
            companies = await PastCompany.find({}).sort({_id:-1}).limit(3);
        }
        res.json(companies);
    } catch (error) {
        console.error('Error pulling companies from DB:', error);
        throw error;
    }
}

/**
 * 
 * @param  ticker for company (searched by user)
 * @returns true or false depending on the response of the Yahoo Finance API when the ticker is searched
 * 
 * The "quote" Yahoo Finance API that I was using just went down. This is currently not in use.
 */
const checkCompanyValid = async (ticker) => {

    console.log("=> Checking if company with ticker " + ticker + " is valid")
    let companyValid;
    try {
        console.log("=> Getting data for company from yahoo finance")
        const financialData = await yahooFinance.quote(ticker);
        if (financialData){
            companyValid = true;
            console.log("=> Company is valid")
        }
    }
    catch(error){
        companyValid = false
        console.log("=> Company is not valid: " + error)
    }

    return companyValid;
}


/**
 * 
 * @param ticker searched by user
 * @returns company's name, given by Yahoo Finance search API
 */
const getCompanyName = async (ticker) => {
    let companyName;
    if (true){
        const searchYahoo = await yahooFinance.search(ticker);

        companyName = searchYahoo.quotes[0].shortname
    }
    return companyName;
}


const pullFinancialInfo = async (company) => {
    const user = await User.findOne({'loginInfo.email': 'testAccount@gmail.com'});
    console.log("USER::: " + user)
    const companies = user.userData;
    console.log("COMPANIES::: " + companies)
    return {
        financialData: companies[0].financialData,
        historicalPriceData: companies[0].historicalPriceData,
        sector: companies[0].sector
    }
}

// const pullFinancialInfo = async (company) => {
//     console.log("=> Pulling financial info for company: " + company)

//     /**
//      * Get ticker
//      */
//     const searchYahoo = await yahooFinance.search(company)
//     let ticker;

//     try{
//         ticker = searchYahoo.quotes[0].symbol;
//         /**
//          * Get financial data using ticker
//          */
//         console.log("=> Company ticker: " + ticker)
//         const financialData = await yahooFinance.quote(ticker);
    
//         /**
//          * Get historical price data for last 3 months using ticker 
//          */
//         var currentDate = new Date();
    
//         // Subtract three months from date
//         currentDate.setMonth(currentDate.getMonth() - 3);
    
//         // Format the date as 'YYYY-MM-DD'
//         var formattedDate = currentDate.toISOString().slice(0, 10);
    
//         const queryOptions = {period1: formattedDate}
//         const historicalPriceData = await yahooFinance.historical(ticker, queryOptions);
    
//         const sector = searchYahoo.quotes[0].sector
    
//         return {
//             financialData,
//             historicalPriceData,
//             sector
//         }
//     }
//     catch(error){
//         console.log(error)
//     }
// }



/**
 * The following two functions are not in use by the website right now, but 
 * 
 * Function for pulling company domain. This is used to then get the company's logo. Shown in Design Document.
 */
const getCompanyDomain = async (companyName) => {
    const apiKey = process.env.CLEARBIT_API_KEY;
    const url = `https://company.clearbit.com/v1/domains/find?name=${encodeURIComponent(companyName)}`;
    const headers = {
        'Authorization': `Bearer ${apiKey}`
    };
    try {
        const response = await fetch(url, { headers });
        console.log(response)
        if (response.ok) {
            const data = await response.json();
            if (data && data.logo) {
                return data.logo;
            }
        }
        else{
            throw new Error('Company domain not found');
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

/**
 * Function for pulling company logo
 */
const getCompanyPhoto = async (req, res) => {
    const logo = await getCompanyDomain(req.query.company);

    res.json(logo)
}

/**
 * 
 * Function for API testing, not in use 
 */
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

module.exports = {getSentimentForSearch, getBreakoutCompanies, pullTrendingFromDB, sendFinancialInfo, getCompanyPhoto}