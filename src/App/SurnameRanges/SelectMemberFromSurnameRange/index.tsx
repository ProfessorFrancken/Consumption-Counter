import {useSelector} from "react-redux";
import {membersInRangeSelector} from "selectors";
import Members from "App/Members/Members";
import {useParams} from "react-router";
import {useProductPurchase} from "App/Products/Context";

const SelectMemberFromSurnameRangeScreen = () => {
  const params = useParams();
  const members = useSelector((state: any) => membersInRangeSelector(state, params));
  const {selectMember} = useProductPurchase();

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromSurnameRangeScreen;
