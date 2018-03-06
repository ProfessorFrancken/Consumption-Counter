import React from 'react';

import Content from '../Content';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';

const menuItems = [
  {
    icon: 'chess-queen',
    url: '/prominent'
  },
  {
    icon: 'home',
    url: '/',
    active: true
  },
  {
    icon: 'users',
    url: '/committees'
  },
  {
    icon: 'chart-area',
    url: '/statistics'
  },
  {
    icon: 'clock',
    url: '/recent'
  }
];

const App = ({ children, title }) => (
  <div className="wrapper">
    <Header title={title} />
    <Sidebar menuItems={menuItems} />
    <Content>{children}</Content>
    <Footer />
    <div className="arrow">
      <div className="arrowContent">
        <img
          src="https://professorfrancken.nl/images/LOGO_KAAL.png"
          className="franckenLogo img-fluid"
        />
      </div>
    </div>
  </div>
);

export default App;
