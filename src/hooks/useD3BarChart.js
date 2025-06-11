import { useEffect, useRef } from 'react';
import {
  select,
  scaleBand,
  scaleLinear,
  max,
  axisLeft,
  axisBottom,
  format
} from 'd3';


export const useD3BarChart = (data, width = 800, height = 400) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = select(ref.current);
    svg.selectAll('*').remove(); // Clean previous renders

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = scaleBand()
      .domain(data.map(d => d.year))
      .range([0, innerWidth])
      .padding(0.1);

    const y = scaleLinear()
      .domain([0, max(data, d => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .call(axisLeft(y).ticks(6).tickFormat(format(".2s")));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.year))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', '#69b3a2');
  }, [data, width, height]);

  return ref;
};
