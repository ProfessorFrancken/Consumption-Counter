import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import { recentBuyersSelector } from './../../selectors';
import Members from './../Members/Members';

const mapStateToProps = state => ({
  members: recentBuyersSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
