import React from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom'

const Footer = () => (
    <footer>
        <nav>
          <Link to="/prominent">Prominent</Link>
          <Link to="/committees">Committees</Link>
        </nav>
    </footer>
)

export default Footer;
