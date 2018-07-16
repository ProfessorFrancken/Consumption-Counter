import { TYPES } from './actions';
import { sortBy, groupBy, chunk, first, last, take, uniqBy } from 'lodash';
import moment from 'moment';

export function products(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS_SUCCESS:
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

export function boardMembers(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_BOARD_MEMBERS_SUCCESS:
      return action.boardMembers;
    default:
      return state;
  }
}

export function committeeMembers(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS:
      return action.committees;
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

export function title(state = '', action) {
  switch (action.type) {
    case TYPES.SELECT_MEMBER:
      return action.member.fullname;
    case TYPES.SELECT_COMMITTEE:
      return action.committee.name;
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

const KEEP_TRACK_OF_N_TRANSCACTIONS = 10;
export function transactions(state = [], action) {
  switch (action.type) {
    case TYPES.BUY_ORDER_SUCCESS:
      return take(
        [{ member: action.member, order: action.order }, ...state],
        KEEP_TRACK_OF_N_TRANSCACTIONS
      );
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

const defaultMenuItems = [
  { icon: 'home', url: '/', loading: false },
  { icon: 'clock', url: '/recent' }
];
export function menuItems(state = defaultMenuItems, action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_REQUEST:
      return defaultMenuItems;
    case TYPES.FETCH_MEMBERS_SUCCESS:
      // If at least one person has a buixieval property, then we should show the
      // buixieval menu item
      const buixievalIsEnabled =
        action.members.filter(member => member.buixieval !== undefined)
          .length !== 0;

      if (buixievalIsEnabled) {
        return [...state, { icon: 'bitcoin fab', url: '/buixieval' }];
      }

      return state;

    case TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST:
      return [...state, { icon: 'users', url: '/committees', loading: true }];
    case TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS:
      return state.map(item => ({
        ...item,
        ...(item.url === '/committees' ? { loading: false } : {})
      }));

    case TYPES.FETCH_STATISTICS_REQUEST:
      return [
        ...state,
        { icon: 'chart-area', url: '/statistics', loading: true }
      ];
    case TYPES.FETCH_STATISTICS_SUCCESS:
      return state.map(item => ({
        ...item,
        ...(item.url === '/statistics' ? { loading: false } : {})
      }));

    case TYPES.FETCH_BOARD_MEMBERS_REQUEST:
      return [
        { icon: 'chess-queen', url: '/prominent', loading: true },
        ...state
      ];
    case TYPES.FETCH_BOARD_MEMBERS_SUCCESS:
      return state.map(item => ({
        ...item,
        ...(item.url === '/prominent' ? { loading: false } : {})
      }));
    default:
      return state;
  }
}

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
