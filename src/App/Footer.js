import React from 'react'
import { Link } from 'react-router-dom'

const Status = () => (
  <div>
    <strong>Status:</strong> connected
  </div>
)

const Footer = () => (
    <footer>
        <nav>
          <Link to="/prominent">Prominent</Link>
          <Link to="/committees">Committees</Link>
        </nav>
        <Status />
    </footer>
)

export default Footer;
