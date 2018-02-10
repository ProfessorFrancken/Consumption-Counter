import React from 'react'
import faker from 'faker'

faker.seed(123)
const members = [...Array(10).keys()].map((idx) => {
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
  <div>
  <ul>
  {members.map((member, idx) => (<li key={member.id}>{member.fullName}</li>))}
  </ul>
  </div>
)

export default MainScreen
