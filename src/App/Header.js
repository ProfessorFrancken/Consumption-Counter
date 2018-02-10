import React from 'react';
import LinkButton from './LinkButton'
import './Header.css';

const Header = () => (
  <header className="App-header Header">
    <h1 className="App-title Header-title mb-0">
      T.F.V. 'Professor Francken'
    </h1>
    <nav className="Header-navigation">
      <LinkButton to="/statistics" className="btn-lg mx-2">Statistics</LinkButton>
      <LinkButton to="/pricelist" className="btn-lg ml-2">Pricelist</LinkButton>
    </nav>
  </header>
)

export default Header;
