import { connect } from 'react-redux';
import { selectMember } from '../../actions';
import { compucieSelector } from './../../selectors';
import Compucie from './Compucie';

const mapStateToProps = state => {
  return compucieSelector(state);
};

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Compucie);
