import {TYPES} from "actions";
import moment from "moment";
import {take} from "lodash";
const KEEP_TRACK_OF_N_TRANSCACTIONS = 10;
export function transactions(state = [], action: any) {
  switch (action.type) {
    case TYPES.BUY_ORDER_SUCCESS:
      return take(
        [{member: action.member, order: action.order}, ...state],
        KEEP_TRACK_OF_N_TRANSCACTIONS
      );
    default:
      return state;
  }
}
export function statistics(state = [], action: any) {
  switch (action.type) {
    case TYPES.FETCH_STATISTICS_SUCCESS:
      return action.statistics;
    case TYPES.BUY_ORDER_SUCCESS:
      const ordered_at = new Date(action.order.ordered_at);
      ordered_at.setSeconds(0);
      ordered_at.setMinutes(0);
      ordered_at.setHours(0);
      return state.map((statistic) => {
        if ((statistic as any).date === moment(ordered_at).format("YYYY-MM-DD")) {
          const beers = action.order.products.filter(
            (product: any) => product.category === "Bier"
          ).length;
          const soda = action.order.products.filter(
            (product: any) => product.category === "Fris"
          ).length;
          const food = action.order.products.filter(
            (product: any) => product.category === "Eten"
          ).length;
          return {
            date: (statistic as any).date,
            total: (statistic as any).total + action.order.products.length,
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
export function activities(state = [], action: any) {
  switch (action.type) {
    case TYPES.FETCH_ACTIVITIES_SUCCESS:
      return action.activities;
    default:
      return state;
  }
}
