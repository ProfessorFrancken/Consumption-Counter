import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Member from './../Members/MemberButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TempleCountButton from './TempleCountButton';

const Compucie = ({
  compucie,
  scriptcie,
  selectMember,
  toSettings,
  decreaseTempleCount
}) => (
  <div className="d-flex flex-column justify-content-stretch h-100">
    <nav className="tilesGrid" style={{ flexShrink: 4, marginTop: '1em' }}>
      <Member
        member={{
          id: -1,
          fullname: 'Refresh',
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: {}
        }}
        onClick={() => window.location.reload()}
      />

      <TempleCountButton decreaseTempleCount={decreaseTempleCount} />
      <NavLink exact to="/settings" className="tile button">
        <FontAwesomeIcon icon={'cogs'} size="lg" />
      </NavLink>
    </nav>

    <nav className="compucie tilesGrid" style={{ flexShrink: 1 }}>
      {[...compucie, ...scriptcie].map(member => (
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
