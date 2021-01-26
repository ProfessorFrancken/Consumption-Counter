import React from "react";
import Member from "./../Members/MemberButton";
import {sortBy} from "lodash";
import {MemberType} from "App/Members/Members";

type Props = {
  prominent: MemberType[];
  boards: {
    id: number;
    function?: string;
    member: MemberType;
    year: number;
  }[][];
  selectMember: (member: MemberType) => void;
};

const Prominent = ({prominent, boards, selectMember}: Props) => (
  <div className="prominentGrid">
    <div className="prominentRow" aria-label="prominent members">
      {prominent.map((member) => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </div>
    <div className="boardsRow">
      {boards.map((members, idx) => (
        <div className="boardColumn" key={idx} aria-label="board">
          {sortBy(members, (member: any) => member.function)
            .reverse()
            .map((member: any) => (
              <Member
                member={member.member}
                key={member.member.id}
                onClick={selectMember}
              />
            ))}
        </div>
      ))}
    </div>
  </div>
);

export default Prominent;
