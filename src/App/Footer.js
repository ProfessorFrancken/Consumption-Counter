import React from 'react'
import { Route } from 'react-router-dom'
import './Footer.css';
import LinkButton from './LinkButton'

const Status = () => (
  <div className="Footer-status">
    <strong>Status:</strong> connected
  </div>
)

const GoBack = () => (
  <div className="Footer-go-back">
    <LinkButton className="btn-lg btn-block" to="/">Go back</LinkButton>
  </div>
)

const Footer = () => (
    <footer className="Footer">
        <nav className="Footer-navigation">
          <LinkButton to="/prominent" className="btn-lg mr-2">Prominent</LinkButton>
          <LinkButton to="/committees" className="btn-lg mx-2">Committees</LinkButton>
          <LinkButton to="/recent" className="btn-lg mx-2">Recent</LinkButton>
        </nav>
        <Route path="/:anything" component={GoBack} />
        <Status />
    </footer>
)

export default Footer;
