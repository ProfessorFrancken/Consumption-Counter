// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {selectMember} from "../../actions";
import {recentBuyersSelector} from "./selectors";
import Members from "./../Members/Members";

const mapStateToProps = (state: any) => ({
  members: recentBuyersSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  selectMember: (member: any) => dispatch(selectMember(member)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
