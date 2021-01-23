// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import SurnameRanges from "./SurnameRanges";
import {selectRangeOfSurnames} from "./../../actions";
import {rangesSelector} from "./../../selectors";

const mapStateToProps = (state: any) => ({
  ranges: rangesSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  selectRange: (range: any) => dispatch(selectRangeOfSurnames(range)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurnameRanges);
