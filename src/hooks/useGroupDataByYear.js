// /src/hooks/useGroupDataByYear.js
import { useMemo } from "react";

export const useGroupDataByYear = (data) => {
  return useMemo(() => {
    if (!data) return {};

    const yearsMap = {};

    data.forEach(({ DateVal, Company, Turnover }) => {
      const year = new Date(DateVal).getFullYear();
      if (!yearsMap[year]) yearsMap[year] = [];
      yearsMap[year].push({ company: Company, value: Turnover });
    });

    return yearsMap;
  }, [data]);
};
