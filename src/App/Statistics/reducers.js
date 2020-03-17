import { TYPES } from 'actions';
import moment from 'moment';

export function statistics(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_STATISTICS_SUCCESS:
      return action.statistics;
    case TYPES.BUY_ORDER_SUCCESS:
      const ordered_at = new Date(action.order.ordered_at);
      ordered_at.setSeconds(0);
      ordered_at.setMinutes(0);
      ordered_at.setHours(0);

      return state.map(statistic => {
        if (statistic.date === moment(ordered_at).format('YYYY-MM-DD')) {
          const beers = action.order.products.filter(
            product => product.category === 'Bier'
          ).length;
          const soda = action.order.products.filter(
            product => product.category === 'Fris'
          ).length;
          const food = action.order.products.filter(
            product => product.category === 'Eten'
          ).length;

          return {
            date: statistic.date,
            total: statistic.total + action.order.products.length,
            beer: statistic.beer + beers,
            soda: statistic.soda + soda,
            food: statistic.food + food
          };
        }

        return statistic;
      });
    default:
      return state;
  }
}

export function activities(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_ACTIVITIES_SUCCESS:
      return action.activities;
    default:
      return state;
  }
}
