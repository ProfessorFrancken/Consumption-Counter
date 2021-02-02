import {MemberType} from "App/Members/Members";
import {useSelector} from "react-redux";
import Buixieval from "./Buixieval";
import {useProductPurchase} from "App/Products/Context";

const BuixieValScreen = () => {
  const {selectMember} = useProductPurchase();

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
  return <Buixieval members={members} selectMember={selectMember} />;
};

export default BuixieValScreen;
