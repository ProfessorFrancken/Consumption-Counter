import {MemberType} from "queries/members";
import Member from "./member-button";
import SearchBar from "./layout/searchbar";

type Props = {
  members: MemberType[];
  selectMember: (member: MemberType) => void;
};

const Members = ({members, selectMember}: Props) => (
  <>
    <SearchBar />
    <nav className="tilesGrid">
      {members.map((member) => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </nav>
  </>
);

export default Members;
