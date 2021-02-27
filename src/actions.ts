export const actions = {
  fetchInitialData,
};

export const TYPES = {
  BUY_ORDER_SUCCESS: "BUY_ORDER_SUCCESS",

  LOAD_APPLICATION_REQUEST: "LOAD_APPLICATION_REQUEST",
  LOAD_APPLICATION_SUCCESS: "LOAD_APPLICATION_SUCCESS",
  LOAD_APPLICATION_FAILURE: "LOAD_APPLICATION_FAILURE",

  FETCH_STATISTICS_SUCCESS: "FETCH_STATISTICS_SUCCESS",
};

export function fetchInitialData() {
  return (dispatch: any) => {
    return Promise.all([dispatch({type: TYPES.LOAD_APPLICATION_REQUEST})])
      .then(() => {
        return dispatch({type: TYPES.LOAD_APPLICATION_SUCCESS});
      })
      .catch((ex) => dispatch({type: TYPES.LOAD_APPLICATION_FAILURE, ex}));
  };
}

export default actions;
