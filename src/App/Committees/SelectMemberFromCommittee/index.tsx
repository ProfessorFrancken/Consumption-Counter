import Members from "App/Members/Members";
import {useParams} from "react-router";
import {useSelectMember} from "App/Products/OrdersContext";
import {useCommitteeMembers} from "../CommitteesContext";

const SelectMemberFromCommitteeScreen = () => {
  const selectMember = useSelectMember();
  const {page} = useParams<{page: string | undefined}>();
  const members = useCommitteeMembers(parseInt(page || "0", 10));

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromCommitteeScreen;
