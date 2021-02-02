import {useSelector} from "react-redux";
import {membersInCommitteesSelector} from "./../selectors";
import Members from "App/Members/Members";
import {useParams} from "react-router";
import {useProductPurchase} from "App/Products/Context";

const SelectMemberFromCommitteeScreen = () => {
  const params = useParams();
  const members = useSelector((state) => membersInCommitteesSelector(state, params));
  const {selectMember} = useProductPurchase();

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromCommitteeScreen;
