import React from 'react';
import PropTypes from 'prop-types';
import Member from './../Members/MemberButton';

const Compucie = ({ compucie, scriptcie, selectMember }) => (
  <div className="d-flex flex-column justify-content-stretch h-100">
    <nav className="compucie tilesGrid" style={{ flexShrink: 1 }}>
      {[...compucie, ...scriptcie].map(member => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </nav>

    <nav className="tilesGrid" style={{ flexShrink: 4, marginTop: '1em' }}>
      <Member
        member={{
          id: -1,
          firstName: 'Refresh',
          surname: '',
          age: 101,
          prominent: 0,
          cosmetics: {}
        }}
        onClick={() => window.location.reload()}
      />

      <Member
        member={{
          id: 0,
          firstName: 'Guest',
          surname: '',
          age: 101,
          prominent: 0,
          cosmetics: {}
        }}
        onClick={selectMember}
      />

      <Member
        member={{
          id: 0,
          firstName: 'Overdue',
          surname: '',
          age: 101,
          prominent: 0,
          cosmetics: {}
        }}
        onClick={selectMember}
      />

      <Member
        member={{
          firstName: 'Schwazi',
          surname: '',
          cosmetics: {}
        }}
        onClick={() => console.log('Schwazi')}
      />
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
