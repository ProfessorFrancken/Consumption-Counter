import {queryOptions, useQuery, useSuspenseQuery} from "@tanstack/react-query";
import api from "../api";
import moment, {Moment} from "moment";
import {Committee} from "../routes/committees";
import {useCallback} from "react";

export type ApiTransactionsStatisticsResponse = {
  statistics: {
    date: string; // 'yyyy-mm-dd'
    beer: string;
    soda: string;
    food: string;
  }[];
};

export type TransactionStatistic = {
  date: string;
  total: number;
  beer: number;
  soda: number;
  food: number;
};

export const transactionsStatisticsQueryOptions = () => {
  return queryOptions({
    queryKey: ["statistics", "categories"],
    queryFn: async () => {
      const startDate = moment().subtract(2, "years").format("YYYY-MM-DD");
      const endDate = moment().add(1, "day").format("YYYY-MM-DD");

      const response = await api.get<ApiTransactionsStatisticsResponse>(
        "/statistics/categories",
        {
          startDate,
          endDate,
        }
      );

      return response.statistics.map((statistic): TransactionStatistic => {
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
      });
    },
    staleTime: Infinity,
  });
};

export const useTransactionsStatisticsQuery = () => {
  return useQuery(transactionsStatisticsQueryOptions());
};

export type ApiCommitteesStatisticsResponse = {
  statistics: {
    beer: number;
    food: number;
    soda: number;
    committee: {id: number; name: string};
  }[];
};

export const useCommitteesStatisticsQuery = ({
  timeRange,
  committees,
}: {
  timeRange: [Moment, Moment];
  committees: Committee[];
}) => {
  const getData = useCallback(() => {
    return [...committees].map((c, idx) => {
      return {
        name: `Committee ${idx}`,
        beer: Math.ceil(330 * Math.random()),
        food: Math.ceil(330 * Math.random()),
        soda: Math.ceil(330 * Math.random()),
      };
    });
  }, [committees]);

  const committeeStatisticsQuery = useSuspenseQuery({
    queryKey: ["committee-statistics", timeRange, committees.length],
    queryFn: async () => {
      const response = await api.get<ApiCommitteesStatisticsResponse>(
        "/statistics/committees",
        {
          startDate: timeRange[0].format("YYYY-MM-DD"),
          endDate: timeRange[1].format("YYYY-MM-DD"),
        }
      );

      return response.statistics.map((stats) => {
        const committee = committees.find(({id}) => id === stats.committee.id);
        return {
          name: committee?.name ?? `${stats.committee.id}`,
          beer: stats.beer,
          food: stats.food,
          soda: stats.soda,
        };
      });
    },
  });

  return committeeStatisticsQuery;
};
