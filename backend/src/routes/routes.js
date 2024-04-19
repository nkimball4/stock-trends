const {getSentimentForSearch, getBreakoutCompanies, pullTrendingFromDB, sendFinancialInfo, getCompanyPhoto} = require('../controllers/searchController');
const {createAccount, getAccount, addToWatchlist, checkIsCompanyOnUserWatchlist, getUserWatchlist} = require('../controllers/accountController');
const express = require('express');

const router = express.Router()

/**
 *	/api/search-company 
GET, query params: company=<company name to be searched> 
 
Uses an unofficial Twitter API to pull recent tweets about the company, along with username, follower count, and account description of each tweeter, formats the information, 
and sends it to GPT-4 using OpenAI’s API with a prompt describing its task: to analyze the tweets and determine whether the chatter on the company is positive or negative, 
and therefore whether to buy, hold, or sell the stock. 
 
The AI responds with a JSON object containing:  
 
-	an analysis of the company’s market position based on how people are talking about it, placing extra weight on tweets from Twitter accounts with high follower counts and descriptions that mention backgrounds in professional stock trading / analysis.  
 
-	A final verdict: buy, sell, or hold 
 
-	A confidence percentage 
 
-	A few notable tweets that helped the AI come to its decision 

This endpoint then uses the Yahoo Finance API to pull historical price data, and again to pull live price data. These two Yahoo responses are combined, along with the ai_response, 
and sent in a JSON response to the client, which then creates a dashboard to display the information.
All of this data is then added to a “seearchedCompanies” cache in the database, in order to improve the average response time. The cache is cleared every 15 minutes.
 */
router.route('/search-company').get(getSentimentForSearch);

/**
 *	/api/get-trending 
Every hour, a cron job is scheduled to run on the server. This cron job extracts recent tweet information for tweets containing any of 
#StockMarket, #Investing, #FinTech, #TechStartups, #EmergingMarkets, #IPO, #StockPicks and #Upgrades. 
This tweet information is sent to GPT-4, with a prompt describing its task to spot rising companies with high potential, based on growing positive sentiment. 
The AI’s response is structured like the outline above. This hourly response is added to a database (MongoDB), and as the client homepage is loading, it will query this endpoint which extracts 
the current trending company information from the database and sends it as a response so that the companies can be displayed to the user.  .

 */
router.route('/get-trending').get(pullTrendingFromDB);

/**
 * /api/get-user-watchlist
POST, data: {userEmail} 

When a logged-in user visits the “my watchlist” page (the tab is not visible unless a user is logged in), this endpoint sends the user’s email to the backend. 
The server will then pull the user’s watchlist from the database and send it in a JSON response. 

 */
router.route('/get-user-watchlist').post(getUserWatchlist);

/**
 *	/api/create-account
POST, data: {name, email, password, confirmPassword, acknowledge} 

When a user visits the “sign up” page, they are prompted for their name, email, password, confirmation of password, and an acknowledgement 
(acknowledging that this website is a tool for monitoring stock momentum, may not be accurate, and further research should be done before investing). 
The information is posted to this endpoint. The server then:
•	checks passwords match (if not, return 400)
•	checks that user does not already exist (if it does, return 400)
•	creates a new user in the database. (returns 200)

 */
router.route('/create-account').post(createAccount);

/**
 *	/api/get-account
POST, data: {userEmail, password} 

When a user attempts to log in, this the client posts to this endpoint. The server validates the login. If the login is invalid, a 400 status is sent. 
If the login is valid, a 200 is sent along with the user’s associated data from the database. (user info, watchlist data).

 */
router.route('/get-account').post(getAccount);

/**
 *	/api/add-to-watchlist
POST, data: {email, companyData} 

When a company is searched, there is a star beside the company’s name. (Figure 4). When that star is clicked, if the client is logged into an account, the client sends a 
POST request to this endpoint with the logged in user’s email, and the company’s data. This company information is added to the user’s watchlist in the database, 
and a 200 is returned.

 */
router.route('/add-to-watchlist').post(addToWatchlist);

/**
 *	/api/is-company-on-watchlist
POST, data: {userEmail, companyName} 

When a company is searched, the client post’s to this endpoint. The server checks if a company with the corresponding name already exists in the user’s watchlist. 
A JSON response containing either “true” or “false” is returned, along with a 200 status. This information is used by the client to determine whether to show a star or a 
checkmark beside the company name (indicating whether the company can be added to watchlist, or if it is already on watchlist).

 */
router.route('/is-company-on-watchlist').post(checkIsCompanyOnUserWatchlist);


/**
 *	/api/get-company-photo
GET, query params: company=<company name>

Currently not in use on the client side, but this is a working API for obtaining a company’s logo (uses the clearbit API under the hood). 

 */
router.route('/get-company-photo').get(getCompanyPhoto)


/**
 * For testing
*/
router.route('/get-company-financial-info').get(sendFinancialInfo)
router.route('/get-breakout-companies').get(getBreakoutCompanies)
router.route('/send-financial-info').get(sendFinancialInfo)

module.exports = router