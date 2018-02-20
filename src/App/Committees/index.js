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

const committees = committeeMembers => {
  return uniqBy(
    committeeMembers.reduce((committees, member) => {
      return [...committees, member.committee];
    }, []),
    committee => committee.id
  );
};

const mapStateToProps = state => {
  return {
    committees: committees(state.committeeMembers)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCommittee: committee => dispatch(selectCommittee(committee))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
