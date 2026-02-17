import Members from "../../components/members";
import {useSearchParams} from "react-router-dom";
import {useSelectMember} from "../../components/orders-context";
import {useMembers} from "queries/members";

const useFoundMembers = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name")?.trim().toLowerCase() || "";
  const {members} = useMembers();

  if (!name) return [];
  return members
    .filter((m) => m.fullname.toLowerCase().includes(name))
    .sort((a, b) => a.fullname.localeCompare(b.fullname));
};

const SearchMembers = () => {
  const foundMembers = useFoundMembers();
  const selectMember = useSelectMember();
  return <Members members={foundMembers} selectMember={selectMember} />;
};

export default SearchMembers;
