import {TYPES} from "actions";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import {take, uniqBy} from "lodash";

const RECENT_MEBMERS = 6 * 5;
export function recentBuyers(state = [], action: any) {
  switch (action.type) {
    case TYPES.BUY_ORDER_SUCCESS:
      return take(
        uniqBy([action.order.member.id, ...state], (member: any) => member),
        RECENT_MEBMERS
      );
    default:
      return state;
  }
}
