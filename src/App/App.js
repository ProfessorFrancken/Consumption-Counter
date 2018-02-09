import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Route, Link } from 'react-router-dom'
import MainScreen from './MainScreen/MainScreen'
import './App.css';

const Prominent = () => (
  <h2>Prominent</h2>
)

const Committees = () => (
  <h2>Committees</h2>
)

const Pricelist = () => (
  <h2>Pricelist</h2>
)

const Statistics = () => (
  <h2>Statistics</h2>
)
const GoBack = () => (
  <Link to="/">Go back</Link>
)

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <Route exact path="/prominent" component={Prominent} />
          <Route exact path="/statistics" component={Statistics} />
          <Route exact path="/committees" component={Committees} />
          <Route exact path="/pricelist" component={Pricelist} />
          <Route path="/:anything" component={GoBack} />
          <Route exact path="/" component={MainScreen} />
          <Footer />
      </div>
    );
  }
}

export default App;
