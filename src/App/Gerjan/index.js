import React from 'react';
import { connect } from 'react-redux';

import './gerjan.css';

const Gerjan = ({ ranges }) => {
  console.log(ranges);
  return (
    <div className="container">
      <div className="header">T.F.V. Professor Francken</div>
      <div className="sidebar">
        <div className="menuButton">P</div>
        <div className="menuButton active">H</div>
        <div className="menuButton">M</div>
      </div>
      <div className="content">
        {ranges.map(range => (
          <div className="tile">
            {range.surname_start} <br />
            - <br />
            {range.surname_end}
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="arrow">Arrow</div>
        Footer
      </div>
    </div>
  );
};

let a;

const mapStateToProps = state => ({
  ranges: state.surnameRanges.ranges
});

export default connect(mapStateToProps)(Gerjan);
