import { Link } from 'react-router-dom';
import React from 'react';
import Icon from './Icon';

const Sidebar = ({ menuItems }) => (
  <div className="sidebar">
    {menuItems.map((menuItem, i) => <MenuItem key={menuItem.icon} menuItem={menuItem} />)}
  </div>
);

const MenuItem = ({ menuItem }) => (
  <Link to={menuItem.url} className="button menuButton" activeClassName="active">
    <Icon name={menuItem.icon} />
  </Link>
);

export default Sidebar;
