// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {selectCommittee} from "actions";
import {committeesWithMembersSelector} from "./selectors";
import Committees from "./Committees";

const mapStateToProps = (state: any) => ({
  committees: committeesWithMembersSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  selectCommittee: (committee: any) => dispatch(selectCommittee(committee)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
