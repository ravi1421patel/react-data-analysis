import React, { useEffect, useState } from 'react';
import AnimatedBarChart from './components/AnimatedBarChart';
import rawData from './data/data.json'; // make sure this path is correct

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sortedData = [...rawData].sort((a, b) => new Date(a.DateVal) - new Date(b.DateVal));
    setData(sortedData);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <AnimatedBarChart data={data} />
    </div>
  );
}

export default App;