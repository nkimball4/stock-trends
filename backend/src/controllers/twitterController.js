const dotenv = require('dotenv');
const { Rettiwt } = require('rettiwt-api');

dotenv.config();

/**
 * NOT to be used directly. Functions should be called by the search controller.
 */

const rettiwt = new Rettiwt({ apiKey: process.env.RETTIWT_API_KEY });

const hashtags = ['#StockMarket', '#Investing', '#FinTech', '#TechStartups', '#EmergingMarkets', '#IPO', '#StockPicks', '#Upgrades']

/**
 * 
 * Pull tweets containing relevant hashtags, add tweet information to allTweets array and return it
 */
const searchMarketTweets = async () => {

    console.log("=> Searching tweets containing relevant hashtags");

    let allTweets = []
    for (const hashtag of hashtags){
        try{
            /**
             * Pull recent tweets containing relevant hashtags (defined in the hashtags array)
             */
            const response = await rettiwt.tweet.search({
                includeWords: [hashtag]
            }, 20);
            /**
             * For every tweet in API response, add tweet information to an array as a JS object (like JSON)
             */
            response.list.forEach(tweet => {
                allTweets.push({
                    user: tweet.tweetBy.userName,
                    userDescription: tweet.tweetBy.description,
                    userFollowerCount: tweet.tweetBy.followersCount,
                    text: tweet.fullText
                });
            });
        }
        catch(error){
            console.error("Error fetching tweet: " + error)
        }
    }
    /**
     * Return array with tweet information
     */
    console.log("=> Returning all tweets")
    return allTweets

}

/**
 * 
 * Pull tweets about a specific company, add tweet information to allTweets array, return it.
 */
const searchSpecificCompanyTweets = async (companyName) => {
    console.log("=> Searching tweets containing company information");

    let allTweets = []
    try{
        /**
         * Pull recent tweets containing company name
         */
        const response = await rettiwt.tweet.search({
            includeWords: [companyName]
        }, 20);
        /**
         * For every tweet in API response, add tweet information to an array as a JS object (like JSON)
         */
        response.list.forEach(tweet => {
            allTweets.push({
                user: tweet.tweetBy.userName,
                userDescription: tweet.tweetBy.description,
                userFollowerCount: tweet.tweetBy.followersCount,
                text: tweet.fullText
            });
        });
    }
    catch(error){
        console.error("Error fetching tweet: " + error)
    }
    /**
     * Return array with tweet information
     */
    console.log("=> Returning all tweets")
    return allTweets
}

module.exports = {searchSpecificCompanyTweets, searchMarketTweets};

