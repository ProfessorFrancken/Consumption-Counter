import Members from "../../components/members";
import {useSelectMember} from "../../components/orders-context";
import {useRecentBuyers} from "../../queries/orders";

const RecentScreen = () => {
  const recentMembers = useRecentBuyers();
  const selectMember = useSelectMember();

  return <Members members={recentMembers} selectMember={selectMember} />;
};

export default RecentScreen;
