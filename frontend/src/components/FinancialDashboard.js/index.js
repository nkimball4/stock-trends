// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';
// import './index.scss';

// const FinancialDashboard = ({ financialData, historicalPriceData }) => {
//   const chartRef = useRef();

//   useEffect(() => {
//     if (historicalPriceData) {
//         drawChart();
//     }
//   }, [historicalPriceData]);

//   const drawChart = () => {
//     console.log("data: " + historicalPriceData)
//     d3.select(chartRef.current).selectAll("*").remove();

//     let right;
//     if (window.innerWidth < 700){
//         right = 60;
//     }
//     else{
//         right = 30
//     }
//     const margin = { top: 20, right: right, bottom: 30, left: 40 };
//     // const width = Math.min(window.innerWidth - 60, 600);
//     const width = 600 - margin.top - margin.bottom;
//     const height = 400 - margin.top - margin.bottom;

//     const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
//     const formatDate = d3.timeFormat("%b %d");
    
//     // Ensure unique dates
//     const uniqueDates = [...new Set(historicalPriceData.map(d => parseDate(d.date)))];

//     const x = d3.scaleTime()
//       .range([0, width])
//       .domain(d3.extent(uniqueDates));

//     const y = d3.scaleLinear()
//       .range([height, 0])
//       .domain([0, d3.max(historicalPriceData, d => d.high)]);

//     const line = d3.line()
//       .x(d => x(parseDate(d.date)))
//       .y(d => y(d.high));

//     const svg = d3.select(chartRef.current)
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     svg.append("path")
//       .datum(historicalPriceData)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", line);


//       svg.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x)
//         .tickFormat(function(date) {
//           if (date.getHours() === 0) {
//             return formatDate(date);
//           }
//           // Return an empty string for non-zero hour values
//           return null;
//         })
//       );

//     // svg.append("g")
//     //   .attr("transform", `translate(0,${height})`)
//     //   .call(d3.axisBottom(x).tickFormat(formatDate));
    
//     svg.append("g")
//       .call(d3.axisLeft(y));
//   };

//   return (
//     <div className="financial-dashboard">
//         <p style={{textAlign: "center", opacity: "0.8"}}>{financialData.symbol}, last 3 months</p>
//         <svg ref={chartRef}></svg>
//         <ul>
//             <li><span>market cap:</span> <span className="value">{financialData.marketCap}</span></li>
//             <li><span>regular market price:</span> <span className="value">{financialData.regularMarketPrice}</span></li>
//             <li><span>regular market volume:</span> <span className="value">{financialData.regularMarketVolume}</span></li>
//             <li><span>previous close:</span> <span className="value">{financialData.regularMarketPreviousClose}</span></li>
//             <li><span>day's range:</span> <span className="value">{financialData.regularMarketDayRange.low} - {financialData.regularMarketDayRange.high}</span></li>
//             <li><span>open:</span> <span className="value">{financialData.regularMarketOpen}</span></li>
//             <li><span>bid:</span> <span className="value">{financialData.bid}</span></li>
//             <li><span>ask:</span> <span className="value">{financialData.ask}</span></li>
//             <li><span>52-week range:</span> <span className="value">{financialData.fiftyTwoWeekRange.low} - {financialData.fiftyTwoWeekRange.high}</span></li>
//             <li><span>EPS (trailing twelve months):</span> <span className="value">{financialData.epsTrailingTwelveMonths}</span></li>
//             <li><span>forward EPS:</span> <span className="value">{financialData.epsForward}</span></li>
//             <li><span>PE ratio (trailing):</span> <span className="value">{financialData.trailingPE}</span></li>
//             <li><span>PE ratio (forward):</span> <span className="value">{financialData.forwardPE}</span></li>
//             <li><span>book value:</span> <span className="value">{financialData.bookValue}</span></li>
//             <li><span>price to book ratio:</span> <span className="value">{financialData.priceToBook}</span></li>
//        </ul>
//     </div>
//   );
// };

// export default FinancialDashboard;


/** Trying to make chart dynamic */


import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './index.scss';

