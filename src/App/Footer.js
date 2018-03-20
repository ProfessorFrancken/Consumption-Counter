import React from 'react';
import GoBack from './GoBack';
import CancelOrder from './CancelOrder';

const Footer = () => (
  <div className="footer">
    <CancelOrder />
    <GoBack />
  </div>
);

export default Footer;
