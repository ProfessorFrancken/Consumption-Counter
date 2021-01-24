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
