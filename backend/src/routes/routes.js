const {getSentimentForSearch, getBreakoutCompanies, pullTrendingFromDB, getFinancialInfo} = require('../controllers/searchController')
const express = require('express')

const router = express.Router()

router.route('/search-company').get(getSentimentForSearch);
router.route('/get-company-financial-info').get(getFinancialInfo)
router.route('/get-trending').get(pullTrendingFromDB);

/**
 * For testing
 */
// router.route('/get-breakout-companies').get(getBreakoutCompanies)

module.exports = router