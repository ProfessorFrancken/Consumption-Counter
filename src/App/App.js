import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Route, Switch } from 'react-router-dom'
import SurnameRanges from './../Selection/SurnameRanges/SurnameRangeSelection'
import Members from './../Selection/Members/MemberSelection'
import AvailableProducts from './../Selection/Products/AvailableProducts'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Transactions from './Transactions'

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
  <div>
    <h2>Statistics</h2>
    <Transactions />
  </div>
)

const Recent = () => (
  <h2>Recent</h2>
)

const AppContent = () => (
  <div className="App-main">
      <div className="MainScreen h-100 py-3">
        <Switch>
        <Route exact path="/prominent" component={Prominent} />
        <Route exact path="/statistics" component={Statistics} />
        <Route exact path="/committees" component={Committees} />
        <Route exact path="/pricelist" component={Pricelist} />
        <Route exact path="/recent" component={Recent} />

        <Route exact path="/products" component={AvailableProducts} />
        <Route exact path="/" component={SurnameRanges} />
        <Route exact path="/members" component={Members} />
        </Switch>
      </div>
    </div>
)

const App = ({ title }) => (
  <div className="App">
    <Header title={title} />
    <AppContent />
    <Footer />
  </div>
)

export default App;
