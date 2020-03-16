import { createSelector } from 'reselect';
import { membersSelector } from 'selectors';

const recentSelector = state => state.recentBuyers;

export const recentBuyersSelector = createSelector(
  recentSelector,
  membersSelector,
  (recent, members) =>
    recent
      .map(recent => members.find(member => member.id === recent))
      // exclude members that couldn't be found (for instance guests)
      .filter(m => m)
);
