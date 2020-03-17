import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import { boardsSelector, prominentSelector } from './selectors';
import Prominent from './Prominent';

const mapStateToProps = state => ({
  boards: boardsSelector(state),
  prominent: prominentSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Prominent);
