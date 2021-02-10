import {useSelector} from "react-redux";
import Members from "./../Members/Members";
import {useOrder} from "App/Products/OrdersContext";
import {useMembers} from "App/Members/Context";

const RecentScreen = () => {
  const recent = useSelector((state: any) => state.recentBuyers);
  const {members} = useMembers();
  const recentMembers = recent
    .map((recent: any) => members.find((member: any) => member.id === recent))
    // exclude members that couldn't be found (for instance guests)
    .filter((m: any) => m);

  const {selectMember} = useOrder();

  return <Members members={recentMembers} selectMember={selectMember} />;
};

export default RecentScreen;
