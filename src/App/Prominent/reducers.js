import { TYPES } from 'actions';

export function boardMembers(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_BOARD_MEMBERS_SUCCESS:
      return action.boardMembers;
    default:
      return state;
  }
}
