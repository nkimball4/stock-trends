import React from 'react';
import { useState, useEffect } from 'react';
import FinancialDashboard from '../../components/FinancialDashboard.js';
import './index.scss'

const mockArray = [
    {
        "company": "XYZ Technology",
        "positive_tweets": [
            {
                "user": "StocksGuru123",
                "userDescription": "Passionate about stock trading. Expert analyst in the tech industry.",
                "userFollowerCount": 10000,
                "text": "Just read the latest financial report on XYZ Technology. Looks like they're breaking new ground with their innovative products! #bullish"
            },
            {
                "user": "InvestorJane",
                "userDescription": "Investment consultant with a focus on emerging tech companies. Sharing insights daily.",
                "userFollowerCount": 5000,
                "text": "Impressed by the growth potential of XYZ Technology. Their recent partnerships are a clear indicator of future success. #investing #tech"
            }
        ],
        "recommendation": "Strong Buy",
        "confidence_rate": 80
    },
    {
        "company": "ABC Pharma",
        "positive_tweets": [
            {
                "user": "BiotechAnalysis",
                "userDescription": "Biotechnology enthusiast tracking breakthroughs in the pharma sector.",
                "userFollowerCount": 8000,
                "text": "Exciting news from ABC Pharma regarding their latest drug trials. Positive results could lead to significant market share gains. #biotech #investing"
            },
            {
                "user": "PharmaInvestor",
                "userDescription": "Pharmaceutical industry investor with a focus on long-term growth opportunities.",
                "userFollowerCount": 6000,
                "text": "ABC Pharma's commitment to research and development is commendable. Expecting great things from this innovative company. #pharma #investment"
            }
        ],
        "recommendation": "Buy",
        "confidence_rate": 70
    },
]

const mockFinancialData = {"language":"en-US","region":"US","quoteType":"EQUITY","typeDisp":"Equity","quoteSourceName":"Nasdaq Real Time Price","triggerable":true,"customPriceAlertConfidence":"HIGH","currency":"USD","marketState":"REGULAR","regularMarketChangePercent":10.537419,"regularMarketPrice":311.815,"exchange":"NMS","shortName":"Palo Alto Networks, Inc.","longName":"Palo Alto Networks, Inc.","messageBoardId":"finmb_25460099","exchangeTimezoneName":"America/New_York","exchangeTimezoneShortName":"EST","gmtOffSetMilliseconds":-18000000,"market":"us_market","esgPopulated":false,"hasPrePostMarketData":true,"firstTradeDateMilliseconds":"2012-07-20T13:30:00.000Z","priceHint":2,"regularMarketChange":29.725006,"regularMarketTime":"2024-02-26T18:09:51.000Z","regularMarketDayHigh":313.84,"regularMarketDayRange":{"low":286.79,"high":313.84},"regularMarketDayLow":286.79,"regularMarketVolume":14470030,"regularMarketPreviousClose":282.09,"bid":310.19,"ask":310.37,"bidSize":12,"askSize":14,"fullExchangeName":"NasdaqGS","financialCurrency":"USD","regularMarketOpen":288.52,"averageDailyVolume3Month":4915047,"averageDailyVolume10Day":11185280,"fiftyTwoWeekLowChange":135.515,"fiftyTwoWeekLowChangePercent":0.7686614,"fiftyTwoWeekRange":{"low":176.3,"high":380.84},"fiftyTwoWeekHighChange":-69.024994,"fiftyTwoWeekHighChangePercent":-0.18124408,"fiftyTwoWeekLow":176.3,"fiftyTwoWeekHigh":380.84,"fiftyTwoWeekChangePercent":49.64193,"earningsTimestamp":"2024-02-20T21:30:00.000Z","earningsTimestampStart":"2024-05-21T10:59:00.000Z","earningsTimestampEnd":"2024-05-27T12:00:00.000Z","trailingAnnualDividendRate":0,"trailingPE":48.268578,"trailingAnnualDividendYield":0,"epsTrailingTwelveMonths":6.46,"epsForward":6.2,"epsCurrentYear":5.51,"priceEpsCurrentYear":56.590744,"sharesOutstanding":323100000,"bookValue":13.502,"fiftyDayAverage":324.0862,"fiftyDayAverageChange":-12.27121,"fiftyDayAverageChangePercent":-0.03786403,"twoHundredDayAverage":260.8786,"twoHundredDayAverageChange":50.9364,"twoHundredDayAverageChangePercent":0.19524944,"marketCap":100747427840,"forwardPE":50.292744,"priceToBook":23.093987,"sourceInterval":15,"exchangeDataDelayedBy":0,"ipoExpectedDate":"2021-10-25T00:00:00.000Z","averageAnalystRating":"2.0 - Buy","tradeable":false,"cryptoTradeable":false,"displayName":"Palo Alto Networks","symbol":"PANW"}

