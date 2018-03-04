import { connect } from 'react-redux';
import { selectCommittee } from '../../actions';
import Committees from './Committees';
import { uniqBy } from 'lodash';

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
        .filter(member => member !== undefined)
    };
  });
};

const mapStateToProps = state => {
  // Only show committees and ther members of the current academic year
  const today = new Date();

  return {
    committees: committees(
      state.committeeMembers.filter(member =>
        [today.getUTCFullYear(), today.getUTCFullYear() - 1].includes(
          member.year
        )
      ),
      state.members
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCommittee: committee => dispatch(selectCommittee(committee))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
