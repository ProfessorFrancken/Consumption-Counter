import React from "react";
import Demcon from "assets/sponsors/DEMCON-gray.png";
import Thales from "assets/sponsors/Thales-gray.png";
import ASML from "assets/sponsors/ASML.png";

const Sponsors = () => (
  <ul className="company-logos list-unstyled my-0 flex-grow-0 d-flex">
    <li className="d-flex align-items-center mx-3">
      <img
        src={Demcon}
        alt="Demcon"
        className="h-100 py-3 img-fluid"
        style={{maxWidth: "200px"}}
      />
    </li>
    <li className="d-flex align-items-center mx-3">
      <img
        src={Thales}
        alt="Thales"
        className="h-100 py-3 img-fluid"
        style={{maxWidth: "200px"}}
      />
    </li>
    <li className="d-flex align-items-center mx-3">
      <img
        src={ASML}
        alt="ASML"
        className="h-100 py-3 img-fluid"
        style={{maxWidth: "200px"}}
      />
    </li>
  </ul>
);

export default Sponsors;
