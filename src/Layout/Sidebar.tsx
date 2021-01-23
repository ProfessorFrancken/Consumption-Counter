import React from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Sidebar = ({menuItems}: any) => (
  <div className="sidebar">
    {menuItems.map((menuItem: any, i: any) => (
      <MenuItem key={menuItem.icon} menuItem={menuItem} />
    ))}
    <MenuItem menuItem={{icon: "map-marker-alt", url: "/present"}} />
  </div>
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
