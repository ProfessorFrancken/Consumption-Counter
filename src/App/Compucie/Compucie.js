import React from 'react';
import PropTypes from 'prop-types';
import Member from './../Members/MemberButton';

const Compucie = ({ compucie, scriptcie, selectMember }) => (
  <div className="d-flex flex-column justify-content-stretch h-100">
    <h2>Compucie</h2>
    <nav className="SelectionGrid" style={{ flexShrink: 4 }}>
      {compucie.map(member => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </nav>
    <nav className="SelectionGrid" style={{ flexShrink: 4 }}>
      {scriptcie.map(member => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </nav>
  </div>
);

const MemberPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired
});

Compucie.propTypes = {
  compucie: PropTypes.arrayOf(MemberPropType).isRequired,
  scriptcie: PropTypes.arrayOf(MemberPropType).isRequired
};

export default Compucie;
