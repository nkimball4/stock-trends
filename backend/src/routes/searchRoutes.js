const {getSentimentForSearch, getBreakoutCompanies} = require('../controllers/searchController')
const express = require('express')

const router = express.Router()

router.route('/search-company').get(getBreakoutCompanies)
// router.route('/get-breakout-companies').get(getBreakoutCompanies)

module.exports = router