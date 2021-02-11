import moment from "moment";

export const actions = {
  fetchInitialData,
  fetchStatistics,
  fetchActivities,
};

export const TYPES = {
  QUEUE_ORDER: "QUEUE_ORDER",
  CANCEL_ORDER: "CANCEL_ORDER",

  BUY_ORDER_REQUEST: "BUY_ORDER_REQUEST",
  BUY_ORDER_SUCCESS: "BUY_ORDER_SUCCESS",
  BUY_ORDER_FAILURE: "BUY_ORDER_FAILURE",

  LOAD_APPLICATION_REQUEST: "LOAD_APPLICATION_REQUEST",
  LOAD_APPLICATION_SUCCESS: "LOAD_APPLICATION_SUCCESS",
  LOAD_APPLICATION_FAILURE: "LOAD_APPLICATION_FAILURE",

  FETCH_STATISTICS_REQUEST: "FETCH_STATISTICS_REQUEST",
  FETCH_STATISTICS_SUCCESS: "FETCH_STATISTICS_SUCCESS",
  FETCH_STATISTICS_FAILURE: "FETCH_STATISTICS_FAILURE",

  FETCH_ACTIVITIES_REQUEST: "FETCH_ACTIVITIES_REQUEST",
  FETCH_ACTIVITIES_SUCCESS: "FETCH_ACTIVITIES_SUCCESS",
  FETCH_ACTIVITIES_FAILURE: "FETCH_ACTIVITIES_FAILURE",
};

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
      dispatch(fetchStatistics()),
      dispatch(fetchActivities()),
    ])
      .then(() => {
        return dispatch({type: TYPES.LOAD_APPLICATION_SUCCESS});
      })
      .catch((ex) => dispatch({type: TYPES.LOAD_APPLICATION_FAILURE, ex}));
  };
}

export default actions;
