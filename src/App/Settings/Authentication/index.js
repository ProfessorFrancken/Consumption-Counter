import { connect } from 'react-redux';
import { authenticate } from '../../../actions';
import AuthenticationForm from './AuthenticationForm';

const mapStateToProps = state => ({
  request: state.authentication.request,
  token: state.authentication.token,
  error: state.authentication.error
});

const mapDispatchToProps = dispatch => ({
  authenticate: password => dispatch(authenticate(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationForm);
