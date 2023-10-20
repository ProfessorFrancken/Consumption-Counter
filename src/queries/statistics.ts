import {queryOptions, useQuery} from "@tanstack/react-query";
import api from "api";
import moment from "moment";

export type Statistic = {
  date: string;
  total: number;
  beer: number;
  soda: number;
  food: number;
};

export const statisticsQueryOptions = () => {
  return queryOptions({
    queryKey: ["statistics", "categories"],
    queryFn: async () => {
      const startDate = moment().subtract(2, "years").format("YYYY-MM-DD");
      const endDate = moment().add(1, "day").format("YYYY-MM-DD");

      const mapStatistic = (statistic: any): Statistic => {
        const beer = parseInt(statistic.beer, 10);
        const soda = parseInt(statistic.soda, 10);
        const food = parseInt(statistic.food, 10);
        return {
          date: statistic.date,
          total: beer + soda + food,
          beer,
          soda,
          food,
        };
      };

      const response = await api.get<{
        statistics: {
          date: string; // 'yyyy-mm-dd'
          beer: string;
          soda: string;
          food: string;
        }[];
      }>("/statistics/categories", {
        startDate,
        endDate,
      });

      return response.statistics.map(mapStatistic);
    },
    staleTime: Infinity,
  });
};

export const useStatisticsQuery = () => {
  return useQuery(statisticsQueryOptions());
};
