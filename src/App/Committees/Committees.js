import React from 'react';
import PropTypes from 'prop-types';

const Committee = ({ committee, onClick }) => (
  <div className="button tile" onClick={() => onClick(committee)}>
    {committee.name}
  </div>
);

const Committees = ({ committees, selectCommittee }) => (
  <nav className="tilesGrid">
    {committees.map((committee, idx) => (
      <Committee committee={committee} onClick={selectCommittee} key={idx} />
    ))}
  </nav>
);

Committees.propTypes = {
  committees: PropTypes.arrayOf(
    PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.shape({})),
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Committees;
