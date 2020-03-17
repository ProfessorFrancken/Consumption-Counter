import { connect } from 'react-redux';
import { selectCommittee } from 'actions';
import { committeesWithMembersSelector } from './selectors';
import Committees from './Committees';

const mapStateToProps = state => ({
  committees: committeesWithMembersSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectCommittee: committee => dispatch(selectCommittee(committee))
});

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
