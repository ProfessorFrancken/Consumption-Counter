import React from 'react';

// TODO add settings integration

// Add on click which shows settings menu
const Status = ({ status = 'success' }) => (
  <div className="Footer-status">
    <button className={`btn text-white`} style={{ background: 'none' }}>
      Status: <span className={`text-${status}`}>●</span>
    </button>
  </div>
);

export default Status;
