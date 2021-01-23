import {TYPES} from "actions";

export function authentication(state = {request: false, token: null}, action) {
  switch (action.type) {
    case TYPES.AUTHENTICATE_REQUEST:
      return {request: true, token: state.token};
    case TYPES.AUTHENTICATE_FAILURE:
      return {request: false, error: action.error, token: state.token};
    case TYPES.AUTHENTICATE_SUCCESS:
      return {request: false, token: action.token};
    default:
      return state;
  }
}
