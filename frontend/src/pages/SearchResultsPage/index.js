import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import FinancialDashboard from '../../components/FinancialDashboard.js';
import './index.scss';

const mockSearchData = {
    reasoning: "Reasoning reasoning I like this stock its good mock reasoning",
    tweets: [
        {
            user: "user1",
            userFollowerCount: 10000,
            userDescription: "professional stock analyst",
            text: "I am so excited about this stock #stocks"
        },
        {
            user: "user2",
            userFollowerCount: 4033,
            userDescription: "A twitter user who loves stocks",
            text: "This stock is so exciting #StockMarket"
        }
    ],
    final_verdict: "buy",
    confidence_rate: 93
}

const mockFinancialData = {"language":"en-US","region":"US","quoteType":"EQUITY","typeDisp":"Equity","quoteSourceName":"Nasdaq Real Time Price","triggerable":true,"customPriceAlertConfidence":"HIGH","currency":"USD","marketState":"REGULAR","regularMarketChangePercent":10.537419,"regularMarketPrice":311.815,"exchange":"NMS","shortName":"Palo Alto Networks, Inc.","longName":"Palo Alto Networks, Inc.","messageBoardId":"finmb_25460099","exchangeTimezoneName":"America/New_York","exchangeTimezoneShortName":"EST","gmtOffSetMilliseconds":-18000000,"market":"us_market","esgPopulated":false,"hasPrePostMarketData":true,"firstTradeDateMilliseconds":"2012-07-20T13:30:00.000Z","priceHint":2,"regularMarketChange":29.725006,"regularMarketTime":"2024-02-26T18:09:51.000Z","regularMarketDayHigh":313.84,"regularMarketDayRange":{"low":286.79,"high":313.84},"regularMarketDayLow":286.79,"regularMarketVolume":14470030,"regularMarketPreviousClose":282.09,"bid":310.19,"ask":310.37,"bidSize":12,"askSize":14,"fullExchangeName":"NasdaqGS","financialCurrency":"USD","regularMarketOpen":288.52,"averageDailyVolume3Month":4915047,"averageDailyVolume10Day":11185280,"fiftyTwoWeekLowChange":135.515,"fiftyTwoWeekLowChangePercent":0.7686614,"fiftyTwoWeekRange":{"low":176.3,"high":380.84},"fiftyTwoWeekHighChange":-69.024994,"fiftyTwoWeekHighChangePercent":-0.18124408,"fiftyTwoWeekLow":176.3,"fiftyTwoWeekHigh":380.84,"fiftyTwoWeekChangePercent":49.64193,"earningsTimestamp":"2024-02-20T21:30:00.000Z","earningsTimestampStart":"2024-05-21T10:59:00.000Z","earningsTimestampEnd":"2024-05-27T12:00:00.000Z","trailingAnnualDividendRate":0,"trailingPE":48.268578,"trailingAnnualDividendYield":0,"epsTrailingTwelveMonths":6.46,"epsForward":6.2,"epsCurrentYear":5.51,"priceEpsCurrentYear":56.590744,"sharesOutstanding":323100000,"bookValue":13.502,"fiftyDayAverage":324.0862,"fiftyDayAverageChange":-12.27121,"fiftyDayAverageChangePercent":-0.03786403,"twoHundredDayAverage":260.8786,"twoHundredDayAverageChange":50.9364,"twoHundredDayAverageChangePercent":0.19524944,"marketCap":100747427840,"forwardPE":50.292744,"priceToBook":23.093987,"sourceInterval":15,"exchangeDataDelayedBy":0,"ipoExpectedDate":"2021-10-25T00:00:00.000Z","averageAnalystRating":"2.0 - Buy","tradeable":false,"cryptoTradeable":false,"displayName":"Palo Alto Networks","symbol":"PANW"}

const mockHistoricalPriceData = [{"date":"2024-02-20T00:00:00.000Z","open":362.850006,"high":369.290009,"low":359.820007,"close":366.089996,"adjClose":366.089996,"volume":10458800},{"date":"2024-02-21T00:00:00.000Z","open":275.200012,"high":275.980011,"low":260.089996,"close":261.970001,"adjClose":261.970001,"volume":43937300},{"date":"2024-02-22T00:00:00.000Z","open":274.130005,"high":276.809998,"low":265,"close":267.820007,"adjClose":267.820007,"volume":19297300},{"date":"2024-02-23T00:00:00.000Z","open":276.950012,"high":284.320007,"low":271.619995,"close":282.089996,"adjClose":282.089996,"volume":14878300},{"date":"2024-02-26T00:00:00.000Z","open":288.519989,"high":313.839996,"low":286.790009,"close":307.809998,"adjClose":307.809998,"volume":16137344}]

