import {TYPES} from "actions";

export function committeeMembers(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS:
      return action.committees;
    default:
      return state;
  }
}
