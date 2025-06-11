import React from 'react';
import { useD3BarChart } from '../hooks/useD3BarChart';

const BarChart = ({ data }) => {
  const ref = useD3BarChart(data);
  return <svg ref={ref} width={800} height={400} />;
};

export default BarChart;
