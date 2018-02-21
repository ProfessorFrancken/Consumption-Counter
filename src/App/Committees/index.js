import { connect } from 'react-redux';
import { selectCommittee } from '../../actions';
import Committees from './Committees';
import { groupBy, sortBy, take, first, union, uniqBy } from 'lodash';

const loadBoards = (boardMembers, members) => {
  return boardMembers.map(boardMember => {
    return {
      id: boardMember.member_id,
      year: boardMember.year,
      function: boardMember.function,
      member: members.find(member => member.id === boardMember.member_id)
    };
  });
};

const committees = (committeeMembers, members) => {
  return uniqBy(
    committeeMembers.reduce((committees, member) => {
      return [...committees, member.committee];
    }, []),
    committee => committee.id
  ).map(committee => {
    return {
      ...committee,
      members: committeeMembers
        .filter(member => member.committee.id === committee.id)
        .map(member => {
          return members.find(m => m.id === member.member_id);
        })
    };
  });
};

const mapStateToProps = state => {
  return {
    committees: committees(state.committeeMembers, state.members)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCommittee: committee => dispatch(selectCommittee(committee))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
