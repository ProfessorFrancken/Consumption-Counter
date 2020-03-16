import { TYPES } from 'actions';
import { take, uniqBy } from 'lodash';

const RECENT_MEBMERS = 6 * 5;
export function recentBuyers(state = [], action) {
  switch (action.type) {
    case TYPES.BUY_ORDER_SUCCESS:
      return take(
        uniqBy([action.order.member.id, ...state], member => member),
        RECENT_MEBMERS
      );
    default:
      return state;
  }
}
