import React from 'react';
import BuyAll from './BuyAll';
import GoBack from './GoBack';
import CancelOrder from './CancelOrder';
import Demcon from './../assets/sponsors/DEMCON-gray.png';
import Thales from './../assets/sponsors/Thales-gray.png';
import ASML from './../assets/sponsors/ASML.png';

const Sponsors = () => (
  <ul className="list-unstyled my-0 flex-grow-0 d-flex">
    <li className="d-flex align-items-center mx-3">
      <img
        src={Demcon}
        className="h-100 py-3 img-fluid"
        style={{ maxWidth: '200px' }}
      />
    </li>
    <li className="d-flex align-items-center mx-3">
      <img
        src={Thales}
        className="h-100 py-3 img-fluid"
        style={{ maxWidth: '200px' }}
      />
    </li>
    <li className="d-flex align-items-center mx-3">
      <img
        src={ASML}
        className="h-100 py-3 img-fluid"
        style={{ maxWidth: '200px' }}
      />
    </li>
  </ul>
);

export default Sponsors;
