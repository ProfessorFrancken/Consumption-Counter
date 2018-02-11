import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Route } from 'react-router-dom'
import MainScreen from './MainScreen/MainScreen'
import AvailableProducts from './../Selection/AvailableProducts'
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

const Recent = () => (
  <h2>Recent</h2>
)

const App = ({ title }) => (
  <div className="App">
    <Header title={title} />
    <div className="App-main">
      <div className="MainScreen h-100 py-3">
        <Route exact path="/prominent" component={Prominent} />
        <Route exact path="/statistics" component={Statistics} />
        <Route exact path="/committees" component={Committees} />
        <Route exact path="/pricelist" component={Pricelist} />
        <Route exact path="/recent" component={Recent} />

        <Route exact path="/products" component={AvailableProducts} />
        <Route exact path="/" component={MainScreen} />
      </div>
    </div>
    <Footer />
  </div>
)

export default App;
