import React from 'react'
import { Route, Link } from 'react-router-dom'
import './Footer.css';

const Status = () => (
  <div className="Footer-status">
    <strong>Status:</strong> connected
  </div>
)

const FooterLink = ({to, children, className}) => (
  <Link className={`btn btn-outline-secondary ${className}`} to={to}>
    {children}
  </Link>
)

const GoBack = () => (
  <div className="Footer-go-back">
    <FooterLink className="btn-block" to="/">Go back</FooterLink>
  </div>
)


const Footer = () => (
    <footer className="Footer">
        <nav className="Footer-navigation">
          <FooterLink to="/prominent">Prominent</FooterLink> <FooterLink to="/committees">Committees</FooterLink> <FooterLink to="/recent">Recent</FooterLink>
        </nav>
        <Route path="/:anything" component={GoBack} />
        <Status />
    </footer>
)

export default Footer;
