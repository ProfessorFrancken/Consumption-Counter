import { orderBy, pick } from 'lodash';
import { push, goBack as goBackRoute } from 'react-router-redux';
import { setHeader } from './Setup/authHeader';
import moment from 'moment';
import axios from 'axios';

export const actions = {
  goBack,
  buyMore,
  makeOrder,
  buyAll,
  cancelOrder,

  addProductToOrder,
  selectRangeOfSurnames,
  selectMember,
  selectCommittee,

  fetchInitialData,
  fetchMembers,
  fetchProducts,
  fetchBoardMembers,
  fetchCommitteeMembers,
  fetchStatistics,
  fetchActivities,

  chwazi
};

export const TYPES = {
  GO_BACK: 'BO_BACK',

  BUY_MORE: 'TOGGLE_BUY_MORE_PRODUCTS',
  ADD_PRODUCT_TO_ORDER: 'ADD_PRODUCT_TO_ORDER',

  QUEUE_ORDER: 'QUEUE_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',

  BUY_ORDER_REQUEST: 'BUY_ORDER_REQUEST',
  BUY_ORDER_SUCCESS: 'BUY_ORDER_SUCCESS',
  BUY_ORDER_FAILURE: 'BUY_ORDER_FAILURE',

  SELECT_MEMBER: 'SELECT_MEMBER',
  SELECT_COMMITTEE: 'SELECT_COMMITTEE',

  FETCH_MEMBERS_REQUEST: 'FETCH_MEMBERS_REQUEST',
  FETCH_MEMBERS_SUCCESS: 'FETCH_MEMBERS_SUCCESS',
  FETCH_MEMBERS_FAILURE: 'FETCH_MEMBERS_FAILURE',

  FETCH_BOARD_MEMBERS_REQUEST: 'FETCH_BOARD_MEMBERS_REQUEST',
  FETCH_BOARD_MEMBERS_SUCCESS: 'FETCH_BOARD_MEMBERS_SUCCESS',
  FETCH_BOARD_MEMBERS_FAILURE: 'FETCH_BOARD_MEMBERS_FAILURE',

  FETCH_COMMITTEE_MEMBERS_REQUEST: 'FETCH_COMMITTEE_MEMBERS_REQUEST',
  FETCH_COMMITTEE_MEMBERS_SUCCESS: 'FETCH_COMMITTEE_MEMBERS_SUCCESS',
  FETCH_COMMITTEE_MEMBERS_FAILURE: 'FETCH_COMMITTEE_MEMBERS_FAILURE',

  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',

  FETCH_STATISTICS_REQUEST: 'FETCH_STATISTICS_REQUEST',
  FETCH_STATISTICS_SUCCESS: 'FETCH_STATISTICS_SUCCESS',
  FETCH_STATISTICS_FAILURE: 'FETCH_STATISTICS_FAILURE',

  FETCH_ACTIVITIES_REQUEST: 'FETCH_ACTIVITIES_REQUEST',
  FETCH_ACTIVITIES_SUCCESS: 'FETCH_ACTIVITIES_SUCCESS',
  FETCH_ACTIVITIES_FAILURE: 'FETCH_ACTIVITIES_FAILURE',

  AUTHENTICATE_REQUEST: 'AUTHENTICATE_REQUEST',
  AUTHENTICATE_SUCCESS: 'AUTHENTICATE_SUCCESS',
  AUTHENTICATE_FAILURE: 'AUTHENTICATE_FAILURE'
};

export function selectRangeOfSurnames(range) {
  return dispatch => {
    dispatch(push(`/members/${range.idx}`));
  };
}

export function addProductToOrder(product) {
  return (dispatch, getState) => {
    const { order } = getState();

    if (order.products.length === 0) {
      return dispatch(makeOrder({ member: order.member, products: [product] }));
    } else {
      dispatch({ type: TYPES.ADD_PRODUCT_TO_ORDER, product });
    }
  };
}

export function buyAll() {
  return (dispatch, getState) => {
    const { order } = getState();

    return dispatch(makeOrder(order));
  };
}

export function buyMore(product) {
  return {
    type: TYPES.BUY_MORE,
    product
  };
}

const orderQueue = {};

export const TIME_TO_CANCEL = 7000;
// TODO don't make this exportable and m ake order not be optional
export function makeOrder(order) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      const date = new Date();

      order = { ...order, ordered_at: date.getTime() };

      dispatch({
        type: TYPES.QUEUE_ORDER,
        order: pick(order, 'member', 'products', 'ordered_at')
      });

      dispatch(push('/'));

      orderQueue[order.ordered_at] = setTimeout(() => {
        dispatch(buyOrder(order));
      }, TIME_TO_CANCEL);
      resolve();
    });
  };
}

