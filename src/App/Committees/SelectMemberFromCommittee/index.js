import {connect} from "react-redux";
import {selectMember} from "actions";
import {membersInCommitteesSelector} from "./../selectors";
import Members from "App/Members/Members";

const mapStateToProps = (state, props) => ({
  members: membersInCommitteesSelector(state, props.match.params),
});

const mapDispatchToProps = (dispatch) => ({
  selectMember: (member) => dispatch(selectMember(member)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
