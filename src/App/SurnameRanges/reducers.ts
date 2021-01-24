import {TYPES} from "actions";
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
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            surname_start: first(members).surname,
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            surname_end: last(members).surname,
          })
        ),
      };
    default:
      return state;
  }
}
