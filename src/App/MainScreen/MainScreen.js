import React from 'react'
import faker from 'faker'
import './MainScreen.css'
import LinkButton from './../LinkButton'
import { sortBy } from 'underscore'

faker.seed(123)
const members = sortBy(
  [...Array(6 * 7).keys()].map((idx) => {
    const surname = faker.name.lastName();
    const firstName = faker.name.firstName();
    return {
      surname,
      fullName: `${firstName} ${surname}`,
      id: idx,
      birthday: undefined,
      cosmetics: undefined
    }
  }),
  (member) => member.surname
);

const MainScreen = () => (
  <div className="MainScreen h-100 py-3">
    <nav className="SelectionGrid">
      {members.map((member, idx) => (
        <LinkButton
          key={member.id}
          className="SelectionItem btn btn-outline-light d-flex flex-column justify-content-center"
          to="/products"
          >
          {member.fullName}
        </LinkButton>
      ))}
    </nav>
  </div>
)

export default MainScreen
