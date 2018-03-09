import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import Members from './Members';
import { rangeSelector } from './../../selectors';

const mapStateToProps = state => ({ members: rangeSelector(state) });

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
