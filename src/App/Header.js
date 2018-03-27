import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

const Title = ({ title }) => <span>{title}</span>;

const Header = ({ title, onClick }) => (
  <div className="header">
    <div className="titleName">
      <Route exact path="/prominent" render={() => <span>Prominent</span>} />
      <Route exact path="/recent" render={() => <span>Recent</span>} />
      <Route exact path="/committees" render={() => <span>Committees</span>} />
      <Route
        exact
        path="/committees/:page(\d+)"
        render={() => <span>{title}</span>}
      />
      <Route exact path="/products" render={() => <span>{title}</span>} />
    </div>
    <div className="association" onClick={onClick}>
      T.F.V. 'Professor Francken'
    </div>
  </div>
);

export default Header;
