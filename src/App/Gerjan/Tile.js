import React from 'react';

const Tile = ({ range }) => (
  <div className="tile">
    {range.surname_start} <br />
    - <br />
    {range.surname_end}
  </div>
);

export default Tile;
