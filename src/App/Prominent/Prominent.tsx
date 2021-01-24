import React from "react";
import PropTypes from "prop-types";
import Member from "./../Members/MemberButton";
import {sortBy} from "lodash";

type Props = {
  prominent: MemberPropType[];
  boards: {
    id: number;
    function?: string;
    member: MemberPropType;
    year: number;
  }[][];
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'selectMember' does not exist on type 'Pr... Remove this comment to see the full error message
const Prominent = ({prominent, boards, selectMember}: Props) => (
  <div className="prominentGrid">
    <div className="prominentRow">
      {prominent.map((member) => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </div>
    <div className="boardsRow">
      {boards.map((members, idx) => (
        <div className="boardColumn" key={idx}>
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

type MemberPropType = {
  id: number;
  firstName: string;
  surname: string;
};

const MemberPropType: PropTypes.Requireable<MemberPropType> = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
});

export default Prominent;
