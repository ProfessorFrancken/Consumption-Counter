import {TYPES} from "actions";

export const LOADING_STATE = {
  REQUESTING: "REQUESTING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

export function loading(
  state = {loading: undefined, features: [], done: false},
  action: any
) {
  switch (action.type) {
    case TYPES.LOAD_APPLICATION_REQUEST:
      return {
        state: LOADING_STATE.REQUESTING,
        features: [{loading: LOADING_STATE.REQUESTING, label: "Statistics"}],
        done: false,
      };
    case TYPES.LOAD_APPLICATION_SUCCESS:
      return {
        state: LOADING_STATE.SUCCESS,
        features: [{loading: LOADING_STATE.SUCCESS, label: "Statistics"}],
        done: true,
      };
    case TYPES.LOAD_APPLICATION_FAILURE:
      return {
        state: LOADING_STATE.FAILURE,
        features: [{loading: LOADING_STATE.FAILURE, label: "Statistics"}],
        done: true,
      };
    default:
      return state;
  }
}
