import React from "react";
import AppContainer from "./AppContainer";
import {history} from "./../Setup/store";
import MockDate from "mockdate";
import moxios from "moxios";
import {render, fireEvent} from "test-utils";
import {TIME_TO_CANCEL} from "./../actions";
import {SCREEN_SAVER_TIMEOUT} from "./ScreenSaver";

describe("Plus One", () => {
  beforeEach(() => {
    MockDate.set(new Date(1514764800000));

    jest.useFakeTimers();

    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`${base_api}/members`, {
      response: {members: mocks.members},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/products`, {
      response: {products: mocks.products},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/boards`, {
      response: {boardMembers: mocks.boards},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/committees`, {
      response: {committees: mocks.committees},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/statistics`, {
      response: {statistics: []},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/activities`, {
      response: {activities: []},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/orders`, {});
    moxios.stubRequest(`https://borrelcie.vodka/chwazorcle/hoeveel.php`, {
      response: {committees: mocks.committees},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest("http://buixieval.nl/api/backers", {
      response: [],
      headers: {"content-type": "application/json"},
    });
  });

  afterEach(() => {
    moxios.uninstall();
    MockDate.reset();
  });

  const selectRangeIncludingJohnSnow = (app: any) => {
    fireEvent.click(app.getByText("Snow-Snow"));

    expect(history.location.pathname).toBe("/members/0");
    expect(app.getByText("John Snow")).toBeInTheDocument();
  };

  const selectJohnSnow = (app: any) => {
    fireEvent.click(app.getByText("John Snow"));
  };

  const addHertogJanToOrder = (app: any) => {
    expect(history.location.pathname).toBe("/products");
    const product = app.getByLabelText("Buy Hertog Jan");

    expect(product).toBeInTheDocument();

    fireEvent.mouseDown(product);
    fireEvent.mouseUp(product);
  };

  const expectOrderToBeBought = async (app: any) => {
    expect(history.location.pathname).toBe("/");
    expect(app.getByText(/Cancel buying .*/)).toBeInTheDocument();

    jest.runTimersToTime(10000);
    expect(app.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();

    fireEvent.click(app.getByLabelText("Recent"));
    expect(await app.findByLabelText("John Snow")).toBeInTheDocument();
  };

  const selectBuyMore = (app: any) => {
    expect(history.location.pathname).toBe("/products");
    expect(app.getByText("Hertog Jan")).toBeInTheDocument();
    const product = app.getByText("Hertog Jan");

    fireEvent.mouseDown(product);
    jest.runTimersToTime(1000);
    fireEvent.mouseUp(product);
  };

  const expectBuyMoreToBeSelected = (app: any) => {
    expect(app.getByRole("button", {name: /Buy it all!.*/i})).toBeInTheDocument();
  };

  const buyAll = async (app: any) => {
    const buyAll = app.getByRole("button", {name: /Buy it all!.*/i});
    fireEvent.click(buyAll);

    await expectOrderToBeBought(app);
  };

  const selectProminent = (app: any) => {
    fireEvent.click(app.getByLabelText("Prominent"));
    expect(history.location.pathname).toBe("/prominent");
  };

  const cancelOrder = (app: any) => {
    const btn = app.getByRole("button", {name: /Cancel buying.*/i});
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(btn).not.toBeInTheDocument();

    jest.runAllTimers();

    fireEvent.click(app.getByLabelText("Recent"));
    expect(app.queryByLabelText("John Snow")).not.toBeInTheDocument();
  };

  const selectCommittees = (app: any) => {
    fireEvent.click(app.getByLabelText("Committees"));
    expect(history.location.pathname).toBe("/committees");
  };

  const selectCompucie = (app: any) => {
    fireEvent.click(app.getByRole("button", {name: "Compucie"}));
    expect(history.location.pathname).toBe("/committees/0");
  };

  const selectRecent = (app: any) => {
    fireEvent.click(app.getByLabelText("Recent"));
    expect(history.location.pathname).toBe("/recent");
  };

  const selectStatistics = (app: any) => {
    fireEvent.click(app.getByLabelText("Statistics"));
    expect(history.location.pathname).toBe("/statistics");
  };

  it("allows a member to buy a product", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);
    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });

  it("allows buying multiple products", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    // Now enable buying more products
    selectBuyMore(app);
    expectBuyMoreToBeSelected(app);

    // Let's buy some pils
    addHertogJanToOrder(app);
    addHertogJanToOrder(app);

    await buyAll(app);
  });

  it("is possible to cancel an order", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);

    cancelOrder(app);
  });

  it("is possible to buy products using the prominent list", async () => {
    const app = render(<AppContainer />);
    selectProminent(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });

  it("is possible to buy products using the committees list", async () => {
    const app = render(<AppContainer />);
    selectCommittees(app);
    selectCompucie(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });

  it("is possible to buy products using the recent list", async () => {
    const app = render(<AppContainer />);

    // TODO: Here we are duplicating buying an order, it might be better
    // to mock the state?
    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);
    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);

    selectRecent(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });

  it("shows a splashscreen when buying specific products", async () => {
    const app = render(<AppContainer />);
    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);

    const background = "Uo6qQC4Hm8TUqyNjw2G4.jpg";
    const splashStyle = {backgroundImage: `url("${background}")`};
    const layout = app.getByTestId("layout");

    expect(layout).toHaveStyle(splashStyle);
    await expectOrderToBeBought(app);
    expect(layout).not.toHaveStyle(splashStyle);
  });

  // This test checks if we don't have any async issues
  it("is possible to buy a product after someone else has bought a product", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);

    // Buy another product by clicking the go back button
    expect(history.location.pathname).toBe("/");
    selectJohnSnow(app);

    expect(app.getByText(/Cancel buying .*/)).toBeInTheDocument();
    jest.runTimersToTime(TIME_TO_CANCEL);
    expect(app.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();

    addHertogJanToOrder(app);
    selectStatistics(app);

    expect(await app.findAllByText("bought by John Snow")).toHaveLength(1);
    expect(app.queryByText(/Cancel buying .*/)).toBeInTheDocument();

    jest.runTimersToTime(TIME_TO_CANCEL);
    selectStatistics(app);
    expect(app.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();

    // BUG: we need this first line so that the app is rerendered?
    expect(await app.findAllByText(/bought by.*/)).toHaveLength(1);
    expect(app.getAllByText(/bought by.*/)).toHaveLength(2);
  });
  // Redirects
  // Shows a list of transactions

  // Shows error messages when things go wrong

  // Keeps track of all transactions that went wrong

  // Retries transactions

  it("does allows cancelling an order after an other order's timeout was handled", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);
    addHertogJanToOrder(app);

    // Run time forward a little so that the timeout of the first orders
    // does not occur on the same time as the second
    jest.runTimersToTime(TIME_TO_CANCEL / 2);

    MockDate.set(new Date(1514764800000 + 4000));
    selectJohnSnow(app);
    addHertogJanToOrder(app);

    // Run the first timeout
    jest.runTimersToTime(TIME_TO_CANCEL / 2);
    const cancelBtn = app.getByText(/Cancel buying .*/);
    fireEvent.click(cancelBtn);
    expect(cancelBtn).not.toBeInTheDocument();

    jest.runTimersToTime(TIME_TO_CANCEL);
    selectStatistics(app);
    expect(await app.findAllByText(/bought by.*/)).toHaveLength(1);
  });

  describe("when the system is idle for a specific time", () => {
    it("goes back to the main screen after 30 seconds", () => {
      const app = render(<AppContainer />);
      selectRangeIncludingJohnSnow(app);
      jest.runTimersToTime(SCREEN_SAVER_TIMEOUT);
      expect(history.location.pathname).toBe("/");
    });

    it("should reset the screensaver timer when going to a different route", () => {
      const app = render(<AppContainer />);
      selectRangeIncludingJohnSnow(app);
      jest.runTimersToTime(SCREEN_SAVER_TIMEOUT / 2);
      selectRecent(app);
      jest.runTimersToTime(SCREEN_SAVER_TIMEOUT / 2);
      expect(history.location.pathname).toBe("/recent");
      jest.runTimersToTime(SCREEN_SAVER_TIMEOUT / 2);
      expect(history.location.pathname).toBe("/");
    });
  });

  it("is possible select members through the compucie screen", async () => {
    const app = render(<AppContainer />);

    const header = app.getByRole("heading", {level: 2});
    expect(header).toHaveTextContent("T.F.V. 'Professor Francken'");
    fireEvent.click(header);

    expect(history.location.pathname).toBe("/compucie");

    selectJohnSnow(app);

    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });
});

