// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {authenticate} from "../../../actions";
import AuthenticationForm from "./AuthenticationForm";

const mapStateToProps = (state: any) => ({
  request: state.authentication.request,
  token: state.authentication.token,
  error: state.authentication.error,
});

const mapDispatchToProps = (dispatch: any) => ({
  authenticate: (password: any) => dispatch(authenticate(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationForm);
