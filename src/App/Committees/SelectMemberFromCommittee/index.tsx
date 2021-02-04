import {useSelector} from "react-redux";
import {membersInCommitteesSelector} from "./../selectors";
import Members from "App/Members/Members";
import {useParams} from "react-router";
import {useOrder} from "App/Products/OrdersContext";

const SelectMemberFromCommitteeScreen = () => {
  const params = useParams();
  const members = useSelector((state) => membersInCommitteesSelector(state, params));
  const {selectMember} = useOrder();

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromCommitteeScreen;
