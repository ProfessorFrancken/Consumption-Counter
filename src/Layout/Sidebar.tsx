import React from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Sidebar = ({menuItems}: any) => (
  <nav className="sidebar">
    {menuItems.map((menuItem: any, i: any) => (
      <MenuItem key={menuItem.icon} menuItem={menuItem} />
    ))}
    <MenuItem menuItem={{icon: "map-marker-alt", url: "/present"}} />
  </nav>
);

const MenuItem = ({menuItem}: any) =>
  menuItem.loading ? (
    <span className="button menuButton">
      <FontAwesomeIcon icon="spinner" pulse />
    </span>
  ) : (
    <NavLink
      exact
      to={menuItem.url}
      className="button menuButton"
      activeClassName="active"
    >
      <FontAwesomeIcon icon={menuItem.icon} size="lg" />
    </NavLink>
  );

export default Sidebar;
