import {useSelector} from "react-redux";
import {recentBuyersSelector} from "./selectors";
import Members from "./../Members/Members";
import {useProductPurchase} from "App/Products/Context";

const RecentScreen = () => {
  const members = useSelector(recentBuyersSelector);
  const {selectMember} = useProductPurchase();

  return <Members members={members} selectMember={selectMember} />;
};

export default RecentScreen;
