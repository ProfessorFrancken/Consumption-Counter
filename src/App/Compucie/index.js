import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { selectMember, chwazi } from '../../actions';
import { compucieSelector } from './../../selectors';
import Compucie from './Compucie';

const mapStateToProps = state => compucieSelector(state);

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member)),
  toSettings: () => dispatch(push('/settings')),
  chwazi: () => dispatch(chwazi())
});

export default connect(mapStateToProps, mapDispatchToProps)(Compucie);
