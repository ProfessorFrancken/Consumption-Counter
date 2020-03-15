import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SurnameRanges from 'App/SurnameRanges';
import Members from './/Members/MemberSelection';
import AvailableProducts from 'App/Products/';
import PriceList from 'App/Products/PriceList/';
import Prominent from './Prominent/';
import Committees from './Committees/';
import CommitteeMembers from './Committees/CommitteeMembers';
import RecentMembers from './Recent/';
import Compucie from './Compucie/';
import Authenticate from './Settings/Authentication/';
import Settings from './Settings/';
import Statistics from './Statistics/';
import Present from './Present/';
import Buixieval from './Buixieval/';
import Loading from 'Loading';

export const AppContent = () => (
  <Switch>
    <Route exact path="/loading" component={Loading} />
    <Route exact path="/settings" component={Settings} />
    <Route exact path="/authenticate" component={Authenticate} />
    <Route exact path="/compucie" component={Compucie} />
    <Route exact path="/prominent" component={Prominent} />
    <Route exact path="/statistics" component={Statistics} />
    <Route exact path="/committees" component={Committees} />
    <Route exact path="/committees/:page" component={CommitteeMembers} />
    <Route exact path="/pricelist" component={PriceList} />
    <Route exact path="/recent" component={RecentMembers} />
    <Route exact path="/products" component={AvailableProducts} />
    <Route exact path="/" component={SurnameRanges} />
    <Route exact path="/buixieval" component={Buixieval} />
    <Route exact path="/members/:page(\d+)" component={Members} />
    <Route exact path="/statistics" component={Statistics} />
    <Route exact path="/present" component={Present} />
    <Redirect from="/members" to="/" />
  </Switch>
);
