import {TYPES} from "actions";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import {chunk, first, last} from "lodash";

const defaultRanges = {
  members_per_range: 6 * 5,
  ranges: [],
};
const SETTINGS_TYPES = {
  SET_MEMBERS_PER_RANGE: "SET_MEMBERS_PER_RANGE",
};

export function surnameRanges(state = defaultRanges, action: any) {
  switch (action.type) {
    case SETTINGS_TYPES.SET_MEMBERS_PER_RANGE:
      return {
        members_per_range: action.members_per_range,
        ranges: state.ranges,
      };
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return {
        members_per_range: state.members_per_range,
        ranges: chunk(action.members, state.members_per_range).map(
          (members: any, idx: any) => ({
            idx,
            members,
            surname_start: first(members).surname,
            surname_end: last(members).surname,
          })
        ),
      };
    default:
      return state;
  }
}
