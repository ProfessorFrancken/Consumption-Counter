import React from "react";
import Member from "./MemberButton";

type Props = {
  members: {
    id: number;
    firstName: string;
    surname: string;
  }[];
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'selectMember' does not exist on type 'Pr... Remove this comment to see the full error message
const Members = ({members, selectMember}: Props) => (
  <nav className="tilesGrid">
    {members.map((member) => (
      <Member member={member} key={member.id} onClick={selectMember} />
    ))}
  </nav>
);

export default Members;
