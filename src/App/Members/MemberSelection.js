import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import Members from './Members';

const memberSelector = state => state.selectedMemberRange.members;

const mapStateToProps = state => ({ members: memberSelector(state) });

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
