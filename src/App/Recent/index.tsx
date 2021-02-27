import Members from "./../Members/Members";
import {useOrder} from "App/Products/OrdersContext";
import {useRecentBuyers} from "App/Transactions/TransactionsContext";

const RecentScreen = () => {
  const recentMembers = useRecentBuyers();
  const {selectMember} = useOrder();

  return <Members members={recentMembers} selectMember={selectMember} />;
};

export default RecentScreen;
