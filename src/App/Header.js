import React from 'react';
import logo from './logo.svg';

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
    </header>
)

export default Header;
