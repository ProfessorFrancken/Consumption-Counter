import React from "react";
import {menuItems} from "reducer";
import App from "./App";
import AvailableProducts from "./Products/";
import Prominent from "./Prominent";
import RecentMembers from "./Recent";
import {render, screen, within} from "test-utils";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

function setup(routes = ["/"]) {
  const props = {menuItems: menuItems(undefined, {})};
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

export function mockedState() {
  const menu = [
    {icon: "chess-queen", url: "/prominent", loading: false, label: "Prominent"},
    {icon: "home", url: "/", loading: false, label: "Home"},
    {icon: "clock", url: "/recent", label: "Recent"},
    {icon: "users", url: "/committees", loading: false, label: "Committees"},
    {icon: ["fab", "bitcoin"], url: "/buixieval", label: "Buixieval"},
    {icon: "chart-bar", url: "/statistics", label: "Statistics"},
  ];

  return {
    members: [
      {
        id: 1,
        firstName: "John",
        surname: "Snow",
        fullname: "John Snow",
        age: 18,
        latest_purchase_at: "2018-01-01 00:00:00",
        prominent: null,
        cosmetics: {
          color: null,
          image: null,
          nickname: null,
          button: {
            width: null,
            height: null,
          },
        },
      },
    ],
    surnameRanges: {
      members_per_range: 30,
      ranges: [
        {
          idx: 0,
          members: [
            {
              id: 1,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
              age: 18,
              prominent: null,
              latest_purchase_at: "2018-01-01 00:00:00",
              cosmetics: {
                color: null,
                image: null,
                nickname: null,
                button: {
                  width: null,
                  height: null,
                },
              },
            },
          ],
          surname_start: "Snow",
          surname_end: "Snow",
        },
      ],
    },
    router: {
      locationBeforeTransitions: null,
    },
    transactions: [],
    recentBuyers: [],
    boardMembers: [{member_id: 1, function: "King"}],
    committeeMembers: [
      {
        member_id: 1,
        year: 2018,
        function: "King",
        committee: {
          id: 0,
          name: "Compucie",
        },
      },
    ],
    queuedOrder: null,
    menuItems: menu,
  };
}
