import Members from "../../../components/members";
import {useParams} from "react-router";
import {useSelectMember} from "../../../components/orders-context";
import {useCommitteeMembers} from "../../../queries/committees";

const SelectMemberFromCommitteeScreen = () => {
  const selectMember = useSelectMember();
  const {page} = useParams<{page: string | undefined}>();
  const members = useCommitteeMembers(parseInt(page || "0", 10));

  return <Members members={members} selectMember={selectMember} />;
};

export default SelectMemberFromCommitteeScreen;
