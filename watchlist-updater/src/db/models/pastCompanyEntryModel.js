const mongoose = require('mongoose');

const positiveTweetSchema = new mongoose.Schema({
    user: String,
    userDescription: String,
    userFollowerCount: Number,
    text: String
});

const historicalPriceDataSchema = new mongoose.Schema({
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    adjClose: Number,
    volume: Number
});

const yahooInfoSchema = new mongoose.Schema({
    financialData: {
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
    },
    historicalPriceData: [historicalPriceDataSchema]
});

const PastCompanySchema = new mongoose.Schema({
    PastCompany: String,
    positive_tweets: [positiveTweetSchema],
    recommendation: String,
    confidence_rate: Number,
    yahooInfo: yahooInfoSchema
});

const PastCompany = mongoose.model('pastCompanies', PastCompanySchema);

module.exports = PastCompany;