const FinancialDashboard = ({ financialData, historicalPriceData }) => {
  const chartRef = useRef();
  const [chartWidth, setChartWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [ticksCount, setTicksCount] = useState(5);

  useEffect(() => {

    const checkIsMobile = () => {
      if (window.innerWidth <= 768){
        setIsMobile(true);
      }
      else{
        setIsMobile(false);
      }
    }

    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [])

  useEffect(() => {
    if (historicalPriceData) {
      const updateDimensions = () => {
        

        let containerWidth;
        if (window.innerWidth <= 768){
          containerWidth = window.innerWidth * 0.90;
          setTicksCount(5);
        }
        else{
          containerWidth = chartRef.current.clientWidth*2;
          setTicksCount(12);
        }
        console.log(window.innerWidth)
        const margin = { top: 20, right: 60, bottom: 30, left: 40 };
        setChartWidth(containerWidth - margin.left - margin.right);
      };

      updateDimensions();

      window.addEventListener('resize', updateDimensions);

      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [historicalPriceData]);

  useEffect(() => {
    if (historicalPriceData && chartWidth > 0) {
      drawChart();
    }
  }, [historicalPriceData, chartWidth]);

  const drawChart = () => {
    console.log("isMobile: " + isMobile)

    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 10, bottom: 30, left: 40 };
    const height = 400 - margin.top - margin.bottom;

    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    const formatDate = d3.timeFormat("%b %d");

    const uniqueDates = [...new Set(historicalPriceData.map(d => parseDate(d.date)))];

    const x = d3.scaleTime()
        .range([0, chartWidth])
        .domain(d3.extent(uniqueDates));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(historicalPriceData, d => d.high)]);

    const line = d3.line()
        .x(d => x(parseDate(d.date)))
        .y(d => y(d.high));

    const svg = d3.select(chartRef.current)
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("path")
        .datum(historicalPriceData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // let ticksCount = Math.ceil(chartWidth / 10);
    let numTicks = ticksCount;


    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
        .tickFormat(function (date) {
            if (date.getHours() === 0) {
                return formatDate(date);
            }
            return null;
        })
            .ticks(numTicks)
        );

    svg.append("g")
        .call(d3.axisLeft(y));
  };


  return (
    <div className="financial-dashboard">
        <p style={{textAlign: "center", opacity: "0.8"}}>{financialData.symbol}, last 3 months</p>
        <svg ref={chartRef}></svg>
        <ul>
            <li><span>market cap:</span> <span className="value">{financialData.marketCap}</span></li>
            <li><span>regular market price:</span> <span className="value">{financialData.regularMarketPrice}</span></li>
            <li><span>regular market volume:</span> <span className="value">{financialData.regularMarketVolume}</span></li>
            <li><span>previous close:</span> <span className="value">{financialData.regularMarketPreviousClose}</span></li>
            <li><span>day's range:</span> <span className="value">{financialData.regularMarketDayRange.low} - {financialData.regularMarketDayRange.high}</span></li>
            <li><span>open:</span> <span className="value">{financialData.regularMarketOpen}</span></li>
            <li><span>bid:</span> <span className="value">{financialData.bid}</span></li>
            <li><span>ask:</span> <span className="value">{financialData.ask}</span></li>
            <li><span>52-week range:</span> <span className="value">{financialData.fiftyTwoWeekRange.low} - {financialData.fiftyTwoWeekRange.high}</span></li>
            <li><span>EPS (trailing twelve months):</span> <span className="value">{financialData.epsTrailingTwelveMonths}</span></li>
            <li><span>forward EPS:</span> <span className="value">{financialData.epsForward}</span></li>
            <li><span>PE ratio (trailing):</span> <span className="value">{financialData.trailingPE}</span></li>
            <li><span>PE ratio (forward):</span> <span className="value">{financialData.forwardPE}</span></li>
            <li><span>book value:</span> <span className="value">{financialData.bookValue}</span></li>
            <li><span>price to book ratio:</span> <span className="value">{financialData.priceToBook}</span></li>
       </ul>
    </div>
  );
};

export default FinancialDashboard;
