import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useCommittees} from "queries/committees";
import {useBoards} from "queries/boards";
import {useMembers} from "queries/members";
import {useStatisticsQuery} from "queries/statistics";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const useMenuItems = () => {
  const {committeesQuery} = useCommittees();
  const {boardsQuery} = useBoards();
  const {membersQuery} = useMembers();
  const statisticsQuery = useStatisticsQuery();

  return [
    {
      icon: "chess-queen" as IconProp,
      url: "/prominent",
      loading: boardsQuery.isLoading,
      label: "Prominent",
    },
    {
      icon: "home" as IconProp,
      url: "/",
      loading: membersQuery.isLoading,
      label: "Home",
    },
    {
      icon: "clock" as IconProp,
      url: "/recent",
      loading: false,
      label: "Recent",
    },
    {
      icon: "users" as IconProp,
      url: "/committees",
      loading: committeesQuery.isLoading,
      label: "Committees",
    },
    {
      icon: "chart-column" as IconProp,
      url: "/statistics",
      loading: statisticsQuery.isLoading,
      label: "Statistics",
    },
    {
      icon: "map-marker-alt" as IconProp,
      url: "/present",
      loading: false,
      label: "Present",
    },
  ];
};

const MenuItem = ({
  menuItem,
}: {
  menuItem: {
    icon: IconProp;
    url: string;
    loading: boolean;
    label: string;
  };
}) =>
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

const Sidebar = () => {
  const menuItems = useMenuItems();
  return (
    <nav className="sidebar">
      {menuItems.map((menuItem, idx) => (
        <MenuItem key={menuItem.label} menuItem={menuItem} />
      ))}
    </nav>
  );
};

export default Sidebar;
