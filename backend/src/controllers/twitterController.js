const dotenv = require('dotenv');
const { Rettiwt } = require('rettiwt-api');

dotenv.config();

/**
 * NOT to be used directly. Functions should be called by the search controller.
 */

const rettiwt = new Rettiwt({ apiKey: process.env.RETTIWT_API_KEY });

const hashtags = ['#StockMarket', '#Investing', '#FinTech', '#TechStartups', '#EmergingMarkets', '#IPO', '#StockPicks', '#Upgrades']
const searchMarketTweets = async () => {
    let allTweets = []
    for (const hashtag of hashtags){
        try{
            const response = await rettiwt.tweet.search({
                includeWords: [hashtag]
            });
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
    return allTweets

}

const searchSpecificCompanyTweets = async (companyName) => {
    let allTweets = []
    try{
        const response = await rettiwt.tweet.search({
            includeWords: [companyName]
        }, 20);
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
    return allTweets
}

module.exports = {searchSpecificCompanyTweets, searchMarketTweets};

