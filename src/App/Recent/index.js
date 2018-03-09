import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectMember } from '../../actions';
import Members from './../Members/Members';
import { uniqBy, take } from 'lodash';

const transactionsSelector = state => state.transactions;
const recentSelector = createSelector(transactionsSelector, transactions =>
  take(
    uniqBy(
      transactions.map(transaction => transaction.member),
      member => member.id
    ),
    6 * 6
  )
);

const mapStateToProps = state => ({
  members: recentSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
