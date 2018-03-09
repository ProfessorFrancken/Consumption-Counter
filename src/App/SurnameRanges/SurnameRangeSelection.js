import { connect } from 'react-redux';
import SurnameRanges from './SurnameRanges';
import { selectRangeOfSurnames } from './../../actions';

const rangesSelector = state => state.surnameRanges.ranges;

const mapStateToProps = state => ({
  ranges: rangesSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectRange: range => dispatch(selectRangeOfSurnames(range))
});

export default connect(mapStateToProps, mapDispatchToProps)(SurnameRanges);
