import React from 'react'
import { Route } from 'react-router-dom'
import './Footer.css';
import LinkButton from './LinkButton'
import GoBack from './GoBack'
import Status from './Status'

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
