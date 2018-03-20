import React from 'react';
import BuyMore from './Products/BuyMoreContainer';

const Header = ({ title }) => (
  <div className="header">
    {title}
    <BuyMore />
  </div>
);

export default Header;
