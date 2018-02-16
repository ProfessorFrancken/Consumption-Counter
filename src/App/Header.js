import React from 'react';
import LinkButton from './LinkButton'
import './Header.css';
import { Route, Switch } from 'react-router-dom'
import BuyMore from '../Selection/Products/BuyMore'

// The title of the header can be set when a member chooses a product
// Note if recently an order was made, show a cancel button instead
const Header = ({ title = "T.F.V. 'Professor Francken'"}) => (
  <header className="App-header Header">
    <h1 className="App-title Header-title mb-0">
      {title}
    </h1>
    <Route exact path="/products" component={BuyMore} />
    <nav className="Header-navigation">
      <LinkButton to="/statistics" className="btn-lg mx-2">Statistics</LinkButton>
      <LinkButton to="/pricelist" className="btn-lg ml-2">Pricelist</LinkButton>
    </nav>
  </header>
)

export default Header;
