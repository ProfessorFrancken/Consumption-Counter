import React from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom'
import './Header.css';

const Logo = () => (
  <img
    src={logo}
    alt="Logo of T.F.V. 'Professor Francken'"
    className="App-logo Header-logo"
  />
)

const HeaderLink = ({to, children, className}) => (
  <Link className={`btn btn-outline-secondary ${className}`} to={to}>
    {children}
  </Link>
)


const Header = () => (
  <header className="App-header Header">
    <h1 className="App-title Header-title mb-0">
      T.F.V. 'Professor Francken'
    </h1>
    <nav className="Header-navigation">
      <HeaderLink to="/statistics">Statistics</HeaderLink> <HeaderLink to="/pricelist">Pricelist</HeaderLink>
    </nav>
  </header>
)

export default Header;
