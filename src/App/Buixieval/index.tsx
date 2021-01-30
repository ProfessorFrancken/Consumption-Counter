import {MemberType} from "App/Members/Members";
import {useDispatch, useSelector} from "react-redux";
import {selectMember} from "../../actions";
import Buixieval from "./Buixieval";

const BuixieValScreen = () => {
  const dispatch = useDispatch();

  const members: MemberType[] = useSelector((state: any) =>
    state.members
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
      .sort((a: any, b: any) => b.buixieval.contributed - a.buixieval.contributed)
  );
  return (
    <Buixieval
      members={members}
      selectMember={(member: MemberType) => dispatch(selectMember(member))}
    />
  );
};

export default BuixieValScreen;
