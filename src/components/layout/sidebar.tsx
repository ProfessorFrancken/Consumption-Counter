import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const MenuItem = ({menuItem}: any) =>
  menuItem.loading ? (
    <span className="button menuButton">
      <FontAwesomeIcon icon="spinner" pulse />
    </span>
  ) : (
    <NavLink
      to={menuItem.url}
      className={(props) => `button menuButton ${props.isActive ? "active" : ""}`}
      aria-label={menuItem.label}
    >
      <FontAwesomeIcon icon={menuItem.icon} size="lg" />
    </NavLink>
  );

const Sidebar = ({menuItems}: any) => (
  <nav className="sidebar">
    {menuItems.map((menuItem: any, i: any) => (
      <MenuItem key={menuItem.icon} menuItem={menuItem} />
    ))}
  </nav>
);

export default Sidebar;
