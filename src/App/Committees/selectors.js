import { createSelector } from 'reselect';
import { membersSelector } from 'selectors';
import { uniqBy, groupBy } from 'lodash';

const committeeMembersSelector = state => state.committeeMembers;

const activeMembersSelector = state => {
  const year = new Date().getUTCFullYear();

  return state.committeeMembers.filter(member =>
    [year, year - 1].includes(member.year)
  );
};

// From the list of all committee members, select all committees
export const committeesSelector = createSelector(
  activeMembersSelector,
  activeMembers =>
    uniqBy(
      activeMembers.reduce(
        (committees, member) => [...committees, member.committee],
        []
      ),
      committee => committee.id
    )
);

// Get member info of all active members and filter out all members who don't streep
const committeeMembersWithMemberSelector = createSelector(
  activeMembersSelector,
  membersSelector,
  (activeMembers, members) =>
    activeMembers
      .map(activeMember => ({
        committee_id: activeMember.committee.id,
        ...members.find(member => member.id === activeMember.member_id)
      }))
      .filter(member => member.id !== undefined)
);

export const committeesWithMembersSelector = createSelector(
  committeesSelector,
  committeeMembersWithMemberSelector,
  (committees, members) =>
    committees.map(committee => ({
      ...committee,
      members: uniqBy(
        members.filter(member => member.committee_id === committee.id),
        member => member.id
      )
    }))
);

export const membersInCommitteesSelector = createSelector(
  (state, { page }) => page,
  committeeMembersWithMemberSelector,
  (page, members) =>
    uniqBy(
      members.filter(member => member.committee_id === parseInt(page, 10)),
      member => member.id
    )
);

export const compucieSelector = createSelector(
  membersSelector,
  committeeMembersSelector,
  (members, committeeMembers) => {
    const committees = groupBy(
      uniqBy(
        committeeMembers
          .filter(member => {
            return ['Compucie', 's[ck]rip(t|t?c)ie'].includes(
              member.committee.name
            );
          })
          .map(member => {
            const m = members.find(m => m.id === member.member_id);
            return m !== undefined
              ? { ...m, name: member.committee.name }
              : undefined;
          })
          .filter(m => m !== undefined),
        member => member.id
      ),
      member => member.name
    );

    return {
      compucie: committees['Compucie'] || [],
      scriptcie: committees['s[ck]rip(t|t?c)ie'] || []
    };
  }
);
