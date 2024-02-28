import React from 'react';
import { useState, useEffect } from 'react';
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

const CompanyCard = ({ companyData }) => {
  const { company, positive_tweets, recommendation, confidence_rate } = companyData;

  return (
    <div className="company-card">
        <div className='company-card-content'>
            <h2 style={{textAlign: "center"}}>{company}</h2>
            <p>{recommendation}</p><br></br>
            <p><strong>confidence rate:</strong> {confidence_rate}%</p><br></br>
            <div>
                <strong>notable chatter:</strong>
                <ul>
                    {positive_tweets.map((tweet, index) => (
                        <li key={index} style={{padding: "10px"}}>
                            <p style={{textAlign: "center", color: "#75d9fa"}}>@{tweet.user}</p>
                            <p style={{opacity: "0.6", textAlign: "center", color: "#75d9fa"}}>{tweet.userDescription}</p><br/>
                            "{tweet.text}""
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
  );
};

const Homepage = () => {

    const [trendingData, setTrendingData] = useState([]);
    
    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/get-trending');
                if (!response.ok) {
                    throw new Error('Failed to fetch trending data');
                }
                const data = await response.json();
                setTrendingData(data);
            } catch (error) {
                console.error('Error fetching trending data:', error);
            }
        };

        fetchTrendingData();
    }, []);

    console.log(trendingData);
    return (
        <div className="home-page">
            <div className='heading-box'>
                <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>trending</h1>
            {/* <   div className='line' style={{marginTop: "0%"}}/> */}
                {/* <div className='line'/> */}
            </div>
            <div className="company-list">
                {trendingData.map((companyData, index) => (
                    <CompanyCard key={index} companyData={companyData} />
                ))}
            </div>
            <div className='heading-box'>
            {/* <   div className='line' style={{marginTop: "0%"}}/> */}
                <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>what is chatter?</h1>
                {/* <div className='line'/> */}
            </div>
            <div className='about-box'>
            chatter is a platform that sifts through Twitter chatter about companies and applies AI-based sentiment analysis to gauge whether the overall sentiment is positive or negative. We're driven by the belief that understanding public sentiment is crucial for predicting stock price movements. By analyzing the collective sentiment of recent tweets, we aim to provide a clearer picture of the rumors and discussions that can influence stock prices. Our goal is simple: to decode the chatter and provide traders with valuable insights to inform their decision-making process.
            </div>
        </div>
    );
};

export default Homepage;
