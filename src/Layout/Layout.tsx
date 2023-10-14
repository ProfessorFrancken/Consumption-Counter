import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import logo from "assets/logo.png";
import {useCommittees} from "App/Committees/CommitteesContext";
import {useBoards} from "App/Prominent/BoardsContext";
import {useMembers} from "App/Members/Context";
import {useStatisticsQuery} from "App/Statistics/StatisticsContext";
import {useBackgroundFromOrder, useFailedOrders} from "App/QueuedOrdersContext";
import {useNavigate} from "react-router";

const backgroundFromProduct = (background: string | null) => {
  return background === null
    ? {}
    : {
        backgroundImage: `url("${background}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "50%",
      };
};

const Content = (props: any) => <main className="content">{props.children}</main>;

const useMenuItems = () => {
  const {committeesQuery} = useCommittees();
  const {boardsQuery} = useBoards();
  const {membersQuery} = useMembers();
  const statisticsQuery = useStatisticsQuery();

  return [
    {
      icon: "chess-queen",
      url: "/prominent",
      loading: boardsQuery.isLoading,
      label: "Prominent",
    },
    {
      icon: "home",
      url: "/",
      loading: membersQuery.isLoading,
      label: "Home",
    },
    {
      icon: "clock",
      url: "/recent",
      loading: false,
      label: "Recent",
    },
    {
      icon: "users",
      url: "/committees",
      loading: committeesQuery.isLoading,
      label: "Committees",
    },
    {
      icon: "chart-column",
      url: "/statistics",
      loading: statisticsQuery.isLoading,
      label: "Statistics",
    },
    {
      icon: "map-marker-alt",
      url: "/present",
      loading: false,
      label: "Present",
    },
  ];
};

export const Layout = ({children}: any) => {
  const menuItems = useMenuItems();
  const background = useBackgroundFromOrder();
  const failedOrders = useFailedOrders();
  const navigate = useNavigate();

  const goToCompucieScreen = () => navigate("/compucie");
  const goToProminent = () => navigate("/prominent");

  // Screensaver
  const goHome = () => navigate("/");

  return (
    <div
      className="wrapper"
      style={backgroundFromProduct(background)}
      data-testid="layout"
    >
      <Header onClick={goToCompucieScreen} failedOrders={failedOrders} />
      <Sidebar menuItems={menuItems} />
      <Content>{children}</Content>
      <Footer />
      <div className="arrow">
        <div className="arrowContent">
          <img
            src={logo}
            className="franckenLogo img-fluid"
            alt="Logo of T.F.V. 'Professor Francken'"
            onClick={goHome}
            onDoubleClick={goToProminent}
          />
        </div>
      </div>
    </div>
  );
};
