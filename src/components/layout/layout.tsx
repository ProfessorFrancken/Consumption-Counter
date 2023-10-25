import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";
import logo from "assets/logo.png";
import {useBackgroundFromOrder} from "../orders/queued-orders-context";
import {useNavigate} from "react-router";
import {ReactNode} from "react";

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

export const Layout = ({children}: {children: ReactNode}) => {
  const background = useBackgroundFromOrder();
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
      <Header onClick={goToCompucieScreen} />
      <Sidebar />
      <main className="content">{children}</main>
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
