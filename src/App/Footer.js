import React from 'react';
import BuyAll from './BuyAll';
import GoBack from './GoBack';
import CancelOrder from './CancelOrder';
import Demcon from './../assets/DEMCON_logo.png';

const Footer = () => (
  <div
    className="footer justify-content-between"
    style={{ paddingLeft: '110px' }}
  >
    <img src={Demcon} className="h-100 py-4" />
    <div className="d-flex justify-content-end">
      <CancelOrder />
      <BuyAll />
      <GoBack />
    </div>
  </div>
);

export default Footer;
