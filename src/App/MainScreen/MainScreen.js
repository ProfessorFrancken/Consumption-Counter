import React from 'react'
import faker from 'faker'
import './MainScreen.css'

faker.seed(123)
const members = [...Array(6 * 7).keys()].map((idx) => {
  const surname = faker.name.lastName();
  const firstName = faker.name.firstName();
  return {
    surname,
    fullName: `${firstName} ${surname}`,
    id: idx,
    birthday: undefined,
    cosmetics: undefined
  }
})

const MainScreen = () => (
  <div className="MainScreen h-100 py-3">
  <ul className="SelectionGrid">
    {members.map((member, idx) => (
      <li
        key={member.id}
        className="SelectionItem"
        >
        {member.fullName}
      </li>
    ))}
  </ul>
  </div>
)

export default MainScreen