export function cancelOrder(order) {
  return dispatch => {
    clearTimeout(orderQueue[order.ordered_at]);
    delete orderQueue[order.ordered_at];

    dispatch({
      type: TYPES.CANCEL_ORDER,
      order: pick(order, 'member', 'products', 'ordered_at')
    });
  };
}

export function buyOrder(order) {
  return (dispatch, getState, api) => {
    const ordered_at = order.ordered_at;
    delete orderQueue[ordered_at];

    dispatch({ type: TYPES.BUY_ORDER_REQUEST, order });

    const member = order.member;
    return api
      .post('/orders', {
        order: {
          member: pick(member, ['id', 'firstName', 'surname']),
          products: order.products.map(product =>
            pick(product, ['id', 'name', 'price'])
          ),
          ordered_at
        }
      })
      .then(response => {
        dispatch({ type: TYPES.BUY_ORDER_SUCCESS, order });
      })
      .catch(ex => dispatch({ type: TYPES.BUY_ORDER_FAILURE, order }));
  };
}

export function selectMember(member) {
  return dispatch => {
    function didNotRecentlyOrderAProduct(member) {
      const latest_purchase_at =
        typeof member.latest_purchase_at === 'string'
          ? new Date(member.latest_purchase_at)
          : member.latest_purchase_at;

      if (latest_purchase_at === null) {
        return true;
      }

      const today = new Date();
      const timeDiff = Math.abs(today.getTime() - latest_purchase_at.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays > 90;
    }

    if (didNotRecentlyOrderAProduct(member)) {
      if (
        !window.confirm(`Are you sure you want to select ${member.fullname}`)
      ) {
        // Cancel the selection since selecting this member was a mistake
        return;
      }
    }

    dispatch(push('/products'));
    dispatch({
      type: TYPES.SELECT_MEMBER,
      member
    });
  };
}

export function selectCommittee(committee) {
  return dispatch => {
    dispatch(push(`/committees/${committee.id}`));
    dispatch({
      type: TYPES.SELECT_COMMITTEE,
      committee: committee
    });
  };
}

export function fetchMembers() {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.FETCH_MEMBERS_REQUEST
    });

    const calculateAge = lid => {
      const birthdayString = lid.geboortedatum;
      if (birthdayString === null) {
        return 0;
      }
      const birthday = new Date(Date.parse(birthdayString));

      const date = new Date();
      const ageDifMs = date.getTime() - birthday.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const mapMembers = lid => ({
      id: parseInt(lid.id, 10),
      firstName: lid.voornaam,
      surname: lid.achternaam,
      fullname: [lid.voornaam, lid.tussenvoegsel, lid.achternaam]
        .filter(name => ![undefined, ''].includes(name))
        .join(' '),

      age: calculateAge(lid),
      prominent: lid.prominent,

      latest_purchase_at: lid.latest_purchase_at
        ? new Date(lid.latest_purchase_at)
        : null,

      cosmetics: {
        color: lid.kleur,
        image: lid.afbeelding,
        nickname: lid.bijnaam,
        button: {
          width: lid.button_width,
          height: lid.button_height
        }
      }
    });

    return api
      .get('/members')
      .then(response => {
        dispatch({
          type: TYPES.FETCH_MEMBERS_SUCCESS,
          members: orderBy(
            response.members.map(mapMembers),
            member => member.surname
          )
        });
      })
      .catch(ex =>
        dispatch({
          type: TYPES.FETCH_MEMBERS_FAILURE
        })
      );
  };
}

export function fetchProducts() {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.FETCH_PRODUCTS_REQUEST
    });

    const mapProducts = product => {
      return {
        id: parseInt(product.id, 10),
        name: product.naam,

        // Note we parse the price and then convert it to fulll cents
        price: 100 * parseFloat(product.prijs),
        position: product.positie,
        category: product.categorie,
        image: product.afbeelding,
        splash_image: product.splash_afbeelding,
        age_restriction: product.categorie === 'Bier' ? 18 : null
      };
    };

    return api
      .get('/products')
      .then(response =>
        dispatch({
          type: TYPES.FETCH_PRODUCTS_SUCCESS,
          products: response.products.map(mapProducts)
        })
      )
      .catch(ex =>
        dispatch({
          type: TYPES.FETCH_PRODUCTS_FAILURE
        })
      );
  };
}

