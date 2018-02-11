import React from 'react'
import faker from 'faker'
import PropTypes from 'prop-types'
import './Members.css'
import LinkButton from './../../App/LinkButton'
import { sortBy, chunk } from 'lodash'

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

}

export default Members
