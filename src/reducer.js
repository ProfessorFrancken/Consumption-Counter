import { TYPES } from 'actions';
import { sortBy, groupBy, chunk, first, last, take  } from 'lodash';
export { loading } from 'Loading/reducers';
export { menuItems } from 'Layout/Sidebar/reducers';
export { recentBuyers } from 'App/Recent/reducers';
export { boardMembers } from 'App/Prominent/reducers';
export { committeeMembers } from 'App/Committees/reducers';
export { transactions, statistics, activities } from 'App/Statistics/reducers';

const product_images = [];
const member_images = [];

export function products(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS_SUCCESS:
      // Refrehs images
      product_images.splice(0, product_images);
      action.products.forEach(product => {
        let img = new Image();
        img.src = product.image;
        product_images.push(img);
      });

      return groupBy(
        sortBy(action.products, product => product.position),
        product => product.category
      );
    default:
      return state;
  }
}

export function members(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      // Refrehs images
      member_images.splice(0, member_images);
      action.members.forEach(member => {
        let img = new Image();
        if (member.cosmetics && member.cosmetics.image) {
          img.src = member.cosmetics.image;
          member_images.push(img);
        }
      });
      return action.members;
    case TYPES.BUY_ORDER_SUCCESS:
      return state.map(member => ({
        ...member,
        latest_purchase_at:
          member.id === action.order.member.id
            ? new Date(action.order.ordered_at)
            : member.latest_purchase_at
      }));
    default:
      return state;
  }
}

const defaultRanges = {
  members_per_range: 6 * 5,
  ranges: []
};

const SETTINGS_TYPES = {
  SET_MEMBERS_PER_RANGE: 'SET_MEMBERS_PER_RANGE'
};

export function surnameRanges(state = defaultRanges, action) {
  switch (action.type) {
    case SETTINGS_TYPES.SET_MEMBERS_PER_RANGE:
      return {
        members_per_range: action.members_per_range,
        ranges: state.ranges
      };
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return {
        members_per_range: state.members_per_range,
        ranges: chunk(action.members, state.members_per_range).map(
          (members, idx) => ({
            idx,
            members,
            surname_start: first(members).surname,
            surname_end: last(members).surname
          })
        )
      };
    default:
      return state;
  }
}

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

export function authentication(
  state = { request: false, token: null },
  action
) {
  switch (action.type) {
    case TYPES.AUTHENTICATE_REQUEST:
      return { request: true, token: state.token };
    case TYPES.AUTHENTICATE_FAILURE:
      return { request: false, error: action.error, token: state.token };
    case TYPES.AUTHENTICATE_SUCCESS:
      return { request: false, token: action.token };
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
