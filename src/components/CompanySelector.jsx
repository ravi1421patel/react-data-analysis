import React from 'react';

const CompanySelector = ({ companies, selected, onChange }) => (
  <select value={selected} onChange={e => onChange(e.target.value)}>
    {companies.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
);

export default CompanySelector;
