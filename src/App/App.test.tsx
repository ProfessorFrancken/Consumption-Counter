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
    expect(screen.getByRole("heading")).toBeInTheDocument();

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

/* xit('should show a loading message when refreshing the database')*/

export function mockedState() {
  return {
    members: [
      {
        id: 999,
        firstName: "John",
        surname: "Snow",
        age: 18,
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
              age: 18,
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
          surname_start: "Snow",
          surname_end: "Snow",
        },
      ],
    },
    products: {
      Bier: [
        {
          id: 3,
          name: "Hertog Jan",
          price: 68,
          position: 1,
          category: "Bier",
          image: "wCwnyLXTVdPEnKRXjw9I.png",
          age_restriction: 18,
        },
      ],
      Fris: [
        {
          id: 27,
          name: "Ice Tea",
          price: 60,
          position: 999,
          category: "Fris",
          image: "",
          age_restriction: 18,
        },
      ],
      Eten: [
        {
          id: 243,
          name: "Kinder Bueno",
          price: 55,
          position: 999,
          category: "Eten",
          image: "utnCWM87tZclyENVrG03.jpg",
          age_restriction: 18,
        },
      ],
    },
    router: {
      locationBeforeTransitions: null,
    },
    order: {
      member: {
        id: 1,
        fullname: "John Snow",
        age: 19,
      },
      products: [],
    },
    transactions: [],
    recentBuyers: [],
    boardMembers: [],
    committeeMembers: [
      {
        member_id: 314,
        year: 2018,
        function: "King",
        committee: {
          id: 0,
          name: "Compucie",
        },
      },
    ],
    queuedOrder: null,
    menuItems: menuItems(undefined, {}),
    authentication: {
      request: false,
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4",
    },
  };
}
