import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Member from './../Members/MemberButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TempleCountButton from './TempleCountButton';
import { sortBy } from 'lodash';

const Compucie = ({
  members,
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

    <ul className="list-unstyled">
      {sortBy(members, member => member.fullname).map(member => (
        <li className="d-flex justify-content-between p-2 my-3 bg-white">
          <strong className="">{member.fullname}</strong>
          <div>
            <span className="px-3">{member.group}</span>
            <button className="btn">Edit</button>
          </div>
        </li>
      ))}
    </ul>

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
