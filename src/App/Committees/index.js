import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectCommittee } from '../../actions';
import Committees from './Committees';
import { uniqBy } from 'lodash';

const activeMembersSelector = state => {
  const year = (new Date()).getUTCFullYear();

  return state.committeeMembers.filter(member =>
    [year, year - 1].includes(member.year)
  )
};

const membersSelector = state => state.members;

// From the list of all committee members, select all committees
const committeesSelector = createSelector(
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
const committeeeMembersWithMemberSelector = createSelector(
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

const committeesWithMembersSelector = createSelector(
  committeesSelector,
  committeeeMembersWithMemberSelector,
  (committees, members) =>
    committees.map(committee => ({
      ...committee,
      members: uniqBy(
        members.filter(member => member.committee_id === committee.id),
        member => member.id
      )
    }))
);

const mapStateToProps = state => ({
  committees: committeesWithMembersSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectCommittee: committee => dispatch(selectCommittee(committee))
});

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
