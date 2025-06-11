export const getUniqueCompanies = (data) => {
  return [...new Set(data.map(d => d.Company))];
};

export const groupByYearForCompany = (data, companyName) => {
  const yearly = {};

  data.forEach(entry => {
    if (entry.Company !== companyName) return;

    const year = new Date(entry.Date).getFullYear();
    yearly[year] = (yearly[year] || 0) + entry.Turnover;
  });

  return Object.entries(yearly).map(([year, value]) => ({
    year,
    value: +value.toFixed(2)
  }));
};
