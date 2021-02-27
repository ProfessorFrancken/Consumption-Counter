import React from "react";
import App from "./App";
import AvailableProducts from "./Products/";
import Prominent from "./Prominent";
import RecentMembers from "./Recent";
import {render, screen, within} from "test-utils";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";
import {mockedState} from "./MockedState";

function setup(routes = ["/"]) {
  const props = {menuItems: []};
  const storeState = mockedState();
  const app = render(<App {...props} />, {storeState, routes});

  return {props, app};
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
      {path: "/pricelist", component: "PriceList", title: "Pricelist"},
      {path: "/recent", component: RecentMembers, title: "Recent"},
      {path: "/products", component: AvailableProducts, title: "John Snow"},
      {path: "/members/0", component: "Members", title: ""},
    ];

    screens.forEach((screen) => {
      it(`renders ${screen.path}`, () => {
        const {app} = setup([screen.path]);

        const title = app.getByRole("heading", {level: 1});
        expect(title).toHaveTextContent(screen.title);
      });
    });
  });
});
