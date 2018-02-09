import React from 'react'
import faker from 'faker'

faker.seed(123)
const members = [...Array(1000).keys()].map((idx) => {
  return {
    fullName: faker.fake("{{name.lastName}}, {{name.firstName}}"),
    id: idx,
  }
})

const MainScreen = () => (
  <ul>
  {members.map((member, idx) => (<li key={member.id}>{member.fullName}</li>))}
  </ul>
)

export default MainScreen