const SearchResultPage = () => {
    const [searchData, setSearchData] = useState({});
    const [financialData, setFinancialData] = useState({});
    const [historicalPriceData, setHistoricalPriceData] = useState([])
    const [loadingAI, setLoadingAI] = useState(true);
    const [loadingFinancials, setLoadingFinancials] = useState(true);
    const location = useLocation();

    let searchParams = new URLSearchParams(location.search);
    let companyParam = searchParams.get('company');
    const [queryCompany, setQueryCompany] = useState(companyParam);

    useEffect(() => {
        console.log("running use effect")
        let searchParams = new URLSearchParams(location.search);
        let companyParam = searchParams.get('company');
        if (companyParam !== queryCompany){
            console.log("companyParam changed, updating queryCompany")
            setQueryCompany(companyParam)
        }
        else{
            console.log("companyParams match, do nothing")
        }
    }, [location.search, queryCompany])
    

    useEffect(() => {
        setLoadingAI(true);
        setLoadingFinancials(true);
        const cachedSearchData = JSON.parse(localStorage.getItem('searchData'));
        const cachedHistoricalPriceData = localStorage.getItem('historicalPriceData');
        const cachedFinancialData = localStorage.getItem('financialData');

        console.log("type: " + typeof(cachedSearchData))
        console.log("type: " + typeof(cachedHistoricalPriceData))
        console.log("type: " + typeof(cachedFinancialData))

        if ((cachedSearchData && cachedHistoricalPriceData && cachedFinancialData) && queryCompany === cachedFinancialData.symbol){
            const convertCachedDataToJSON = async () => {
                setSearchData(JSON.parse(cachedSearchData));
                setHistoricalPriceData(JSON.parse(cachedHistoricalPriceData));
                setFinancialData(JSON.parse(cachedFinancialData));
                setLoadingAI(false);
                setLoadingFinancials(false);
            }
            convertCachedDataToJSON()
        }
        else{
            const fetchCompanyData = async () => {
                let data;
                try {
                    const response = await fetch(`http://localhost:8000/api/search-company?company=${queryCompany}`);
                    if (!response.ok) {
                        console.log(JSON.stringify(response));
                        throw new Error('Failed to fetch company data');
                    }
                    data = await response.json();
                    console.log(JSON.stringify(data));
                    setSearchData(JSON.parse(data.ai_response));
                    setFinancialData(JSON.parse(data.financialData));
                    setHistoricalPriceData(JSON.parse(data.historicalPriceData))

                    localStorage.setItem('searchData', JSON.stringify(data.ai_response));
                    localStorage.setItem('financialData', JSON.stringify(data.financialData));
                    localStorage.setItem('historicalPriceData', JSON.stringify(data.historicalPriceData));
                    /**
                     * Mocking
                     */
    
                    // setSearchData(mockSearchData)
                    setLoadingAI(false);
                    setLoadingFinancials(false)
                } catch (error) {
                    console.error('Error fetching company data:', error);
                }
    
                // try {
                //     const response = await fetch(`http://localhost:8000/api/get-company-financial-info?company=${queryCompany}`);
                //     if (!response.ok) {
                //         throw new Error('Failed to fetch financial data for company');
                //     }
                //     const data = await response.json();
                //     console.log("data: " + data)
                //     setFinancialData(data.financialData);
                //     setHistoricalPriceData(data.historicalPriceData)
                //     localStorage.setItem('financialData', JSON.stringify(data.financialData));
                //     localStorage.setItem('historicalPriceData', JSON.stringify(data.historicalPriceData));
                //     /**
                //      * Mocking
                //      */
    
                //     //
                //     // setHistoricalPriceData(mockHistoricalPriceData);
                //     // setFinancialData(mockFinancialData);
                //     setLoadingFinancials(false);
                // } catch (error) {
                //     console.error('Error fetching company data:', error);
                // }
            };
    
            fetchCompanyData();
        }

    }, [queryCompany]);

    console.log(loadingAI, loadingFinancials)
    console.log(window.innerWidth)

    return (
        <div className="search-results">
            <div className="results-container">
                {(loadingAI || loadingFinancials) ? (
                    <div className="loading-container">
                        <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>analyzing chatter</h1>
                        <div className="loading-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='heading-box-search' style={{backdropFilter: "blur(12px)"}}>
                            <div className='line' style={{marginTop: "0%"}}/>
                            <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>{queryCompany}</h1>
                            <div className='line'/>
                        </div>
                        <div className='result-box'>
                            <div className="result">
                                <p>{searchData.reasoning}</p>
                                <br></br>
                                <h3>noteable chatter:</h3>
                                <ul>
                                    {searchData.tweets.map((tweet, index) => (
                                        <li key={index} style={{padding: "10px", marginBottom: "6%"}}>
                                            <p style={{textAlign: "center", color: "#75d9fa"}}>@{tweet.user}</p>
                                            <p style={{opacity: "0.6", textAlign: "center", color: "#75d9fa"}}>{tweet.userDescription}</p><br/>
                                            "{tweet.text}""
                                        </li>
                                    ))}
                                </ul>
                                <h3>final verdict:</h3>
                                <p>{searchData.final_verdict}</p>
                                <h3>confidence rate:</h3>
                                <p>{searchData.confidence_rate}%</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <FinancialDashboard financialData={financialData} historicalPriceData={historicalPriceData}/>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResultPage;
