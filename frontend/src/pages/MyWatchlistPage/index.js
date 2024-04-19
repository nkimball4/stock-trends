import React, { useState, useEffect } from 'react';
import { useLoggedIn } from '../../contexts/loggedInContext';
import FinancialDashboard from '../../components/FinancialDashboard.js';
import './index.scss';

const CompanyInfo = ({ companyData }) => {
//   const { company, positive_tweets, recommendation, yahooInfo, confidence_rate } = companyData;
    const ai_response = JSON.parse(companyData.ai_response);
    console.log("ai_response: " + ai_response)

    return (
        <>
            <div className='heading-box-search' style={{marginTop: "5%", backdropFilter: "blur(12px)"}}>
                <div className='line' style={{marginTop: "0%"}}/>
                    <div className='heading-content-wrapper'>
                        <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>{companyData.companyName}</h1>
                    </div>
                <div className='line'/>
            </div>
            <div className='result-box'>
                <div className="result">
                    <p>{ai_response.reasoning}</p>
                    <br></br>
                    <h3>noteable chatter:</h3>
                    <ul>
                        {ai_response.tweets.map((tweet, index) => (
                            <li key={index} style={{padding: "10px", marginBottom: "6%"}}>
                                <p style={{textAlign: "center", color: "#75d9fa"}}>@{tweet.user}</p>
                                <p style={{opacity: "0.6", textAlign: "center", color: "#75d9fa"}}>{tweet.userDescription}</p><br/>
                                "{tweet.text}""
                            </li>
                        ))}
                    </ul>
                    <h3>final verdict:</h3>
                    <p>{ai_response.final_verdict}</p>
                    <h3>confidence rate:</h3>
                    <p>{ai_response.confidence_rate}%</p>
                </div>
                <div style={{ flex: 1 }}>
                    <FinancialDashboard financialData={companyData.financialData} historicalPriceData={companyData.historicalPriceData}/>
                </div>
            </div>
        </>
    );
};

// const CompanyInfo2 = () => {
//     return (
        // <>
        //     <div className='heading-box-search' style={{marginTop: "5%", backdropFilter: "blur(12px)"}}>
        //         <div className='line' style={{marginTop: "0%"}}/>
        //             <div className='heading-content-wrapper'>
        //                 <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>{companyData.companyName}</h1>
        //             </div>
        //         <div className='line'/>
        //     </div>
        //     <div className='result-box'>
        //         <div className="result">
        //             <p>{ai_response.reasoning}</p>
        //             <br></br>
        //             <h3>noteable chatter:</h3>
        //             <ul>
        //                 {ai_response.tweets.map((tweet, index) => (
        //                     <li key={index} style={{padding: "10px", marginBottom: "6%"}}>
        //                         <p style={{textAlign: "center", color: "#75d9fa"}}>@{tweet.user}</p>
        //                         <p style={{opacity: "0.6", textAlign: "center", color: "#75d9fa"}}>{tweet.userDescription}</p><br/>
        //                         "{tweet.text}""
        //                     </li>
        //                 ))}
        //             </ul>
        //             <h3>final verdict:</h3>
        //             <p>{ai_response.final_verdict}</p>
        //             <h3>confidence rate:</h3>
        //             <p>{ai_response.confidence_rate}%</p>
        //         </div>
        //         <div style={{ flex: 1 }}>
        //             <FinancialDashboard financialData={financialData} historicalPriceData={historicalPriceData}/>
        //         </div>
        //     </div>
        // </>
//     )
// }

const MyWatchlistPage = () => {
    const cachedLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    const [companyData, setCompanyData] = useState(cachedLoggedIn.data);
    const [loading, setLoading] = useState(true);
    const [sectorMap, setSectorMap] = useState(new Map())
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const fetchUserWatchlist = async () => {
            const data = {
                userEmail: cachedLoggedIn.loginInfo.email
            };

            try{
                const response = await fetch("http://localhost:8000/api/get-user-watchlist", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user watchlist');
                }
        
                const responseData = await response.json();
                
                console.log("responseData: " + responseData)

                if (responseData) {
                    let map = new Map();
                    for (let i = 0; i < responseData.length; i++) {
                        const sector = responseData[i].sector.replace(/"/g, '').toLowerCase();
                        if (map.has(sector)) {
                            map.get(sector).push(responseData[i]);
                        } else {
                            map.set(sector, [responseData[i]]);
                        }
                    }
                    setSectorMap(map)
                }
                setTimeout(() => {
                    setCompanyData(responseData);
                    setLoading(false);
                }, 0);
            }
            catch(error){
                console.error("Error fetching user watchlist: ", error);
            }
        }

        fetchUserWatchlist();
    }, [])  

    const handleCompanyCardClick = (company) => {
        setSelectedCompany(company);
    }

    return (
        <div className='my-watchlist-page-wrapper'>
            {selectedCompany ? (
                <div className='company-info-full-wrapper'>
                    <img src={process.env.PUBLIC_URL + `/images/back-arrow.png`} className='back-to-watchlist-button' onClick={() => {setSelectedCompany(null)}}></img>
                    <CompanyInfo companyData={selectedCompany}/>
                </div>
            ) : companyData ? (
                <div className="watchlist-company-display-wrapper">
                    <div className='heading-box-search' style={{backdropFilter: "blur(12px)"}}>
                        <div className='line' style={{marginTop: "0%"}}/>
                            <div className='heading-content-wrapper'>
                                {/* <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>{`${cachedLoggedIn.loginInfo.name}'s watchlist`}</h1> */}
                                <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>{`my watchlist`}</h1>
                            </div>
                        <div className='line'/>
                    </div>
                    <div style={{position: "relative", left: "5%"}}>
                        {Array.from(sectorMap).map(([sector, companies]) => (
                            <div className="sector-wrapper">
                                <p className="sector-header">{sector}</p>
                                <div className="small-watchlist-company-cards">
                                    {companies.map((company, index) => {
                                        console.log('company: ' + JSON.stringify(company))
                                        const ai_response = JSON.parse(company.ai_response);
                                        return (
                                            <div key={index} className="small-company-card" onClick={()=> handleCompanyCardClick(company)}>
                                                <h3>{company.companyName}</h3>
                                                <p>verdict: {ai_response.final_verdict}</p>
                                                <p>confidence: {ai_response.confidence_rate}%</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : loading ? (
                <div className="watchlist-loading-container">
                        <h1 style={{fontWeight: "normal", textAlign: "center", padding: "1%", opacity: "0.7"}}>loading your watchlist</h1>
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
                    <p className='watchlist-text'>nothing to show</p>
                    <p className='watchlist-subtext'>search for a company to add it to your watchlist</p>
                </>
            )}
        </div>
    )
}

export default MyWatchlistPage;