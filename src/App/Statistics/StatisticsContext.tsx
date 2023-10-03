import React from "react";
import {QueryObserverResult, useQuery} from '@tanstack/react-query';
import api from "api";
import moment from "moment";
import {AppEvent, FETCH_STATISTICS_EVENT, BUY_ORDER_SUCCESS_EVENT} from "actions";
import {useBus, useBusReducer} from "ts-bus/react";

export function statisticsReducer(state: Statistic[], event: AppEvent) {
  switch (event.type) {
    case FETCH_STATISTICS_EVENT.toString():
      return event.payload.statistics;
    case BUY_ORDER_SUCCESS_EVENT.toString():
      const ordered_at = new Date(event.payload.order.ordered_at);
      ordered_at.setSeconds(0);
      ordered_at.setMinutes(0);
      ordered_at.setHours(0);
      return state.map((statistic) => {
        if ((statistic as any).date === moment(ordered_at).format("YYYY-MM-DD")) {
          const beers = event.payload.order.products.filter(
            (product: any) => product.category === "Bier"
          ).length;
          const soda = event.payload.order.products.filter(
            (product: any) => product.category === "Fris"
          ).length;
          const food = event.payload.order.products.filter(
            (product: any) => product.category === "Eten"
          ).length;
          return {
            date: (statistic as any).date,
            total: (statistic as any).total + event.payload.order.products.length,
            beer: (statistic as any).beer + beers,
            soda: (statistic as any).soda + soda,
            food: (statistic as any).food + food,
          };
        }
        return statistic;
      });
    default:
      return state;
  }
}

export type Statistic = {
  date: string;
  total: number;
  beer: number;
  soda: number;
  food: number;
};

const useFetchStatistics = (statistics?: Statistic[]) => {
  const bus = useBus();

  return useQuery<Statistic[]>({
    queryKey: ["statistics"],
    queryFn: async () => {
      const startDate = moment().subtract(2, "years").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");

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

      const response = await api.get("/statistics/categories", {
        startDate,
        endDate,
      });
      return response.statistics.map(mapStatistic);
    },
    enabled: statistics === undefined,
    initialData: statistics,
    onSuccess: (statistics) => {
      bus.publish(FETCH_STATISTICS_EVENT({statistics}));
    },
  });
};

type State = {
  statisticsQuery: QueryObserverResult<Statistic[]>;
  statistics: Statistic[];
};
const StatisticsContext = React.createContext<State | undefined>(undefined);
export const StatisticsProvider: React.FC<{
  statistics?: Statistic[];
  children: React.ReactNode;
}> = ({statistics: defaultStatistics, children, ...props}) => {
  const statisticsQuery = useFetchStatistics(defaultStatistics);
  const statistics = useBusReducer(statisticsReducer, []);

  return (
    <StatisticsContext.Provider
      value={{
        statisticsQuery,
        statistics,
        ...props,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

export const useStatistics = () => {
  const context = React.useContext(StatisticsContext);

  if (!context) {
    throw new Error(`useStatistics must be used within a StatisticsContext`);
  }

  return context;
};
