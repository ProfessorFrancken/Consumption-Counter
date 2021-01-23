// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {push} from "connected-react-router";
import {selectMember, chwazi, fetchInitialData} from "actions";
import {compucieSelector} from "./../selectors";
import Compucie from "./Compucie";

const mapStateToProps = (state: any) => compucieSelector(state);

const mapDispatchToProps = (dispatch: any) => ({
  selectMember: (member: any) => dispatch(selectMember(member)),
  toSettings: () => dispatch(push("/settings")),
  decreaseTempleCount: () => dispatch(chwazi()),
  reloadApplication: () => dispatch(fetchInitialData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compucie);
