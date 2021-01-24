import {connect} from "react-redux";
import {selectMember} from "../../actions";

import Buixieval from "./Buixieval";

const mapStateToProps = ({members}: any) => ({
  members: members
    .filter(
      (member: any) =>
        member.buixieval &&
        (member.buixieval.team === "p" || member.buixieval.team === "b")
    )
    .map((member: any) =>
      Object.assign({}, member, {
        buixieval: Object.assign({}, member.buixieval, {
          contributed: parseFloat(member.buixieval.contributed),
        }),
      })
    )
    .sort((a: any, b: any) => b.buixieval.contributed - a.buixieval.contributed),
});

const mapDispatchToProps = (dispatch: any) => ({
  selectMember: (member: any) => dispatch(selectMember(member)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Buixieval);
