const mongoose = require('mongoose');

// Define schema for positive tweets
const PositiveTweetSchema = new mongoose.Schema({
    user: String,
    userDescription: String,
    userFollowerCount: String,
    text: String
});

// Define schema for company
const CompanySchema = new mongoose.Schema({
    company: String,
    positive_tweets: [PositiveTweetSchema],
    recommendation: String,
    confidence_rate: Number
});

// Create and export the Company model
const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