const mockHistoricalPriceData = [{"date":"2024-02-20T00:00:00.000Z","open":362.850006,"high":369.290009,"low":359.820007,"close":366.089996,"adjClose":366.089996,"volume":10458800},{"date":"2024-02-21T00:00:00.000Z","open":275.200012,"high":275.980011,"low":260.089996,"close":261.970001,"adjClose":261.970001,"volume":43937300},{"date":"2024-02-22T00:00:00.000Z","open":274.130005,"high":276.809998,"low":265,"close":267.820007,"adjClose":267.820007,"volume":19297300},{"date":"2024-02-23T00:00:00.000Z","open":276.950012,"high":284.320007,"low":271.619995,"close":282.089996,"adjClose":282.089996,"volume":14878300},{"date":"2024-02-26T00:00:00.000Z","open":288.519989,"high":313.839996,"low":286.790009,"close":307.809998,"adjClose":307.809998,"volume":16137344}]

const scrollCarousel = (direction) => {
    const container = document.querySelector('.company-list');
    const amountToScroll = 300; // Change this value according to your design
    container.scrollBy({
        top: 0,
        left: direction * amountToScroll,
        behavior: 'smooth'
    });
};

const CompanyCard = ({ companyData }) => {
//   const { company, positive_tweets, recommendation, yahooInfo, confidence_rate } = companyData;

    console.log(JSON.stringify(companyData))

  return (
    <>
      {companyData.yahooInfo && (
          <div className="company-card">
                <h2 style={{position: "relative", left: "50%", transform: "translateX(-50%)", zIndex: "10000", textWrap: "nowrap"}}>{companyData.company}</h2>
                <div className='company-card-content'>
                    <p>{companyData.recommendation}</p><br></br>
                    <p><strong>confidence rate:</strong> {companyData.confidence_rate}%</p><br></br>
                    <div>
                        <strong>notable chatter:</strong>
                        <ul>
                            {companyData.positive_tweets.map((tweet, index) => (
                                <li key={index} style={{padding: "10px"}}>
                                    <p style={{textAlign: "center", color: "#75d9fa"}}>@{tweet.user}</p>
                                    <p style={{opacity: "0.6", textAlign: "center", color: "#75d9fa"}}>{tweet.userDescription}</p><br/>
                                    "{tweet.text}""
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <FinancialDashboard financialData={companyData.yahooInfo.financialData} historicalPriceData={companyData.yahooInfo.historicalPriceData}/>
                </div>
            </div>
        )}
    </>
  );
};

const Homepage = () => {

    const [trendingData, setTrendingData] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    useEffect(() => {
        const fetchTrendingData = async () => {
            let data;
            try {
                const response = await fetch('http://localhost:8000/api/get-trending');
                if (!response.ok) {
                    throw new Error('Failed to fetch trending data');
                }
                data = await response.json();
                console.log(data)
                setTrendingData(data);
            } catch (error) {
                console.error('Error fetching trending data:', error);
            }
        };

        fetchTrendingData();
    }, []);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    
    return (
        <div className="home-page-wrapper">
            <div className='top-section-wrapper'>
                <div className="video-container">
                    <video src={process.env.PUBLIC_URL + `/videos/city.mp4`} autoPlay loop muted className='video-bg'/>
                    <div className='darken-overlay'></div>
                </div>
                <div className='heading-box' style={{textWrap: "nowrap", position: "absolute", bottom: "0", left: "5%"}}>
                    <h1 style={{fontWeight: "normal", opacity: "1", fontSize: "3.5rem"}}>welcome&nbsp;to&nbsp;chatter.</h1>
                    <h2 style={{fontWeight: "normal",opacity: "0.8", fontSize: "2rem"}}>monitoring stock momentum through AI</h2>
                {/* <   div className='line' style={{marginTop: "0%"}}/> */}
                    {/* <div className='line'/> */}
                </div>
            </div>
            <div className='trending-wrapper'>
                <h1 style={{fontWeight: "normal", position: "absolute", right: "8%", top: "4%", opacity: "1", color: "white", marginBottom: "10%"}}>stocks to watch</h1>
                <div className={`trending-carousel ${isFullScreen ? 'fullscreen' : ''}`}>
                    <img src={process.env.PUBLIC_URL + `/images/full-screen-icon.svg`} title="Toggle full screen" className='full-screen-button' onClick={toggleFullScreen}>
                    </img>
                    <button className="carousel-button left" onClick={() => scrollCarousel(-1)}>&lt;</button>
                    <div className="company-list">
                        {() => {
                            console.log("TRENDING " + trendingData)
                        }}
                        {trendingData.map((companyData, index) => (
                            <CompanyCard key={index} companyData={companyData} />
                        ))}
                    </div>
                    <button className="carousel-button right" onClick={() => scrollCarousel(1)}>&gt;</button>
                </div>
            </div>
            {/* <div className='about-wrapper'>
                    <h1 style={{fontWeight: "normal", textAlign: "center", opacity: "0.7", color: "black"}}>what is chatter?</h1>
                
                <div className='about-box' style={{color: "black"}}>
                    
                </div>
            </div> */}
        </div>
    );
};

export default Homepage;
