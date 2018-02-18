import React from 'react'
import PropTypes from 'prop-types'

const Range = ({ range, onClick }) => (
  <button
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
    onClick={() => onClick(range)}
  >
  {range.surname_start}<br />
           -<br />
  {range.surname_end}
  </button>
)

const SurnameRanges = ({ ranges, selectRange }) => (
  <nav className="SelectionGrid">
    {ranges.map((range, idx) => <Range range={range} onClick={selectRange} key={idx} />)}
  </nav>
)

SurnameRanges.propTypes = {
  ranges: PropTypes.arrayOf(PropTypes.shape({
    members: PropTypes.arrayOf(
      PropTypes.shape({
      })
    ),
    surname_start: PropTypes.string.isRequired,
    surname_end: PropTypes.string.isRequired,
  })).isRequired
}

export default SurnameRanges
