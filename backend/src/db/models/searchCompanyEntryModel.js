const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schema for a cached company that will be stored in the DB
 */

const tweetSchema = new Schema({
    user: String,
    userDescription: String,
    userFollowerCount: Number,
    text: String
});

const historicalPriceSchema = new Schema({
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    adjClose: Number,
    volume: Number
});

const aiResponseSchema = new Schema({
    reasoning: String,
    tweets: [tweetSchema],
    final_verdict: String,
    confidence_rate: Number
});

const financialDataSchema = new Schema({
    language: String,
    region: String,
    quoteType: String,
    typeDisp: String,
    quoteSourceName: String,
    triggerable: Boolean,
    customPriceAlertConfidence: String,
    contractSymbol: Boolean,
    headSymbolAsString: String,
    currency: String,
    marketState: String,
    regularMarketChangePercent: Number,
    regularMarketPrice: Number,
    underlyingSymbol: String,
    underlyingExchangeSymbol: String,
    exchange: String,
    shortName: String,
    exchangeTimezoneName: String,
    exchangeTimezoneShortName: String,
    gmtOffSetMilliseconds: Number,
    market: String,
    esgPopulated: Boolean,
    hasPrePostMarketData: Boolean,
    priceHint: Number,
    regularMarketChange: Number,
    regularMarketTime: Date,
    regularMarketDayHigh: Number,
    regularMarketDayRange: {
        low: Number,
        high: Number
    },
    regularMarketDayLow: Number,
    regularMarketVolume: Number,
    regularMarketPreviousClose: Number,
    bid: Number,
    ask: Number,
    fullExchangeName: String,
    regularMarketOpen: Number,
    fiftyTwoWeekLowChange: Number,
    fiftyTwoWeekLowChangePercent: Number,
    fiftyTwoWeekRange: {
        low: Number,
        high: Number
    },
    fiftyTwoWeekHighChange: Number,
    fiftyTwoWeekHighChangePercent: Number,
    fiftyTwoWeekLow: Number,
    fiftyTwoWeekHigh: Number,
    openInterest: Number,
    expireDate: Date,
    expireIsoDate: Number,
    sourceInterval: Number,
    exchangeDataDelayedBy: Number,
    tradeable: Boolean,
    cryptoTradeable: Boolean,
    symbol: String
});

const searchCompanySchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    ai_response: String,
    financialData: financialDataSchema,
    historicalPriceData: [historicalPriceSchema],
    companyName: String,
    sector: String
});

const SearchCompany = mongoose.model('searchedCompanies', searchCompanySchema);

module.exports = SearchCompany;
