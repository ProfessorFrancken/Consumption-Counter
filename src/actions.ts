import {OrderedOrder} from "App/QueuedOrdersContext";
import {Statistic} from "App/Statistics/StatisticsContext";
import {createEventDefinition} from "ts-bus/EventBus";

export const TYPES = {
  BUY_ORDER_SUCCESS: "BUY_ORDER_SUCCESS",

  FETCH_STATISTICS_SUCCESS: "FETCH_STATISTICS_SUCCESS",
};

export const FETCH_STATISTICS_EVENT = createEventDefinition<{
  statistics: Statistic[];
}>()(TYPES.FETCH_STATISTICS_SUCCESS);

export const BUY_ORDER_SUCCESS_EVENT = createEventDefinition<{
  order: OrderedOrder;
}>()(TYPES.BUY_ORDER_SUCCESS);