const mocks = {
  members: [
    {
      id: 314,
      voornaam: "John",
      initialen: "",
      tussenvoegsel: "",
      achternaam: "Snow",
      geboortedatum: "1993-04-26",
      prominent: null,
      kleur: null,
      afbeelding: null,
      bijnaam: null,
      button_width: null,
      button_height: null,
      latest_purchase_at: "2018-01-01 00:00:00",
    },
  ],

  products: [
    {
      id: 1,
      naam: "Hertog Jan",
      prijs: "0.6500",
      categorie: "Bier",
      positie: 999,
      beschikbaar: 1,
      afbeelding: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      splash_afbeelding: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      kleur: null,
    },
    {
      id: 3,
      naam: "Grolsch",
      prijs: "0.6500",
      categorie: "Eten",
      positie: 999,
      beschikbaar: 1,
      afbeelding: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      splash_afbeelding: null,
      kleur: null,
    },
    {
      id: 2,
      naam: "Heineken",
      prijs: "0.6000",
      categorie: "Fris",
      positie: 999,
      beschikbaar: 0,
      afbeelding: "",
      splash_afbeelding: null,
      kleur: null,
    },
  ],

  orders: {
    single: {
      order: {
        member: {
          id: 314,
          firstName: "John",
          surname: "Snow",
          fullname: "John Snow",
        },
        products: [
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
        ],
        ordered_at: 1514764800000,
      },
    },
    multiple: {
      order: {
        member: {
          id: 314,
          firstName: "John",
          surname: "Snow",
        },
        products: [
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
          },
        ],
        ordered_at: 1514764800000,
      },
    },
  },

  committees: [
    {
      commissie_id: 14,
      lid_id: 314,
      jaar: 2018,
      functie: "King",
      naam: "Night's Watch",
    },
    {
      commissie_id: 0,
      lid_id: 314,
      jaar: 2018,
      functie: "King",
      naam: "Compucie",
    },
  ],
  boards: [{lid_id: 314, jaar: 2018, functie: "King"}],
};
