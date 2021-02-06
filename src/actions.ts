import {orderBy, pick} from "lodash";
import {push} from "connected-react-router";
import moment from "moment";
import axios from "axios";

export const actions = {
  makeOrder,
  cancelOrder,

  selectCommittee,

  fetchInitialData,
  fetchMembers,
  fetchBoardMembers,
  fetchCommitteeMembers,
  fetchStatistics,
  fetchActivities,

  chwazi,
};

export const TYPES = {
  QUEUE_ORDER: "QUEUE_ORDER",
  CANCEL_ORDER: "CANCEL_ORDER",

  BUY_ORDER_REQUEST: "BUY_ORDER_REQUEST",
  BUY_ORDER_SUCCESS: "BUY_ORDER_SUCCESS",
  BUY_ORDER_FAILURE: "BUY_ORDER_FAILURE",

  SELECT_COMMITTEE: "SELECT_COMMITTEE",

  LOAD_APPLICATION_REQUEST: "LOAD_APPLICATION_REQUEST",
  LOAD_APPLICATION_SUCCESS: "LOAD_APPLICATION_SUCCESS",
  LOAD_APPLICATION_FAILURE: "LOAD_APPLICATION_FAILURE",

  FETCH_MEMBERS_REQUEST: "FETCH_MEMBERS_REQUEST",
  FETCH_MEMBERS_SUCCESS: "FETCH_MEMBERS_SUCCESS",
  FETCH_MEMBERS_FAILURE: "FETCH_MEMBERS_FAILURE",

  FETCH_BOARD_MEMBERS_REQUEST: "FETCH_BOARD_MEMBERS_REQUEST",
  FETCH_BOARD_MEMBERS_SUCCESS: "FETCH_BOARD_MEMBERS_SUCCESS",
  FETCH_BOARD_MEMBERS_FAILURE: "FETCH_BOARD_MEMBERS_FAILURE",

  FETCH_COMMITTEE_MEMBERS_REQUEST: "FETCH_COMMITTEE_MEMBERS_REQUEST",
  FETCH_COMMITTEE_MEMBERS_SUCCESS: "FETCH_COMMITTEE_MEMBERS_SUCCESS",
  FETCH_COMMITTEE_MEMBERS_FAILURE: "FETCH_COMMITTEE_MEMBERS_FAILURE",

  FETCH_STATISTICS_REQUEST: "FETCH_STATISTICS_REQUEST",
  FETCH_STATISTICS_SUCCESS: "FETCH_STATISTICS_SUCCESS",
  FETCH_STATISTICS_FAILURE: "FETCH_STATISTICS_FAILURE",

  FETCH_ACTIVITIES_REQUEST: "FETCH_ACTIVITIES_REQUEST",
  FETCH_ACTIVITIES_SUCCESS: "FETCH_ACTIVITIES_SUCCESS",
  FETCH_ACTIVITIES_FAILURE: "FETCH_ACTIVITIES_FAILURE",
};

const orderQueue = {};

export const TIME_TO_CANCEL = 7000;
// TODO don't make this exportable and m ake order not be optional
export function makeOrder(order: any) {
  return (dispatch: any, getState: any) => {
    return new Promise((resolve) => {
      const date = new Date();

      order = {...order, ordered_at: date.getTime()};

      dispatch({
        type: TYPES.QUEUE_ORDER,
        order: pick(order, "member", "products", "ordered_at"),
      });

      dispatch(push("/"));

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      orderQueue[order.ordered_at] = setTimeout(() => {
        dispatch(buyOrder(order));
      }, TIME_TO_CANCEL);
      // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
      resolve();
    });
  };
}

export function cancelOrder(order: any) {
  return (dispatch: any) => {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    clearTimeout(orderQueue[order.ordered_at]);
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete orderQueue[order.ordered_at];

    dispatch({
      type: TYPES.CANCEL_ORDER,
      order: pick(order, "member", "products", "ordered_at"),
    });
  };
}

export function buyOrder(order: any) {
  return (dispatch: any, getState: any, api: any) => {
    const ordered_at = order.ordered_at;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    delete orderQueue[ordered_at];

    dispatch({type: TYPES.BUY_ORDER_REQUEST, order});

    const member = order.member;
    return api
      .post("/orders", {
        order: {
          member: pick(member, ["id", "firstName", "surname"]),
          products: order.products.map((product: any) =>
            pick(product, ["id", "name", "price"])
          ),
          ordered_at,
        },
      })
      .then((response: any) => {
        dispatch({type: TYPES.BUY_ORDER_SUCCESS, order});
      })
      .catch((ex: any) => dispatch({type: TYPES.BUY_ORDER_FAILURE, order}));
  };
}

export function selectCommittee(committee: any) {
  return (dispatch: any) => {
    dispatch(push(`/committees/${committee.id}`));
    dispatch({
      type: TYPES.SELECT_COMMITTEE,
      committee: committee,
    });
  };
}

