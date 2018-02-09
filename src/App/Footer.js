import React from 'react'
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
