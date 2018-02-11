import React from 'react'
import PropTypes from 'prop-types'
import './Members.css'
import LinkButton from './../../App/LinkButton'

const Member = ({ member }) => (
  <LinkButton
    key={member.id}
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
    to="/products"
  >
    {member.firstName}<br />
    {member.surname}
  </LinkButton>
)

const Members = ({ members }) => (
  <nav className="SelectionGrid">
    {members.map((member) => <Member member={member} key={member.id} />)}
  </nav>
)

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
  })).isRequired
}

export default Members
