// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {loadingScreenSelector} from "./selectors";
import LoadingScreen from "./LoadingScreen";

const mapStateToProps = (state: any) => loadingScreenSelector(state);

export default connect(mapStateToProps)(LoadingScreen);
