import React from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom'

const Logo = () => (
    <img src={logo} alt="Logo of T.F.V. 'Professor Francken'"/>
)

const Header = () => (
    <header>
        <Logo />
        <h1>
            T.F.V. 'Professor Francken'
            <small>
                Stripe system
            </small>
        </h1>
        <nav>
          <Link to="/statistics">Statistics</Link>
          <Link to="/pricelist">Pricelist</Link>
        </nav>
    </header>
)

export default Header;
