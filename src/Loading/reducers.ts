import {TYPES} from "actions";

export const LOADING_STATE = {
  REQUESTING: "REQUESTING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

const updateFeatureState = (features: any, label: any, state: any) =>
  features.map((feature: any) => ({
    ...feature,
    loading: feature.label === label ? state : feature.loading,
  }));

export function loading(
  state = {loading: undefined, features: [], done: false},
  action: any
) {
  switch (action.type) {
    case TYPES.LOAD_APPLICATION_REQUEST:
      return {
        state: LOADING_STATE.REQUESTING,
        features: [
          {loading: LOADING_STATE.REQUESTING, label: "Members"},
          {loading: LOADING_STATE.REQUESTING, label: "Products"},
          {loading: LOADING_STATE.REQUESTING, label: "Committees"},
          {loading: LOADING_STATE.REQUESTING, label: "Boards"},
          {loading: LOADING_STATE.REQUESTING, label: "Statistics"},
        ],
        done: false,
      };
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        features: updateFeatureState(state.features, "Members", LOADING_STATE.SUCCESS),
      };
    case TYPES.FETCH_MEMBERS_FAILURE:
      return {
        ...state,
        features: updateFeatureState(state.features, "Members", LOADING_STATE.FAILURE),
      };
    case TYPES.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        features: updateFeatureState(state.features, "Products", LOADING_STATE.SUCCESS),
      };
    case TYPES.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        features: updateFeatureState(state.features, "Products", LOADING_STATE.FAILURE),
      };
    case TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS:
      return {
        ...state,
        features: updateFeatureState(state.features, "Committees", LOADING_STATE.SUCCESS),
      };
    case TYPES.FETCH_COMMITTEE_MEMBERS_FAILURE:
      return {
        ...state,
        features: updateFeatureState(state.features, "Committees", LOADING_STATE.FAILURE),
      };
    case TYPES.FETCH_BOARD_MEMBERS_SUCCESS:
      return {
        ...state,
        features: updateFeatureState(state.features, "Boards", LOADING_STATE.SUCCESS),
      };
    case TYPES.FETCH_BOARD_MEMBERS_FAILURE:
      return {
        ...state,
        features: updateFeatureState(state.features, "Boards", LOADING_STATE.FAILURE),
      };
    case TYPES.FETCH_STATISTICS_SUCCESS:
      return {
        ...state,
        features: updateFeatureState(state.features, "Statistics", LOADING_STATE.SUCCESS),
      };
    case TYPES.FETCH_STATISTICS_FAILURE:
      return {
        ...state,
        features: updateFeatureState(state.features, "Statistics", LOADING_STATE.FAILURE),
      };
    case TYPES.LOAD_APPLICATION_SUCCESS:
      return {
        state: LOADING_STATE.SUCCESS,
        features: [
          {loading: LOADING_STATE.SUCCESS, label: "Members"},
          {loading: LOADING_STATE.SUCCESS, label: "Products"},
          {loading: LOADING_STATE.SUCCESS, label: "Committees"},
          {loading: LOADING_STATE.SUCCESS, label: "Boards"},
          {loading: LOADING_STATE.SUCCESS, label: "Statistics"},
        ],
        done: true,
      };
    case TYPES.LOAD_APPLICATION_FAILURE:
      return {
        state: LOADING_STATE.FAILURE,
        features: [
          {loading: LOADING_STATE.FAILURE, label: "Members"},
          {loading: LOADING_STATE.FAILURE, label: "Products"},
          {loading: LOADING_STATE.FAILURE, label: "Committees"},
          {loading: LOADING_STATE.FAILURE, label: "Boards"},
          {loading: LOADING_STATE.FAILURE, label: "Statistics"},
        ],
        done: true,
      };
    default:
      return state;
  }
}
