const {OpenAI} = require('openai');
const dotenv = require('dotenv')
const {searchMarketTweets, searchSpecificCompanyTweets} = require('./twitterController')
const {prompt1} = require('../mockData/prompts')

dotenv.config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const getSentimentForSearch = async (req, res) => {

    console.log("=> Getting sentiment for company " + req.query.company)

    const allTweets = await searchSpecificCompanyTweets(req.query.company);
    
    let i;
    for (i = 0; i < allTweets.length; i++){
        console.log("--> " + allTweets[i])
    }
    
    const aiTweetsInput = allTweets;

    try{
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "In the movie limitless, Eddie Morra trades stocks based on \"the rumour mill\" (i.e, what people are saying about the stock rather than statistics). You are an expert in this type of stock trading. Given a group (passed as a JSON object) of tweet information about a particular company/stock, you can determine if the chatter on the company is positive or negative, and therefore whether to buy, sell, or hold the stock. You will be passed a JSON object containing the following fields: user - the username of the individual who tweeted, userDescription - the twitter bio of the user who made the tweet, userFollowerCount - the follower count of the user, text - the actual text content of the tweet. You should place extra weighting on the tweets that come from reputable sources (i.e. accounts with higher follower counts and professional descriptions who specialize in stock trading / analysis). You will respond with a JSON object with the following fields: reasoning - one or two sentences of reasoning and specific quotes of tweets that caught your attention, final_verdict - buy, sell, or hold, and confidence_rate - the percentage confidence rate in the verdict."
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
    }
    catch (error){
        console.error(error);
    }
}

const getBreakoutCompanies = async (req, res) => {

    console.log("=> Getting breakout companies")

    const allTweets = await searchMarketTweets();
    const aiTweetsInput = allTweets.toString();

    try{
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "In the world of investment, identifying promising companies early can be lucrative. Inspired by 'Limitless', where Eddie Morra leverages the rumor mill to trade stocks, you are an expert at spotting emerging companies with high potential based on public sentiment. Given a set of tweets about various companies, you analyze the chatter to identify companies with growing positive sentiment, potentially indicating future success. You will be passed a JSON object containing the following fields: user - the username of the individual who tweeted, userDescription - the twitter bio of the user who made the tweet, userFollowerCount - the follower count of the user, text - the actual text content of the tweet. You should place extra weighting on the tweets that come from reputable sources (i.e. accounts with higher follower counts and professional descriptions who specialize in stock trading / analysis). Your response will be an array, and each element in the array will be a JSON object with the following fields: company - the company's name, positive_tweets - an array with some notable tweets indicating positive sentiment, recommendation - a final recommendation on whether to further investigate investing in the company, confidence_ rate - a percentage confidence rate."
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
    }
    catch (error){
        console.error(error);
    }
}

module.exports = {getSentimentForSearch, getBreakoutCompanies}