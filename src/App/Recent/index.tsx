import {useSelector} from "react-redux";
import {recentBuyersSelector} from "./selectors";
import Members from "./../Members/Members";
import {useOrder} from "App/Products/OrdersContext";

const RecentScreen = () => {
  const members = useSelector(recentBuyersSelector);
  const {selectMember} = useOrder();

  return <Members members={members} selectMember={selectMember} />;
};

export default RecentScreen;