export function fetchBoardMembers() {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.FETCH_BOARD_MEMBERS_REQUEST
    });

    const mapBoard = boardMember => {
      return {
        member_id: parseInt(boardMember.lid_id, 10),
        year: boardMember.jaar,
        function: boardMember.functie
      };
    };

    return api
      .get('/boards')
      .then(response =>
        dispatch({
          type: TYPES.FETCH_BOARD_MEMBERS_SUCCESS,
          boardMembers: orderBy(
            response.boardMembers.map(mapBoard),
            boardMember => boardMember.year
          )
        })
      )
      .catch(ex =>
        dispatch({
          type: TYPES.FETCH_BOARD_MEMBERS_FAILURE
        })
      );
  };
}

export function fetchCommitteeMembers() {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST
    });

    const mapCommittees = member => {
      return {
        member_id: parseInt(member.lid_id, 10),
        year: member.jaar,
        function: member.functie,
        committee: {
          id: parseInt(member.commissie_id),
          name: member.naam
        }
      };
    };

    return api
      .get('/committees')
      .then(response =>
        dispatch({
          type: TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS,
          committees: response.committees.map(mapCommittees)
        })
      )
      .catch(ex =>
        dispatch({
          type: TYPES.FETCH_COMMITTEE_MEMBERS_FAILURE
        })
      );
  };
}

export function fetchStatistics() {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.FETCH_STATISTICS_REQUEST
    });

    const startDate = moment()
      .subtract(2, 'years')
      .format('YYYY-MM-DD');

    const endDate = moment().format('YYYY-MM-DD');

    return api
      .get('/statistics/categories', {
        startDate,
        endDate
      })
      .then(response => {
        return dispatch({
          type: TYPES.FETCH_STATISTICS_SUCCESS,
          statistics: response.statistics.map(statistic => {
            return {
              date: statistic.date,
              total:
                parseInt(statistic.beer, 10) +
                parseInt(statistic.soda, 10) +
                parseInt(statistic.food, 10),
              beer: parseInt(statistic.beer, 10),
              soda: parseInt(statistic.soda, 10),
              food: parseInt(statistic.food, 10)
            };
          })
        });
      })
      .catch(ex =>
        dispatch({
          type: TYPES.FETCH_STATISTICS_FAILURE
        })
      );
  };
}

export function fetchActivities() {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.FETCH_ACTIVITIES_REQUEST
    });

    const after = moment()
      .subtract(2, 'years')
      .format('YYYY-MM-DD');

    const before = moment().format('YYYY-MM-DD');

    return api
      .get('/statistics/activities', {
        after,
        before
      })
      .then(response => {
        return dispatch({
          type: TYPES.FETCH_ACTIVITIES_SUCCESS,
          activities: response.activities.map(activity => ({
            ...activity,
            startDate: moment(activity.startDate).format('YYYY-MM-DD'),
            endDate: moment(activity.endDate).format('YYYY-MM-DD')
          }))
        });
      })
      .catch(ex =>
        dispatch({
          type: TYPES.FETCH_ACTIVITIES_FAILURE,
          ex
        })
      );
  };
}

export function fetchInitialData() {
  return dispatch =>
    Promise.all([
      dispatch(fetchMembers()),
      dispatch(fetchProducts()),
      dispatch(fetchBoardMembers()),
      dispatch(fetchCommitteeMembers()),
      dispatch(fetchStatistics()),
      dispatch(fetchActivities())
    ]);
}

export function goBack() {
  return (dispatch, getState) => {
    const { queuedOrder } = getState();

    if (queuedOrder) {
      dispatch(selectMember(queuedOrder.order.member));
    } else {
      dispatch(goBackRoute());
      dispatch({ type: TYPES.GO_BACK });
    }
  };
}

export function authenticate(password) {
  return (dispatch, getState, api) => {
    dispatch({
      type: TYPES.AUTHENTICATE_REQUEST,
      password
    });

    return api
      .post('/authenticate', { password })
      .then(response => {
        setHeader(response.token);
        dispatch({
          type: TYPES.AUTHENTICATE_SUCCESS,
          token: response.token
        });
      })
      .catch(ex => dispatch({ type: TYPES.AUTHENTICATE_FAILURE, error: ex }));
  };
}

export function chwazi() {
  return dispatch => {
    // We don't really need to dispatch an action here so we only make the
    // chwazi request
    return axios.post(
      `https://borrelcie.vodka/chwazorcle/hoeveel.php?increment=-1`
    );
  };
}

export default actions;
