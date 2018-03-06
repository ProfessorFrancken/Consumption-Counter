import React from 'react';

const Sidebar = ({ menuItems }) => {
  const style = {};

  return (
    <div style={style}>
      {menuItems.map(menuItem => <MenuButton menuItem={menuItem} />)}
    </div>
  );
};

const MenuButton = ({ menuItem }) => {
  const style = {};

  return <div style={style}>{menuItem.title}</div>;
};

export default Sidebar;
