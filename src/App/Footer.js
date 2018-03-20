import React from 'react';
import BuyAll from './BuyAll';
import GoBack from './GoBack';
import CancelOrder from './CancelOrder';

const Footer = () => (
  <div className="footer">
    <CancelOrder />
    <BuyAll />
    <GoBack />
  </div>
);

export default Footer;
