import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Route } from 'react-router-dom'
import MainScreen from './MainScreen/MainScreen'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

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

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <div className="App-main">
            <Route exact path="/prominent" component={Prominent} />
            <Route exact path="/statistics" component={Statistics} />
            <Route exact path="/committees" component={Committees} />
            <Route exact path="/pricelist" component={Pricelist} />

            <Route exact path="/" component={MainScreen} />

          </div>
          <Footer />
      </div>
    );
  }
}

export default App;
