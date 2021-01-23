import {connect} from "react-redux";
import SurnameRanges from "./SurnameRanges";
import {selectRangeOfSurnames} from "./../../actions";
import {rangesSelector} from "./../../selectors";

const mapStateToProps = (state) => ({
  ranges: rangesSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  selectRange: (range) => dispatch(selectRangeOfSurnames(range)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurnameRanges);
