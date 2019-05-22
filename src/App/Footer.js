import React from 'react';
import BuyAll from './BuyAll';
import GoBack from './GoBack';
import CancelOrder from './CancelOrder';
import Sponsors from './Sponsors';

const Footer = () => (
  <div
    className="footer d-flex justify-content-between"
    style={{ paddingLeft: '110px' }}
  >
    <Sponsors />
    <div className="flex-grow-2 d-flex">
      {/* <img src={Demcon} className="h-100 py-4 img-fluid" /> */}
      <CancelOrder />
      <BuyAll />
      <GoBack />
    </div>
  </div>
);

export default Footer;
