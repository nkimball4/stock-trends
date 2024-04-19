const User = require('../../../backend/src/db/models/userModel');
const yahooFinance = require('yahoo-finance2').default;
const {OpenAI} = require('openai');
const { Rettiwt } = require('rettiwt-api');

const rettiwt = new Rettiwt({ apiKey: process.env.RETTIWT_API_KEY });
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const updateWatchlistForUsers = async (users) => {
    console.log("updating watchlists")
    for(const user of users){
        console.log("Updating watchlist for user: " + user.loginInfo.name);
        const companies = user.userData;
        console.log("companies: " + companies)
        for(const company of companies){
            const companyName = company.financialData.shortname;
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
                
            }
            catch(error){
                console.error(error);
            }
        }
    }
}

const searchSpecificCompanyTweets = async (companyName) => {
    console.log("=> Searching tweets containing company information");

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
    console.log("=> Returning all tweets")
    return allTweets
}



module.exports = updateWatchlistForUsers;