import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SurnameRanges from './/SurnameRanges/SurnameRangeSelection';
import Members from './/Members/MemberSelection';
import AvailableProducts from './/Products/AvailableProducts';
import 'bootstrap/dist/css/bootstrap.css';
import Transactions from './Transactions/';
import PriceList from './PriceList/';
import Prominent from './Prominent/';
import Committees from './Committees/';
import CommitteeMembers from './Committees/CommitteeMembers';
import RecentMembers from './Recent/';
import Compucie from './Compucie/';

import GerrieApp from './Gerjan/App';

const Statistics = () => (
  <div>
    <h2>Statistics</h2>
    <Transactions />
  </div>
);

const AppContent = () => (
  <Switch>
    <Route exact path="/compucie" component={Compucie} />
    <Route exact path="/prominent" component={Prominent} />
    <Route exact path="/statistics" component={Statistics} />
    <Route exact path="/committees" component={Committees} />
    <Route exact path="/committees/:page" component={CommitteeMembers} />
    <Route exact path="/pricelist" component={PriceList} />
    <Route exact path="/recent" component={RecentMembers} />
    <Route exact path="/products" component={AvailableProducts} />
    <Route exact path="/" component={SurnameRanges} />
    <Route exact path="/members/:page(\d+)" component={Members} />
    <Redirect from="/members" to="/" />
  </Switch>
);

const App = ({ title, goToCompucieScreen, background }) => (
  <GerrieApp
    background={background}
    title={title}
    goToCompucieScreen={goToCompucieScreen}
  >
    <AppContent />
  </GerrieApp>
);

export default App;
