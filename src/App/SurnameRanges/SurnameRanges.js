import React from 'react';
import PropTypes from 'prop-types';

const Range = ({ range, onClick }) => (
  <div className="button tile" onClick={() => onClick(range)}>
    {range.surname_start}
    <br />
    -<br />
    {range.surname_end}
  </div>
);

const SurnameRanges = ({ ranges, selectRange }) => (
  <div className="tilesGrid">
    {ranges.map((range, idx) => (
      <Range range={range} onClick={selectRange} key={idx} />
    ))}
  </div>
);

SurnameRanges.propTypes = {
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.shape({})),
      surname_start: PropTypes.string.isRequired,
      surname_end: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SurnameRanges;
