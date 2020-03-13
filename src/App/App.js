import React from 'react';
import GerrieApp from './Gerjan/App';
import { AppContent } from './AppContent';
import 'bootstrap/dist/css/bootstrap.css';
import './FontAwesome';

const App = ({
  menuItems,
  title,
  goToCompucieScreen,
  goToProminent,
  background,
  goHome,
  failedOrders
}) => (
  <GerrieApp
    menuItems={menuItems}
    background={background}
    title={title}
    goToCompucieScreen={goToCompucieScreen}
    goToProminent={goToProminent}
    goHome={goHome}
    failedOrders={failedOrders}
  >
    <AppContent />
  </GerrieApp>
);

export default App;
