import {OrderedOrder} from "App/QueuedOrdersContext";
import {Statistic} from "App/Statistics/StatisticsContext";
import {createEventDefinition} from "ts-bus/EventBus";

export const TYPES = {
  BUY_ORDER_SUCCESS: "BUY_ORDER_SUCCESS",
};

export const FETCH_STATISTICS_EVENT = createEventDefinition<{
  statistics: Statistic[];
}>()("FETCH_STATISTICS_SUCCESS");

export const BUY_ORDER_SUCCESS_EVENT = createEventDefinition<{
  order: OrderedOrder;
}>()("BUY_ORDER_SUCCESS");

export type AppEvent =
  | ReturnType<typeof FETCH_STATISTICS_EVENT>
  | ReturnType<typeof BUY_ORDER_SUCCESS_EVENT>;
