const {getSentimentForSearch, getBreakoutCompanies, pullTrendingFromDB, sendFinancialInfo} = require('../controllers/searchController');
const {createAccount, getAccount} = require('../controllers/accountController');
const express = require('express');

const router = express.Router()

router.route('/search-company').get(getSentimentForSearch);
router.route('/get-company-financial-info').get(sendFinancialInfo)
router.route('/get-trending').get(pullTrendingFromDB);

router.route('/create-account').post(createAccount);
router.route('/get-account').post(getAccount);

/**
 * For testing
 */
router.route('/get-breakout-companies').get(getBreakoutCompanies)

module.exports = router