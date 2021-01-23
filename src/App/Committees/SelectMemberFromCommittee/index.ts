// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {selectMember} from "actions";
import {membersInCommitteesSelector} from "./../selectors";
import Members from "App/Members/Members";

const mapStateToProps = (state: any, props: any) => ({
  members: membersInCommitteesSelector(state, props.match.params),
});

const mapDispatchToProps = (dispatch: any) => ({
  selectMember: (member: any) => dispatch(selectMember(member)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
