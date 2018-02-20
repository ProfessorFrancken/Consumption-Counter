import React from 'react';
import PropTypes from 'prop-types';
import Member from './../Members/MemberButton';
import { groupBy, sortBy, take, first } from 'lodash';

const Prominent = ({ prominent, boards, selectMember }) => (
  <div className="d-flex flex-column justify-content-stretch h-100">
    <nav className="SelectionGrid" style={{ flexShrink: 4 }}>
      {prominent.map(member => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </nav>
    <nav
      className="d-flex justify-content-stretch h-100"
      style={{ flexGrow: 1, height: '1%' }}
    >
      {boards.map(board => (
        <div
          className="d-flex flex-wrap flex-column"
          style={{ flexGrow: 1, width: '1%', gridTemplateColumns: '1fr' }}
        >
          {sortBy(board, board => board.function)
            .reverse()
            .map(member => (
              <Member
                member={member.member}
                key={member.member.id}
                onClick={selectMember}
                // I'm not sure why, but setting the height of the button makes sure that all
                // buttons in the same collumn get the same height
                style={{ height: '1px' }}
              />
            ))}
        </div>
      ))}
    </nav>
  </div>
);

const MemberPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired
});

Prominent.propTypes = {
  prominent: PropTypes.arrayOf(MemberPropType).isRequired,
  boards: PropTypes.arrayOf(MemberPropType).isRequired
};

export default Prominent;
