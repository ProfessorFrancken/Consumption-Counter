import React from "react";
import Member from "./MemberButton";

export type MemberType = {
  id: number;
  firstName: string;
  surname: string;
  fullname: string;
  latest_purchase_at: null | Date;
  age: number;

  prominent: null | number;
  cosmetics:
    | undefined
    | {
        color: string | null;
        image: string | null;
        nickname: string | null;
        button: {
          width: number | null;
          height: number | null;
        };
      };
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
