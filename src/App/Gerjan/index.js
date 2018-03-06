import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Sidebar from './Sidebar';
import Tile from './Tile';

import './gerjan.css';

const menuItems = [
  {
    icon: 'chess-queen'
  },
  {
    icon: 'home',
    active: true
  },
  {
    icon: 'users'
  },
  {
    icon: 'chart-area'
  },
  {
    icon: 'clock'
  }
];

const Gerjan = ({ ranges }) => (
  <div className="container">
    <Header title="T.F.V. Professor Francken" />
    <Sidebar menuItems={menuItems} />
    <div className="content">{ranges.map(range => <Tile range={range} />)}</div>
    <div className="footer">
      <div className="arrow">Arrow</div>
      Footer
    </div>
  </div>
);

let a;

const mapStateToProps = state => ({
  ranges: state.surnameRanges.ranges
});

export default connect(mapStateToProps)(Gerjan);
