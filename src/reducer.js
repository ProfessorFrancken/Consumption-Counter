import { TYPES } from 'actions';
export { loading } from 'Loading/reducers';
export { members } from 'App/Members/reducers';
export { authentication } from 'Login/reducers';
export { products } from 'App/Products/reducers';
export { recentBuyers } from 'App/Recent/reducers';
export { menuItems } from 'Layout/Sidebar/reducers';
export { boardMembers } from 'App/Prominent/reducers';
export { surnameRanges } from 'App/SurnameRanges/reducers';
export { committeeMembers } from 'App/Committees/reducers';
export { transactions, statistics, activities } from 'App/Statistics/reducers';

const defaultOrder = {
  member: { age: 0 },
  products: []
};
export function order(state = defaultOrder, action) {
  switch (action.type) {
    case TYPES.BUY_MORE:
      return {
        ...state,
        products: state.products.length === 0 ? [action.product] : []
      };
    case TYPES.SELECT_MEMBER:
      return { ...defaultOrder, member: action.member };
    case TYPES.ADD_PRODUCT_TO_ORDER:
      return { ...state, products: [...state.products, { ...action.product }] };
    case TYPES.QUEUE_ORDER:
      return defaultOrder;
    default:
      return state;
  }
}

export function queuedOrder(state = null, action) {
  switch (action.type) {
    case TYPES.QUEUE_ORDER:
      return {
        ordered_at: action.order.ordered_at,
        order: action.order
      };
    case TYPES.BUY_ORDER_REQUEST:
      if (state === null) {
        return null;
      }

      return state.ordered_at === action.order.ordered_at ? null : state;
    case TYPES.CANCEL_ORDER:
      return null;
    default:
      return state;
  }
}

export function queuedOrders(state = [], action) {
  switch (action.type) {
    case TYPES.QUEUE_ORDER:
      return [
        {
          ordered_at: action.order.ordered_at,
          order: action.order,
          fails: 0,
          state: 'queued'
        },
        ...state
      ];
    case TYPES.BUY_ORDER_REQUEST:
      return state.map(order => {
        return order.ordered_at === action.order.ordered_at
          ? { ...order, state: 'requesting' }
          : order;
      });
    case TYPES.BUY_ORDER_SUCCESS:
    case TYPES.CANCEL_ORDER:
      return [
        ...state.filter(order => order.ordered_at !== action.order.ordered_at)
      ];
    case TYPES.BUY_ORDER_FAILURE:
      return state.map(order => {
        return order.ordered_at === action.order.ordered_at
          ? { ...order, fails: order.fails + 1, state: 'queued' }
          : order;
      });
    default:
      return state;
  }
}
