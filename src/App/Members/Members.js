import React from 'react';
import PropTypes from 'prop-types';
import Member from './MemberButton';

const Members = ({ members, selectMember }) => (
  <nav className="SelectionGrid">
    {members.map(member => (
      <Member member={member} key={member.id} onClick={selectMember} />
    ))}
  </nav>
);

Members.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      surname: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Members;
