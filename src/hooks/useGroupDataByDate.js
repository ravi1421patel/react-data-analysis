import { useMemo } from "react";

const useGroupDataByDate = (data) => {
  return useMemo(() => {
    if (!Array.isArray(data)) return {};

    const dateMap = {};

    data.forEach(({ DateVal, Company, Turnover }) => {
      if (!DateVal || !Company || Turnover == null) return;

      if (!dateMap[DateVal]) dateMap[DateVal] = [];
      dateMap[DateVal].push({
        company: Company,
        value: Turnover,
      });
    });

    return dateMap;
  }, [data]);
};

export default useGroupDataByDate;
