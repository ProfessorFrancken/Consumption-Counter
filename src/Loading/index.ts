import {connect} from "react-redux";
import {loadingScreenSelector} from "./selectors";
import LoadingScreen from "./LoadingScreen";

const mapStateToProps = (state: any) => loadingScreenSelector(state);

export default connect(mapStateToProps)(LoadingScreen);
