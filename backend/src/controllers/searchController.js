const {OpenAI} = require('openai');
const dotenv = require('dotenv')
const {searchMarketTweets, searchSpecificCompanyTweets} = require('./twitterController')
const Company = require('../db/models/companyEntryModel')
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

    const allTweets = await searchSpecificCompanyTweets(req.query.company);
    
    let i;
    for (i = 0; i < allTweets.length; i++){
        console.log("--> " + allTweets[i].text)
    }
    
    const aiTweetsInput = "Company: " + req.query.company + " Tweets: " + JSON.stringify(allTweets);
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

        res.json({
            ai_response: aiResponse.choices[0]
        });

        console.log("RESPONSE: " + JSON.stringify(aiResponse.choices[0]))
    }
    catch (error){
        console.error(error);
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
                    content: "As an expert in gauging public sentiment, you will analyze tweets to spot rising companies with high potential, driven by growing positive sentiment, possibly signaling future success. You will be passed a JSON array containing information about various tweets. You should place extra weighting on the tweets that come from reputable sources (i.e. accounts with higher follower counts and professional descriptions who specialize in stock trading / analysis). You will respond with nothing other than a standard JSON array, and each element in the array will be a JSON object with the following fields: 'company' - the company's name, 'positive_tweets' - an array with some notable tweets indicating positive sentiment (this array of tweets should be an array of JSON objects as they were passed to you), 'recommendation' - a final recommendation on whether to further investigate investing in the company (this should include a couple sentences of reasoning), 'confidence_ rate' - a percentage confidence rate (number only, no percentage sign). Make sure to exclude any innappropriate tweets from 'positive_tweets'"
                },
                {
                    role: "user",
                    content: aiTweetsInput
                }
            ]
        });

        return aiResponse.choices[0].message.content;
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
        const companies = await Company.find({});
        res.json(companies);
    } catch (error) {
        console.error('Error pulling companies from DB:', error);
        throw error;
    }
}

const getFinancialInfo = async (req, res) => {

    /**
     * Get ticker
     */
    const searchYahoo = await yahooFinance.search(req.query.company)
    const ticker = searchYahoo.quotes[0].symbol;

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

    res.json({
        financialData: financialData,
        historicalPriceData: historicalPriceData,
        sector: searchYahoo.quotes[0].sector
    })
}

module.exports = {getSentimentForSearch, getBreakoutCompanies, pullTrendingFromDB, getFinancialInfo}