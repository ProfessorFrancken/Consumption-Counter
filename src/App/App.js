import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Route, Switch } from 'react-router-dom';
import SurnameRanges from './/SurnameRanges/SurnameRangeSelection';
import Members from './/Members/MemberSelection';
import AvailableProducts from './/Products/AvailableProducts';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Transactions from './Transactions/';
import PriceList from './PriceList/';
import Prominent from './Prominent/';
import Committees from './Committees/';
import RecentMembers from './Recent/';

const Statistics = () => (
  <div>
    <h2>Statistics</h2>
    <Transactions />
  </div>
);

const AppContent = () => (
  <div className="App-main">
    <div className="MainScreen h-100 py-3">
      <Switch>
        <Route exact path="/prominent" component={Prominent} />
        <Route exact path="/statistics" component={Statistics} />
        <Route exact path="/committees" component={Committees} />
        <Route exact path="/committee-members" component={Members} />
        <Route exact path="/pricelist" component={PriceList} />
        <Route exact path="/recent" component={RecentMembers} />

        <Route exact path="/products" component={AvailableProducts} />
        <Route exact path="/" component={SurnameRanges} />
        <Route exact path="/members" component={Members} />
      </Switch>
    </div>
  </div>
);

const backgroundFromProduct = (background = null) => {
  return background === null
    ? {}
    : {
        backgroundImage: `url("${background}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: '50%'
      };
};

const App = ({ title, background }) => (
  <div className="App" style={backgroundFromProduct(background)}>
    <Header title={title} />
    <AppContent />
    <Footer />
  </div>
);

export default App;
