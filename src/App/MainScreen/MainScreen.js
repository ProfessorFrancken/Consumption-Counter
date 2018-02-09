import React from 'react'
import faker from 'faker'

faker.seed(123)
const members = [...Array(1000)].map((idx) =>
  faker.fake("{{name.lastName}}, {{name.firstName}}")
)

const MainScreen = () => (
  <ul>
  {members.map((member, idx) => (<li key={idx}>{member}</li>))}
  </ul>
)

export default MainScreen
