import { connect } from 'react-redux';
import { loadingScreenSelector } from './selectors';
import LoadingScreen from './LoadingScreen';

const mapStateToProps = state => loadingScreenSelector(state);

export default connect(mapStateToProps)(LoadingScreen);
