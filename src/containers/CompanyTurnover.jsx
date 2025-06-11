import React, { useEffect, useState } from 'react';
import data from '../assets/data/turnover-data.json';
import { getUniqueCompanies, groupByYearForCompany } from '../utils/dataTransform';
import CompanySelector from '../components/CompanySelector';
import BarChart from '../components/BarChart';

const CompanyTurnover = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setCompanies(getUniqueCompanies(data));
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const grouped = groupByYearForCompany(data, selectedCompany);
      setChartData(grouped);
    }
  }, [selectedCompany]);
  
  return (
    <div>
      <h2>Company Turnover by Year</h2>
      <CompanySelector
        companies={companies}
        selected={selectedCompany}
        onChange={setSelectedCompany}
      />
      <BarChart data={chartData} />
    </div>
  );
};

export default CompanyTurnover;
