import React from 'react';
import { connect } from 'react-redux';

import App from './Gerjan/App';
import Tile from './Tile';

const Gerjan = ({ ranges }) => (
  <App>
    <div className="membersRangesContainer">
      {ranges.map(range => <Tile key={range.surname_start} range={range} />)}
    </div>
  </App>
);

const mapStateToProps = state => ({
  ranges: state.surnameRanges.ranges
});

export default connect(mapStateToProps)(Gerjan);
