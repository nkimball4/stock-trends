import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import FinancialDashboard from '../../components/FinancialDashboard.js';
import './index.scss';

const mockSearchData1 = {
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

const mockFinancialData1 = {"language":"en-US","region":"US","quoteType":"EQUITY","typeDisp":"Equity","quoteSourceName":"Nasdaq Real Time Price","triggerable":true,"customPriceAlertConfidence":"HIGH","currency":"USD","marketState":"REGULAR","regularMarketChangePercent":10.537419,"regularMarketPrice":311.815,"exchange":"NMS","shortName":"Palo Alto Networks, Inc.","longName":"Palo Alto Networks, Inc.","messageBoardId":"finmb_25460099","exchangeTimezoneName":"America/New_York","exchangeTimezoneShortName":"EST","gmtOffSetMilliseconds":-18000000,"market":"us_market","esgPopulated":false,"hasPrePostMarketData":true,"firstTradeDateMilliseconds":"2012-07-20T13:30:00.000Z","priceHint":2,"regularMarketChange":29.725006,"regularMarketTime":"2024-02-26T18:09:51.000Z","regularMarketDayHigh":313.84,"regularMarketDayRange":{"low":286.79,"high":313.84},"regularMarketDayLow":286.79,"regularMarketVolume":14470030,"regularMarketPreviousClose":282.09,"bid":310.19,"ask":310.37,"bidSize":12,"askSize":14,"fullExchangeName":"NasdaqGS","financialCurrency":"USD","regularMarketOpen":288.52,"averageDailyVolume3Month":4915047,"averageDailyVolume10Day":11185280,"fiftyTwoWeekLowChange":135.515,"fiftyTwoWeekLowChangePercent":0.7686614,"fiftyTwoWeekRange":{"low":176.3,"high":380.84},"fiftyTwoWeekHighChange":-69.024994,"fiftyTwoWeekHighChangePercent":-0.18124408,"fiftyTwoWeekLow":176.3,"fiftyTwoWeekHigh":380.84,"fiftyTwoWeekChangePercent":49.64193,"earningsTimestamp":"2024-02-20T21:30:00.000Z","earningsTimestampStart":"2024-05-21T10:59:00.000Z","earningsTimestampEnd":"2024-05-27T12:00:00.000Z","trailingAnnualDividendRate":0,"trailingPE":48.268578,"trailingAnnualDividendYield":0,"epsTrailingTwelveMonths":6.46,"epsForward":6.2,"epsCurrentYear":5.51,"priceEpsCurrentYear":56.590744,"sharesOutstanding":323100000,"bookValue":13.502,"fiftyDayAverage":324.0862,"fiftyDayAverageChange":-12.27121,"fiftyDayAverageChangePercent":-0.03786403,"twoHundredDayAverage":260.8786,"twoHundredDayAverageChange":50.9364,"twoHundredDayAverageChangePercent":0.19524944,"marketCap":100747427840,"forwardPE":50.292744,"priceToBook":23.093987,"sourceInterval":15,"exchangeDataDelayedBy":0,"ipoExpectedDate":"2021-10-25T00:00:00.000Z","averageAnalystRating":"2.0 - Buy","tradeable":false,"cryptoTradeable":false,"displayName":"Palo Alto Networks","symbol":"PANW"}

const mockHistoricalPriceData1 = [{"date":"2024-02-20T00:00:00.000Z","open":362.850006,"high":369.290009,"low":359.820007,"close":366.089996,"adjClose":366.089996,"volume":10458800},{"date":"2024-02-21T00:00:00.000Z","open":275.200012,"high":275.980011,"low":260.089996,"close":261.970001,"adjClose":261.970001,"volume":43937300},{"date":"2024-02-22T00:00:00.000Z","open":274.130005,"high":276.809998,"low":265,"close":267.820007,"adjClose":267.820007,"volume":19297300},{"date":"2024-02-23T00:00:00.000Z","open":276.950012,"high":284.320007,"low":271.619995,"close":282.089996,"adjClose":282.089996,"volume":14878300},{"date":"2024-02-26T00:00:00.000Z","open":288.519989,"high":313.839996,"low":286.790009,"close":307.809998,"adjClose":307.809998,"volume":16137344}]

const mockSearchData2 = {
    "ai_response": {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": {
          "reasoning": "Analyzing the tweets surrounding Medtronic, the sentiment is generally positive. There are mentions of innovations, contributions to health equity, technological advancements in medical devices, and recognition of employee achievements. Tweets from accounts with substantial follower counts such as 'CSIMarket' report strong earnings and revenue growth for Q3 2024, which indicates financial health. Other users share insights about Medtronic’s global impact and smart technology which portray a progressive and forward-thinking company culture.",
          "tweets": [
            {
              "user": "CSIMarket",
              "userDescription": "Committed to deliver comprehensive stock market insights",
              "userFollowerCount": 1380,
              "text": "Medtronic Plc Reports Strong Growth in Earnings and Revenue for Q3 2024 $MDT #NYSE   Global Healthcare Technology Leader Continues to Thrive Despite Sector CompetitionMedtronic Plc, a global leader in healthcare technology, recently reported its third-qu… https://t.co/BVlkWRnVKT."
            },
            {
              "user": "dorr91273",
              "userDescription": "",
              "userFollowerCount": 52,
              "text": "Be part of the change in advancing health equity in pulse oximetry. Hear insights on the ways Medtronic is partnering with regulators and clinicians to address this important topic. #MedtronicEmployee Access the webinar now: https://t.co/TOuEIAutAu https://t.co/dAVaVfBtMa."
            },
            {
              "user": "IsraelinEgypt",
              "userDescription": "نعمل من اجل توطيد العلاقات والتعاون المشترك في جميع المجالات بين دولة اسرائيل والجمهورية العربية المصرية\\n\\\" القُدرات عالية والرغبة مشتركة \\\"",
              "userFollowerCount": 101454,
              "text": "⭕️جديد اسرائيل في الطب بلا حدود. ⭕️تمت زراعة جهاز تنظيم ضربات القلب الصغيرة من الجيل الجديد في إسرائيل Micra AV-2:. ⭕️\\\"تقنية متقدمة\\\" عبارة عن جهاز تنظيم ضربات القلب، حيث يصبح أقل \\\"إزعاجاً\\\" وبشكل رئيسي أصغر حجماً. Medtronic 📸 https://t.co/BCmsTAhT1G."
            }
          ],
          "final_verdict": "buy",
          "confidence_rate": 80
        }
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  };  

const mockFinancialInfo = {"financialData":{"language":"en-US","region":"US","quoteType":"EQUITY","typeDisp":"Equity","quoteSourceName":"Nasdaq Real Time Price","triggerable":true,"customPriceAlertConfidence":"HIGH","currency":"USD","marketState":"REGULAR","regularMarketChangePercent":-0.5486631,"regularMarketPrice":83.38,"exchange":"NYQ","shortName":"Medtronic plc.","longName":"Medtronic plc","messageBoardId":"finmb_31348","exchangeTimezoneName":"America/New_York","exchangeTimezoneShortName":"EST","gmtOffSetMilliseconds":-18000000,"market":"us_market","esgPopulated":false,"hasPrePostMarketData":true,"firstTradeDateMilliseconds":"1973-05-02T13:30:00.000Z","priceHint":2,"regularMarketChange":-0.45999908,"regularMarketTime":"2024-02-28T20:19:43.000Z","regularMarketDayHigh":83.8273,"regularMarketDayRange":{"low":83.31,"high":83.8273},"regularMarketDayLow":83.31,"regularMarketVolume":2442525,"regularMarketPreviousClose":83.84,"bid":83.46,"ask":83.46,"bidSize":8,"askSize":10,"fullExchangeName":"NYSE","financialCurrency":"USD","regularMarketOpen":83.63,"averageDailyVolume3Month":6105949,"averageDailyVolume10Day":7193030,"fiftyTwoWeekLowChange":14.540001,"fiftyTwoWeekLowChangePercent":0.21121444,"fiftyTwoWeekRange":{"low":68.84,"high":92.02},"fiftyTwoWeekHighChange":-8.639999,"fiftyTwoWeekHighChangePercent":-0.09389263,"fiftyTwoWeekLow":68.84,"fiftyTwoWeekHigh":92.02,"fiftyTwoWeekChangePercent":2.1442533,"dividendDate":"2024-01-12T00:00:00.000Z","earningsTimestamp":"2024-05-23T12:00:00.000Z","earningsTimestampStart":"2024-05-23T12:00:00.000Z","earningsTimestampEnd":"2024-05-23T12:00:00.000Z","trailingAnnualDividendRate":2.75,"trailingPE":26.46984,"dividendRate":2.76,"trailingAnnualDividendYield":0.032800574,"dividendYield":3.29,"epsTrailingTwelveMonths":3.15,"epsForward":5.45,"epsCurrentYear":5.19,"priceEpsCurrentYear":16.06551,"sharesOutstanding":1329650048,"bookValue":38.952,"fiftyDayAverage":85.0408,"fiftyDayAverageChange":-1.6608047,"fiftyDayAverageChangePercent":-0.019529505,"twoHundredDayAverage":82.2288,"twoHundredDayAverageChange":1.1511993,"twoHundredDayAverageChangePercent":0.013999954,"marketCap":110866219008,"forwardPE":15.299083,"priceToBook":2.1405833,"sourceInterval":15,"exchangeDataDelayedBy":0,"averageAnalystRating":"2.5 - Buy","tradeable":false,"cryptoTradeable":false,"displayName":"Medtronic","symbol":"MDT"},"historicalPriceData":[{"date":"2023-11-28T00:00:00.000Z","open":78.900002,"high":79.050003,"low":78.400002,"close":78.629997,"adjClose":77.976799,"volume":4972200},{"date":"2023-11-29T00:00:00.000Z","open":78.75,"high":79.769997,"low":78.610001,"close":78.860001,"adjClose":78.204895,"volume":4260400},{"date":"2023-11-30T00:00:00.000Z","open":78.93,"high":79.309998,"low":78.199997,"close":79.269997,"adjClose":78.611481,"volume":6219300},{"date":"2023-12-01T00:00:00.000Z","open":79.089996,"high":80.080002,"low":78.760002,"close":79.989998,"adjClose":79.3255,"volume":5100900},{"date":"2023-12-04T00:00:00.000Z","open":79.559998,"high":80.230003,"low":79.410004,"close":79.760002,"adjClose":79.09742,"volume":6206400},{"date":"2023-12-05T00:00:00.000Z","open":79.550003,"high":79.629997,"low":78.660004,"close":78.82,"adjClose":78.165222,"volume":4818800},{"date":"2023-12-06T00:00:00.000Z","open":78.860001,"high":79.139999,"low":78.480003,"close":79.040001,"adjClose":78.3834,"volume":5319600},{"date":"2023-12-07T00:00:00.000Z","open":79.209999,"high":79.720001,"low":78.739998,"close":79.550003,"adjClose":78.88916,"volume":5251000},{"date":"2023-12-08T00:00:00.000Z","open":79.599998,"high":79.849998,"low":79.279999,"close":79.349998,"adjClose":78.690819,"volume":6240900},{"date":"2023-12-11T00:00:00.000Z","open":79.330002,"high":80.07,"low":79.330002,"close":79.720001,"adjClose":79.057747,"volume":5598900},{"date":"2023-12-12T00:00:00.000Z","open":80.050003,"high":80.220001,"low":79.220001,"close":80.080002,"adjClose":79.414757,"volume":5263300},{"date":"2023-12-13T00:00:00.000Z","open":79.720001,"high":81.919998,"low":79.5,"close":81.900002,"adjClose":81.219643,"volume":6304700},{"date":"2023-12-14T00:00:00.000Z","open":82.760002,"high":84.730003,"low":82.660004,"close":83.43,"adjClose":82.736931,"volume":9680600},{"date":"2023-12-15T00:00:00.000Z","open":83.080002,"high":83.290001,"low":82.300003,"close":82.610001,"adjClose":81.923744,"volume":12388600},{"date":"2023-12-18T00:00:00.000Z","open":82.959999,"high":83.480003,"low":82.580002,"close":83.059998,"adjClose":82.370003,"volume":6447200},{"date":"2023-12-19T00:00:00.000Z","open":82.169998,"high":82.779999,"low":81.779999,"close":82.07,"adjClose":82.07,"volume":5060900},{"date":"2023-12-20T00:00:00.000Z","open":81.809998,"high":81.879997,"low":80.57,"close":80.610001,"adjClose":80.610001,"volume":7257600},{"date":"2023-12-21T00:00:00.000Z","open":80.870003,"high":82.099998,"low":80.809998,"close":81.959999,"adjClose":81.959999,"volume":7440600},{"date":"2023-12-22T00:00:00.000Z","open":82.25,"high":82.739998,"low":81.540001,"close":81.919998,"adjClose":81.919998,"volume":3426000},{"date":"2023-12-26T00:00:00.000Z","open":81.959999,"high":82.519997,"low":81.639999,"close":82.300003,"adjClose":82.300003,"volume":2954800},{"date":"2023-12-27T00:00:00.000Z","open":82.080002,"high":82.489998,"low":82.040001,"close":82.419998,"adjClose":82.419998,"volume":4041700},{"date":"2023-12-28T00:00:00.000Z","open":82.279999,"high":83.040001,"low":82.220001,"close":82.730003,"adjClose":82.730003,"volume":3297000},{"date":"2023-12-29T00:00:00.000Z","open":82.529999,"high":82.900002,"low":82.139999,"close":82.379997,"adjClose":82.379997,"volume":3846900},{"date":"2024-01-02T00:00:00.000Z","open":82.110001,"high":83.790001,"low":81.970001,"close":82.839996,"adjClose":82.839996,"volume":5425800},{"date":"2024-01-03T00:00:00.000Z","open":82.940002,"high":83.779999,"low":82.139999,"close":83.199997,"adjClose":83.199997,"volume":6182600},{"date":"2024-01-04T00:00:00.000Z","open":83.150002,"high":84.220001,"low":82.980003,"close":83.93,"adjClose":83.93,"volume":5622000},{"date":"2024-01-05T00:00:00.000Z","open":83.709999,"high":85.010002,"low":83.519997,"close":84.57,"adjClose":84.57,"volume":5107200},{"date":"2024-01-08T00:00:00.000Z","open":84.800003,"high":86.720001,"low":84.309998,"close":86.57,"adjClose":86.57,"volume":7867100},{"date":"2024-01-09T00:00:00.000Z","open":86.43,"high":88.040001,"low":86.300003,"close":86.660004,"adjClose":86.660004,"volume":7223200},{"date":"2024-01-10T00:00:00.000Z","open":86.5,"high":87.529999,"low":86.360001,"close":87.080002,"adjClose":87.080002,"volume":4980800},{"date":"2024-01-11T00:00:00.000Z","open":87.089996,"high":87.279999,"low":86.360001,"close":87.089996,"adjClose":87.089996,"volume":5099500},{"date":"2024-01-12T00:00:00.000Z","open":87.599998,"high":88.730003,"low":87.260002,"close":87.419998,"adjClose":87.419998,"volume":5969000},{"date":"2024-01-16T00:00:00.000Z","open":86.959999,"high":87.18,"low":86.25,"close":86.540001,"adjClose":86.540001,"volume":5398300},{"date":"2024-01-17T00:00:00.000Z","open":86.199997,"high":86.82,"low":85.669998,"close":86.050003,"adjClose":86.050003,"volume":6956000},{"date":"2024-01-18T00:00:00.000Z","open":86.849998,"high":87.139999,"low":86.080002,"close":86.290001,"adjClose":86.290001,"volume":7203600},{"date":"2024-01-19T00:00:00.000Z","open":86.260002,"high":86.709999,"low":85.720001,"close":86.489998,"adjClose":86.489998,"volume":4819000},{"date":"2024-01-22T00:00:00.000Z","open":86.589996,"high":87.370003,"low":86.279999,"close":86.470001,"adjClose":86.470001,"volume":6015700},{"date":"2024-01-23T00:00:00.000Z","open":86.860001,"high":87.360001,"low":85.610001,"close":86.339996,"adjClose":86.339996,"volume":5060300},{"date":"2024-01-24T00:00:00.000Z","open":86.18,"high":86.32,"low":84.669998,"close":84.720001,"adjClose":84.720001,"volume":6035200},{"date":"2024-01-25T00:00:00.000Z","open":85.260002,"high":85.830002,"low":84.599998,"close":85.790001,"adjClose":85.790001,"volume":5557800},{"date":"2024-01-26T00:00:00.000Z","open":86.190002,"high":86.599998,"low":85.629997,"close":86.540001,"adjClose":86.540001,"volume":6784400},{"date":"2024-01-29T00:00:00.000Z","open":86.300003,"high":87.480003,"low":86.129997,"close":87.440002,"adjClose":87.440002,"volume":7144700},{"date":"2024-01-30T00:00:00.000Z","open":87.459999,"high":87.559998,"low":86.510002,"close":86.970001,"adjClose":86.970001,"volume":5760100},{"date":"2024-01-31T00:00:00.000Z","open":88.290001,"high":89.18,"low":87.519997,"close":87.540001,"adjClose":87.540001,"volume":10357900},{"date":"2024-02-01T00:00:00.000Z","open":87.360001,"high":88.540001,"low":86.699997,"close":88.089996,"adjClose":88.089996,"volume":4320000},{"date":"2024-02-02T00:00:00.000Z","open":87.459999,"high":88.139999,"low":87.059998,"close":87.629997,"adjClose":87.629997,"volume":5051900},{"date":"2024-02-05T00:00:00.000Z","open":87.580002,"high":87.779999,"low":86.739998,"close":86.75,"adjClose":86.75,"volume":4083400},{"date":"2024-02-06T00:00:00.000Z","open":87.080002,"high":87.839996,"low":86.870003,"close":87.739998,"adjClose":87.739998,"volume":4667100},{"date":"2024-02-07T00:00:00.000Z","open":88.050003,"high":88.25,"low":87.040001,"close":87.160004,"adjClose":87.160004,"volume":4740100},{"date":"2024-02-08T00:00:00.000Z","open":86.550003,"high":86.760002,"low":85.389999,"close":86.18,"adjClose":86.18,"volume":5938100},{"date":"2024-02-09T00:00:00.000Z","open":86.080002,"high":86.160004,"low":84.459999,"close":84.989998,"adjClose":84.989998,"volume":8843400},{"date":"2024-02-12T00:00:00.000Z","open":84.629997,"high":85.330002,"low":84.379997,"close":85.07,"adjClose":85.07,"volume":5892300},{"date":"2024-02-13T00:00:00.000Z","open":84.57,"high":85,"low":83.129997,"close":83.589996,"adjClose":83.589996,"volume":7579400},{"date":"2024-02-14T00:00:00.000Z","open":83.669998,"high":84.349998,"low":83.239998,"close":83.68,"adjClose":83.68,"volume":4934500},{"date":"2024-02-15T00:00:00.000Z","open":83.830002,"high":85.010002,"low":83.760002,"close":84.720001,"adjClose":84.720001,"volume":4867900},{"date":"2024-02-16T00:00:00.000Z","open":84.489998,"high":85.739998,"low":84.110001,"close":84.419998,"adjClose":84.419998,"volume":10847600},{"date":"2024-02-20T00:00:00.000Z","open":86.959999,"high":87.220001,"low":82.589996,"close":85.849998,"adjClose":85.849998,"volume":11771400},{"date":"2024-02-21T00:00:00.000Z","open":86.529999,"high":86.529999,"low":84.839996,"close":85.900002,"adjClose":85.900002,"volume":6877000},{"date":"2024-02-22T00:00:00.000Z","open":85.769997,"high":85.870003,"low":84.480003,"close":85.059998,"adjClose":85.059998,"volume":9824900},{"date":"2024-02-23T00:00:00.000Z","open":85.330002,"high":85.949997,"low":84.860001,"close":85.669998,"adjClose":85.669998,"volume":4707300},{"date":"2024-02-26T00:00:00.000Z","open":85.559998,"high":85.559998,"low":83.480003,"close":83.669998,"adjClose":83.669998,"volume":5974100},{"date":"2024-02-27T00:00:00.000Z","open":83.459999,"high":84.18,"low":83.139999,"close":83.839996,"adjClose":83.839996,"volume":4546200},{"date":"2024-02-28T00:00:00.000Z","open":83.629997,"high":83.827301,"low":83.309998,"close":83.379997,"adjClose":83.379997,"volume":2442525}]}


const SearchResultPage = () => {
    const [searchData, setSearchData] = useState({});
    const [financialData, setFinancialData] = useState({});
    const [historicalPriceData, setHistoricalPriceData] = useState([])
    const [loadingAI, setLoadingAI] = useState(true);
    const [loadingFinancials, setLoadingFinancials] = useState(true);
    // const [queryCompany, setQueryCompany] = useState('');
    const location = useLocation();
    // const isMounted = useRef(false);
    const searchParams = new URLSearchParams(location.search);
    const queryCompany = searchParams.get('company');

    // useEffect(() => {
    //     if (isMounted.current) {
    //         if (company !== queryCompany) {
    //             setQueryCompany(company);
    //         }
    //     } else {
    //         isMounted.current = true;
    //     }
    // }, [location.search]);

    useEffect(() => {
        setLoadingAI(true);
        setLoadingFinancials(true);
        const fetchCompanyData = async () => {
            try {
                // const response = await fetch(`http://localhost:8000/api/search-company?company=${queryCompany}`);
                // if (!response.ok) {
                //     throw new Error('Failed to fetch company data');
                // }
                // const data = await response.json();
                // setSearchData(JSON.parse(data.ai_response.message.content));

                /**
                 * Mocking
                 */

                // setSearchData(mockSearchData)
                setSearchData(mockSearchData2.ai_response.message.content)
                setLoadingAI(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }

            try {
                // const response = await fetch(`http://localhost:8000/api/get-company-financial-info?company=${queryCompany}`);
                // if (!response.ok) {
                //     throw new Error('Failed to fetch financial data for company');
                // }
                // const data = await response.json();
                // console.log("data: " + data)
                // setFinancialData(data.financialData);
                // setHistoricalPriceData(data.historicalPriceData)
                
                /**
                 * Mocking
                 */

                //
                // setHistoricalPriceData(mockHistoricalPriceData);
                // setFinancialData(mockFinancialData);

                setHistoricalPriceData(mockFinancialInfo.historicalPriceData)
                setFinancialData(mockFinancialInfo.financialData)
                setLoadingFinancials(false);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        };

        fetchCompanyData();
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
                            <div style={{}}>
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


/**
 * 
 */