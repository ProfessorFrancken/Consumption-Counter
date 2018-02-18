import React from 'react'
import PropTypes from 'prop-types'
import './Members.css'
import LinkButton from './../../App/LinkButton'

const cosmetics = (cosmetics) => {
  const isPositive = (number) => Number.isInteger(number) && number > 0;

  const cosmeticSize = (isPositive(cosmetics.button.width) && isPositive(cosmetics.button.height))
  ? {
    width: cosmetics.button.width,
    height: cosmetics.button.height,
    alignSelf: 'center',
    justifySelf: 'center'
  } : {}

  return {
    backgroundColor: cosmetics.color,
    backgroundImage: cosmetics.image
                     ? `url(https:/old.professorfrancken.nl/database/streep/afbeeldingen/${cosmetics.image})`
                     : undefined,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 50%",
    ...cosmeticSize
  }
}

const MemberName = ({ member }) => (
  ( ! member.cosmetics.nickname )
  ? <span>
    {member.firstName}<br /> {member.surname}
  </span>
  : <span>{member.cosmetics.nickname}</span>
)

const Member = ({ member, onClick }) => (
  <button
    key={member.id}
    className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
    to="/products"
    style={cosmetics(member.cosmetics)}
    onClick={() => onClick(member)}
  >
    <MemberName member={member} />
  </button>
)

const Members = ({ members, selectMember }) => (
  <nav className="SelectionGrid">
    {members.map((member) => <Member member={member} key={member.id} onClick={selectMember}/>)}
  </nav>
)

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
  })).isRequired
}

export default Members
