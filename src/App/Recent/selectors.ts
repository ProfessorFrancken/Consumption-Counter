import {createSelector} from "reselect";
import {membersSelector} from "selectors";

const recentSelector = (state: any) => state.recentBuyers;

export const recentBuyersSelector = createSelector(
  recentSelector,
  membersSelector,
  (recent, members) =>
    recent
      .map((recent: any) => members.find((member: any) => member.id === recent))
      // exclude members that couldn't be found (for instance guests)
      .filter((m: any) => m)
);
