import React from 'react';
import { AppContent } from './AppContent';
import 'bootstrap/dist/css/bootstrap.css';
import './FontAwesome';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import logo from './logo.png';

const backgroundFromProduct = (background = null) => {
  return background === null
    ? {}
    : {
        backgroundImage: `url("${background}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: '50%'
      };
};

const App = ({
  menuItems,
  title,
  goToCompucieScreen,
  goToProminent,
  background,
  goHome,
  failedOrders
}) => (
  <div className="wrapper" style={backgroundFromProduct(background)}>
    <Header
      title={title}
      onClick={goToCompucieScreen}
      failedOrders={failedOrders}
    />
    <Sidebar menuItems={menuItems} />
    <Content>
      <AppContent />
    </Content>
    <Footer />
    <div className="arrow">
      <div className="arrowContent">
        <img
          src={logo}
          className="franckenLogo img-fluid"
          alt="Logo of T.F.V. 'Professor Francken'"
          onClick={goHome}
          onDoubleClick={goToProminent}
        />
      </div>
    </div>
  </div>
);

export default App;
