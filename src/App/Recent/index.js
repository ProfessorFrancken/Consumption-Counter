import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import { recentSelector } from './../../selectors';
import Members from './../Members/Members';

const mapStateToProps = state => ({
  members: recentSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
