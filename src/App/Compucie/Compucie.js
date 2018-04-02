import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Member from './../Members/MemberButton';
import Icon from './../Icon';

const Compucie = ({
  compucie,
  scriptcie,
  selectMember,
  toSettings,
  chwazi
}) => (
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
          fullname: 'Refresh',
          age: 101,
          prominent: 0,
          cosmetics: {}
        }}
        onClick={() => window.location.reload()}
      />

      <Member
        member={{
          id: 1098,
          fullname: 'Guest',
          age: 101,
          prominent: 0,
          cosmetics: {}
        }}
        onClick={selectMember}
      />

      <Member
        member={{
          id: 1098,
          fullname: 'Overdue',
          age: 101,
          prominent: 0,
          cosmetics: {}
        }}
        onClick={selectMember}
      />

      <Member
        member={{
          fullname: 'Chwazi',
          cosmetics: {}
        }}
        onClick={chwazi}
      />
      <div>
        {/* This div is deliberately left empty so that the settings
               button will be placed at the right most part of the grid
             */}
      </div>
      <NavLink exact to="/settings" className="tile button">
        <Icon name="cogs" />
      </NavLink>
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
