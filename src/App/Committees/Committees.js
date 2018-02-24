import React from 'react';
import PropTypes from 'prop-types';

const Committee = ({ committee, onClick }) => (
  <button
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
    onClick={() => onClick(committee)}
  >
    {committee.name}
  </button>
);

const Committees = ({ committees, selectCommittee }) => (
  <nav className="SelectionGrid">
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
