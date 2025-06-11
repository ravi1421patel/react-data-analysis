import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { useChartAnimation } from "../hooks/useChartAnimation";
import ChartControls from "./ChartControls";

const AnimatedBarChart = ({data}) => {
  const svgRef = useRef();
  
  const width = 800;
  const height = 400;
  const margin = useMemo(() => ({ top: 20, right: 30, bottom: 30, left: 100 }), []);

  const globalMaxTurnover = useMemo(() => {
    return d3.max(data, d => d.Turnover) || 0;
  }, [data]);
  // Extract all dates and companies
  const days = useMemo(() => {
    const unique = Array.from(new Set(data.map(d => d.DateVal)));
    return unique.sort();
  }, [data]);
  useEffect(() => {
  if (days.length > 0) {
    setStartDate(days[0]);
    setEndDate(days[days.length - 1]);
  }
}, [days]);

  const companies = [...new Set(data.map(d => d.Company))];

  const [startDate, setStartDate] = useState(() => days[0]);
  const [endDate, setEndDate] = useState(() => days[days.length - 1]);
  const [currDate, setCurrDate] = useState(new Date().toISOString().split("T")[0]);
  const filteredDays = days.filter(d => d >= startDate && d <= endDate);

  // Calculate total turnover for each company
  const companyTotals = companies.map(company => {
    const sum = data
      .filter(d => (d.Company === company && currDate === d.DateVal))
      .reduce((acc, cur) => acc + cur.Turnover, 0);
    return { company, sum };
  });
    
  // Get top 15 companies by total turnover
  const top15Companies = companyTotals
    .sort((a, b) => b.sum - a.sum)
    .slice(0, 15)
    .map(d => d.company);

  const updateChart = useCallback((dayIndex) => {
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    let chartGroup = svg.select("g");

    if (chartGroup.empty()) {
      chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`);

      chartGroup.append("g").attr("class", "y-axis");
    }

    const x = d3.scaleLinear()
      .range([0, width - margin.left - margin.right])
      .domain([0, globalMaxTurnover])

    const y = d3.scaleBand()
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    const xAxisGroup = chartGroup.select(".x-axis");
    const yAxisGroup = chartGroup.select(".y-axis");

    const day = filteredDays[dayIndex];
    setCurrDate(filteredDays[dayIndex]);
    const filtered = data
      .filter(d => d.DateVal === day && top15Companies.includes(d.Company));

    const grouped = d3.rollups(
      filtered,
      v => d3.sum(v, d => d.Turnover),
      d => d.Company
    ).map(([Company, Turnover]) => ({ Company, Turnover }));

    grouped.sort((a, b) => b.Turnover - a.Turnover);
    y.domain(grouped.map(d => d.Company));

    xAxisGroup.transition().duration(1000).call(d3.axisBottom(x));
    yAxisGroup.transition().duration(1000).call(d3.axisLeft(y));

    const bars = chartGroup.selectAll("rect").data(grouped, d => d.Company);

    bars.enter()
      .append("rect")
      .attr("fill", "steelblue")
      .attr("y", d => y(d.Company))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", d => x(d.Turnover))
      .merge(bars)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("y", d => y(d.Company))
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.Turnover));

    bars.exit().remove();

    // Labels
    const labels = chartGroup.selectAll(".label").data(grouped, d => d.Company);

    labels.enter()
      .append("text")
      .attr("class", "label")
      .attr("y", d => y(d.Company) + y.bandwidth() / 2)
      .attr("x", d => x(d.Turnover) + 5)
      .attr("dy", "0.35em")
      .attr("fill", "black")
      .text(d => d.Turnover.toFixed(0))
      .merge(labels)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("y", d => y(d.Company) + y.bandwidth() / 2)
      .attr("x", d => x(d.Turnover) + 5)
      .text(d => d.Turnover.toFixed(0));

    labels.exit().remove();

  }, [data, filteredDays, top15Companies, globalMaxTurnover, margin]);

  const { index, status, play, pause, stop } = useChartAnimation(filteredDays.length, updateChart);
  useEffect(() => {
    updateChart(index);
  }, [index, updateChart]);
  return (
    <div>
      <h2><center>Top 15 companies in terms of turnover</center></h2>
      <div style={{ marginBottom: "10px", marginLeft: margin.left }}>
        <label>Start Date: </label>
        <select value={startDate} onChange={e => setStartDate(e.target.value)}>
          {days.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <label style={{ marginLeft: "10px" }}>End Date: </label>
        <select value={endDate} onChange={e => setEndDate(e.target.value)}>
          {days
          .map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <label style={{ marginLeft: "10px" }}>Current Date: <strong>{currDate}</strong></label>
      </div>

      <div style={{ marginBottom: "10px", marginLeft: margin.left }}>
        <ChartControls play={play} pause={pause} stop={stop} status={status} />
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AnimatedBarChart;
