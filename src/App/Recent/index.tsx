import Members from "./../Members/Members";
import {useSelectMember} from "App/Products/OrdersContext";
import {useRecentBuyers} from "App/Transactions/TransactionsContext";

const RecentScreen = () => {
  const recentMembers = useRecentBuyers();
  const selectMember = useSelectMember();

  return <Members members={recentMembers} selectMember={selectMember} />;
};

export default RecentScreen;
