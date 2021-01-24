import {createSelector} from "reselect";
import {membersSelector} from "selectors";
import {uniqBy, groupBy} from "lodash";

const committeeMembersSelector = (state: any) => state.committeeMembers;

const activeMembersSelector = (state: any) => {
  const year = new Date().getUTCFullYear();

  return state.committeeMembers.filter((member: any) =>
    [year, year - 1].includes(member.year)
  );
};

// From the list of all committee members, select all committees
export const committeesSelector = createSelector(activeMembersSelector, (activeMembers) =>
  uniqBy(
    activeMembers.reduce(
      (committees: any, member: any) => [...committees, member.committee],
      []
    ),
    (committee: any) => committee.id
  )
);

// Get member info of all active members and filter out all members who don't streep
const committeeMembersWithMemberSelector = createSelector(
  activeMembersSelector,
  membersSelector,
  (activeMembers, members) =>
    activeMembers
      .map((activeMember: any) => ({
        committee_id: activeMember.committee.id,
        ...members.find((member: any) => member.id === activeMember.member_id),
      }))
      .filter((member: any) => member.id !== undefined)
);

export const committeesWithMembersSelector = createSelector(
  committeesSelector,
  committeeMembersWithMemberSelector,
  (committees, members) =>
    committees.map((committee: any) => ({
      ...committee,

      members: uniqBy(
        members.filter((member: any) => member.committee_id === committee.id),
        (member: any) => member.id
      ),
    }))
);

export const membersInCommitteesSelector = createSelector(
  (state: any, {page}: any) => page,
  committeeMembersWithMemberSelector,
  (page, members) =>
    uniqBy(
      members.filter((member: any) => member.committee_id === parseInt(page, 10)),
      (member: any) => member.id
    )
);

export const compucieSelector = createSelector(
  membersSelector,
  committeeMembersSelector,
  (members, committeeMembers) => {
    const committees = groupBy(
      uniqBy(
        committeeMembers
          .filter((member: any) => {
            return ["Compucie", "s[ck]rip(t|t?c)ie"].includes(member.committee.name);
          })
          .map((member: any) => {
            const m = members.find((m: any) => m.id === member.member_id);
            return m !== undefined ? {...m, name: member.committee.name} : undefined;
          })
          .filter((m: any) => m !== undefined),
        (member: any) => member.id
      ),
      (member: any) => member.name
    );

    return {
      compucie: committees["Compucie"] || [],
      scriptcie: committees["s[ck]rip(t|t?c)ie"] || [],
    };
  }
);
