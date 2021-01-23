import {TYPES} from "actions";

export function boardMembers(state = [], action: any) {
  switch (action.type) {
    case TYPES.FETCH_BOARD_MEMBERS_SUCCESS:
      return action.boardMembers;
    default:
      return state;
  }
}