export function fetchMembers() {
  return (dispatch: any, getState: any, api: any) => {
    dispatch({
      type: TYPES.FETCH_MEMBERS_REQUEST,
    });

    const calculateAge = (lid: any) => {
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

    const mapMembers = (lid: any) => ({
      id: parseInt(lid.id, 10),
      firstName: lid.voornaam,
      surname: lid.achternaam,

      fullname: [lid.voornaam, lid.tussenvoegsel, lid.achternaam]
        .filter((name) => ![undefined, ""].includes(name))
        .join(" "),

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
          height: lid.button_height,
        },
      },
    });

    return api
      .get("/members")
      .then((response: any) => {
        dispatch({
          type: TYPES.FETCH_MEMBERS_SUCCESS,
          members: orderBy(
            response.members.map(mapMembers),
            (member: any) => member.surname
          ),
        });
      })
      .catch((ex: any) =>
        dispatch({
          type: TYPES.FETCH_MEMBERS_FAILURE,
        })
      );
  };
}

export function fetchBoardMembers() {
  return (dispatch: any, getState: any, api: any) => {
    dispatch({
      type: TYPES.FETCH_BOARD_MEMBERS_REQUEST,
    });

    const mapBoard = (boardMember: any) => {
      return {
        member_id: parseInt(boardMember.lid_id, 10),
        year: boardMember.jaar,
        function: boardMember.functie,
      };
    };

    return api
      .get("/boards")
      .then((response: any) =>
        dispatch({
          type: TYPES.FETCH_BOARD_MEMBERS_SUCCESS,
          boardMembers: orderBy(
            response.boardMembers.map(mapBoard),
            (boardMember: any) => boardMember.year
          ),
        })
      )
      .catch((ex: any) =>
        dispatch({
          type: TYPES.FETCH_BOARD_MEMBERS_FAILURE,
        })
      );
  };
}

export function fetchCommitteeMembers() {
  return (dispatch: any, getState: any, api: any) => {
    dispatch({
      type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST,
    });

    const mapCommittees = (member: any) => {
      return {
        member_id: parseInt(member.lid_id, 10),
        year: member.jaar,
        function: member.functie,
        committee: {
          id: parseInt(member.commissie_id, 10),
          name: member.naam,
        },
      };
    };

    return api
      .get("/committees")
      .then((response: any) =>
        dispatch({
          type: TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS,
          committees: response.committees.map(mapCommittees),
        })
      )
      .catch((ex: any) =>
        dispatch({
          type: TYPES.FETCH_COMMITTEE_MEMBERS_FAILURE,
        })
      );
  };
}

export function fetchStatistics() {
  return (dispatch: any, getState: any, api: any) => {
    dispatch({
      type: TYPES.FETCH_STATISTICS_REQUEST,
    });

    const startDate = moment().subtract(2, "years").format("YYYY-MM-DD");

    const endDate = moment().format("YYYY-MM-DD");

    return api
      .get("/statistics/categories", {
        startDate,
        endDate,
      })
      .then((response: any) => {
        return dispatch({
          type: TYPES.FETCH_STATISTICS_SUCCESS,
          statistics: response.statistics.map((statistic: any) => {
            return {
              date: statistic.date,
              total:
                parseInt(statistic.beer, 10) +
                parseInt(statistic.soda, 10) +
                parseInt(statistic.food, 10),
              beer: parseInt(statistic.beer, 10),
              soda: parseInt(statistic.soda, 10),
              food: parseInt(statistic.food, 10),
            };
          }),
        });
      })
      .catch((ex: any) =>
        dispatch({
          type: TYPES.FETCH_STATISTICS_FAILURE,
        })
      );
  };
}

export function fetchActivities() {
  return (dispatch: any, getState: any, api: any) => {
    dispatch({
      type: TYPES.FETCH_ACTIVITIES_REQUEST,
    });

    const after = moment().subtract(2, "years").format("YYYY-MM-DD");

    const before = moment().format("YYYY-MM-DD");

    return api
      .get("/statistics/activities", {
        after,
        before,
      })
      .then((response: any) => {
        return dispatch({
          type: TYPES.FETCH_ACTIVITIES_SUCCESS,
          activities: response.activities.map((activity: any) => ({
            ...activity,
            startDate: moment(activity.startDate).format("YYYY-MM-DD"),
            endDate: moment(activity.endDate).format("YYYY-MM-DD"),
          })),
        });
      })
      .catch((ex: any) =>
        dispatch({
          type: TYPES.FETCH_ACTIVITIES_FAILURE,
          ex,
        })
      );
  };
}

export function fetchInitialData() {
  return (dispatch: any) => {
    return Promise.all([
      dispatch({type: TYPES.LOAD_APPLICATION_REQUEST}),
      dispatch(push(`/loading`)),
      dispatch(fetchMembers()),
      dispatch(fetchBoardMembers()),
      dispatch(fetchCommitteeMembers()),
      dispatch(fetchStatistics()),
      dispatch(fetchActivities()),
    ])
      .then(() => {
        return dispatch({type: TYPES.LOAD_APPLICATION_SUCCESS});
      })
      .catch((ex) => dispatch({type: TYPES.LOAD_APPLICATION_FAILURE, ex}));
  };
}

export function chwazi() {
  return (dispatch: any) => {
    // We don't really need to dispatch an action here so we only make the
    // chwazi request
    return axios.post(`https://borrelcie.vodka/chwazorcle/hoeveel.php?increment=-1`);
  };
}

export default actions;
