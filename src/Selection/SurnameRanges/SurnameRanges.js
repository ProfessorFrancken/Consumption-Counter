import React from 'react'
import PropTypes from 'prop-types'
import LinkButton from './../../App/LinkButton'

const Range = ({ range }) => (
  <LinkButton
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
    to="/members"
  >
    {range.surname_start} - {range.surname_end}
  </LinkButton>
)

const SurnameRanges = ({ ranges }) => (
  <nav className="SelectionGrid">
    {ranges.map((range, idx) => <Range range={range} key={idx} />)}
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
