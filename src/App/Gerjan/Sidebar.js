import React from 'react';
import Icon from './Icon';

const Sidebar = ({ menuItems }) => (
  <div className="sidebar">
    {menuItems.map((menuItem, i) => <MenuItem key={i} menuItem={menuItem} />)}
  </div>
);

const MenuItem = ({ menuItem }) => (
  <div className={'menuButton ' + (menuItem.active ? 'active' : '')}>
    <Icon name={menuItem.icon} />
  </div>
);

export default Sidebar;
