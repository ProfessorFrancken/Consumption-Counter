import React from 'react';
import { Route, NavLink } from 'react-router-dom';

const Header = ({ title, onClick }) => (
  <div className="header">
    <div className="titleName header-item">
      <Route exact path="/pricelist" render={() => <span>Pricelist</span>} />
      <Route exact path="/settings" render={() => <span>Settings</span>} />
      <Route exact path="/prominent" render={() => <span>Prominent</span>} />
      <Route exact path="/recent" render={() => <span>Recent</span>} />
      <Route exact path="/committees" render={() => <span>Committees</span>} />
      <Route exact path="/statistics" render={() => <span>Statistics</span>} />
      <Route
        exact
        path="/screensaver"
        render={() => <span>Screensaver</span>}
      />
      <Route
        exact
        path="/committees/:page(\d+)"
        render={() => <span>{title}</span>}
      />
      <Route exact path="/products" render={() => <span>{title}</span>} />
    </div>
    <div className="header-item">
      <Route
        exact
        path="/pricelist"
        render={() => (
          <NavLink exact to="/products">
            Buy products
          </NavLink>
        )}
      />
      <Route
        exact
        path="/products"
        render={() => (
          <NavLink exact to="/pricelist">
            Show prices
          </NavLink>
        )}
      />
    </div>
    <div className="association header-item" onClick={onClick}>
      Options
    </div>
  </div>
);

export default Header;
