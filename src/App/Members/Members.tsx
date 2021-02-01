import React from "react";
import Member from "./MemberButton";

export type MemberType = {
  id: number;
  firstName: string;
  surname: string;
  fullname: string;
};
type Props = {
  members: MemberType[];
  selectMember: (member: MemberType) => void;
};

const Members = ({members, selectMember}: Props) => (
  <nav className="tilesGrid">
    {members.map((member) => (
      <Member member={member} key={member.id} onClick={selectMember} />
    ))}
  </nav>
);

export default Members;
