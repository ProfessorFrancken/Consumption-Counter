import {TYPES} from "actions";
export {loading} from "Loading/reducers";
export {members} from "App/Members/reducers";
export {recentBuyers} from "App/Recent/reducers";
export {menuItems} from "Layout/Sidebar/reducers";
export {boardMembers} from "App/Prominent/reducers";
export {surnameRanges} from "App/SurnameRanges/reducers";
export {transactions, statistics, activities} from "App/Statistics/reducers";
export function queuedOrder(state = null, action: any) {
  switch (action.type) {
    case TYPES.QUEUE_ORDER:
      return {
        ordered_at: action.order.ordered_at,
        order: action.order,
      };
    case TYPES.BUY_ORDER_REQUEST:
      if (state === null) {
        return null;
      }
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      return state.ordered_at === action.order.ordered_at ? null : state;
    case TYPES.CANCEL_ORDER:
      return null;
    default:
      return state;
  }
}
export function queuedOrders(state = [], action: any) {
  switch (action.type) {
    case TYPES.QUEUE_ORDER:
      return [
        {
          ordered_at: action.order.ordered_at,
          order: action.order,
          fails: 0,
          state: "queued",
        },
        ...state,
      ];
    case TYPES.BUY_ORDER_REQUEST:
      return state.map((order) => {
        return (order as any).ordered_at === action.order.ordered_at
          ? // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            {...order, state: "requesting"}
          : order;
      });
    case TYPES.BUY_ORDER_SUCCESS:
    case TYPES.CANCEL_ORDER:
      return [
        ...state.filter((order) => (order as any).ordered_at !== action.order.ordered_at),
      ];
    case TYPES.BUY_ORDER_FAILURE:
      return state.map((order) => {
        return (order as any).ordered_at === action.order.ordered_at
          ? // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            {...order, fails: order.fails + 1, state: "queued"}
          : order;
      });
    default:
      return state;
  }
}
