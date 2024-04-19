const mongoose = require('mongoose');

const loginInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  acknowledge: {
    type: Boolean,
    required: true
  }
});

const tweetSchema = new mongoose.Schema({
    user: String,
    userDescription: String,
    userFollowerCount: Number,
    text: String
});

const historicalPriceSchema = new mongoose.Schema({
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    adjClose: Number,
    volume: Number
});

const aiResponseSchema = new mongoose.Schema({
    reasoning: String,
    tweets: [tweetSchema],
    final_verdict: String,
    confidence_rate: Number
});

const financialDataSchema = new mongoose.Schema({
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

const companySchema = new mongoose.Schema({
    ai_response: String,
    financialData: financialDataSchema,
    historicalPriceData: [historicalPriceSchema],
    sector: String
});

const userSchema = new mongoose.Schema({
    userData: [companySchema],
    loginInfo: loginInfoSchema
})

const User = mongoose.model('user', userSchema);

module.exports = User;
