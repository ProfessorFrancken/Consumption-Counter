import React from "react";
import PropTypes from "prop-types";
import Member from "./../Members/MemberButton";
import {sortBy} from "lodash";

const Prominent = ({prominent, boards, selectMember}) => (
  <div className="prominentGrid">
    <div className="prominentRow">
      {prominent.map((member) => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </div>
    <div className="boardsRow">
      {boards.map((members, idx) => (
        <div className="boardColumn" key={idx}>
          {sortBy(members, (member) => member.function)
            .reverse()
            .map((member) => (
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

const MemberPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
});

Prominent.propTypes = {
  prominent: PropTypes.arrayOf(MemberPropType).isRequired,
  boards: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        function: PropTypes.string,
        member: MemberPropType.isRequired,
        year: PropTypes.number.isRequired,
      })
    )
  ).isRequired,
};

export default Prominent;
