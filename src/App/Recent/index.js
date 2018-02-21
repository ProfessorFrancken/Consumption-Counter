import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import Members from './../Members/Members';
import { uniqBy, take } from 'lodash';

const mapStateToProps = state => {
  return {
    members: take(
      uniqBy(
        state.transactions.map(transaction => transaction.member),
        member => member.id
      ),
      6 * 6
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectMember: member => {
      dispatch(selectMember(member));
    }
  };
};

const RecentMembers = connect(mapStateToProps, mapDispatchToProps)(Members);

export default RecentMembers;
