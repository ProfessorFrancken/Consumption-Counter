import AvailableProducts from "./Products/";
import Prominent from "./Prominent";
import RecentMembers from "./Recent";
import {render, screen, within} from "test-utils";
import clock from "jest-plugin-clock";
import {mockedState} from "./MockedState";
import AppContainer from "./AppContainer";

function setup(routes = ["/"]) {
  const storeState = mockedState();
  return render(<AppContainer />, {storeState, routes});
}

describe("rendering", () => {
  it("renders without crashing", () => {
    setup();

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Check the header banner
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", {level: 1})).toBeInTheDocument();

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("shows a selection of surname ranges by default", () => {
    setup();
    const main = within(screen.getByRole("main"));

    expect(main.getByRole("button")).toHaveTextContent("Snow-Snow");
  });

  describe("rendering screens depending on state", () => {
    clock.set("2018-01-01");

    const screens = [
      {path: "/prominent", component: Prominent, title: "Prominent"},
      {path: "/statistics", component: "Statistics", title: "Statistics"},
      {path: "/committees", component: "Committees", title: "Committees"},
      {path: "/committees/0", component: "Members", title: "Compucie"},
      {path: "/products/pricelist", component: "PriceList", title: "Pricelist"},
      {path: "/recent", component: RecentMembers, title: "Recent"},
      {path: "/products?memberId=1", component: AvailableProducts, title: "John Snow"},
      {path: "/members/0", component: "Members", title: ""},
    ];

    screens.forEach((screen) => {
      it(`renders ${screen.path}`, () => {
        const app = setup([screen.path]);

        const title = app.getByRole("heading", {level: 1});
        expect(title).toHaveTextContent(screen.title);
      });
    });
  });
});
