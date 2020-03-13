import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { selectMember, chwazi } from '../../actions';
import { compucieSelector } from './../../selectors';
import { fetchInitialData } from './../../actions';
import Compucie from './Compucie';

const mapStateToProps = state => compucieSelector(state);

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member)),
  toSettings: () => dispatch(push('/settings')),
  decreaseTempleCount: () => dispatch(chwazi()),
  reloadApplication: () => dispatch(fetchInitialData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Compucie);
