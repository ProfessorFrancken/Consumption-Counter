import React from "react";
import AppContainerWithoutLocation from "./AppContainer";
import MockDate from "mockdate";
import {render, fireEvent, act, screen} from "test-utils";
import {TIME_TO_CANCEL} from "App/QueuedOrdersContext";
import {SCREEN_SAVER_TIMEOUT} from "./ScreenSaver";
import {waitFor, within} from "@testing-library/react";
import {useLocation} from "react-router";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {mocks} from "./MockedState";

// Ugly hack that allows us to read the browser's current location
const AppContainer = () => {
  const location = useLocation();
  return (
    <>
      <span aria-label="location">{location.pathname}</span>
      <AppContainerWithoutLocation />
    </>
  );
};

afterEach(() => {
  localStorage.removeItem("plus_one_order_queue");
});

describe("Consumption Counter", () => {
  const server = setupServer(
    rest.get("*/members", (req, res, ctx) => {
      return res(ctx.json({members: mocks.members}));
    }),
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.json({products: mocks.members}));
    }),
    rest.get("*/boards", (req, res, ctx) => {
      return res(ctx.json({boardMembers: mocks.boards}));
    }),
    rest.get("*/committees", (req, res, ctx) => {
      return res(ctx.json({committees: mocks.committees}));
    }),
    rest.get("*/statistics", (req, res, ctx) => {
      return res(ctx.json({statistics: []}));
    }),
    rest.get("*/activities", (req, res, ctx) => {
      return res(ctx.json({activities: []}));
    }),
    rest.post("*/orders", (req, res, ctx) => {
      return res(ctx.status(200));
    }),
    rest.get("*/orders", (req, res, ctx) => {
      return res(ctx.json({products: []}));
    }),
    rest.get("*/sponsors", (req, res, ctx) => {
      return res(ctx.json({sponsors: []}));
    }),
    rest.get("https://borrelcie.vodka/chwazorcle/hoeveel.php", (req, res, ctx) => {
      return res(ctx.text("10"));
    }),
    rest.post("https://borrelcie.vodka/chwazorcle/hoeveel.php", (req, res, ctx) => {
      return res(ctx.json({}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    MockDate.set(new Date(1514764800000));

    jest.useFakeTimers();
    window.confirm = (text: string | undefined) => {
      return true;
    };
  });

  afterEach(() => {
    MockDate.reset();
    jest.runAllTimers();
  });

  const selectRangeIncludingJohnSnow = (app: any) => {
    fireEvent.click(app.getByText("Snow-Snow"));

    expect(screen.getByLabelText("location")).toHaveTextContent("/members/0");
    expect(app.getByText("John Snow")).toBeInTheDocument();
  };

  const selectJohnSnow = (app: any) => {
    fireEvent.click(app.getByText("John Snow"));
  };

  const addHertogJanToOrder = (app: any) => {
    expect(screen.getByLabelText("location")).toHaveTextContent("/products");

    const product = app.getByLabelText(/Buy Hertog Jan/);
    expect(product).toBeInTheDocument();

    fireEvent.mouseDown(product);
    fireEvent.mouseUp(product);
  };

  const expectOrderToBeBought = async (app: any) => {
    expect(await app.findByText(/Cancel buying .*/)).toBeInTheDocument();
    expect(screen.getByLabelText("location")).toHaveTextContent("/");

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(app.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    fireEvent.click(app.getByLabelText("Recent"));
    expect(await app.findByLabelText("John Snow")).toBeInTheDocument();
  };

  const selectBuyMore = (app: any) => {
    expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    expect(app.getByText("Hertog Jan")).toBeInTheDocument();
    const product = app.getByText("Hertog Jan");

    fireEvent.mouseDown(product);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
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
    expect(screen.getByLabelText("location")).toHaveTextContent("/prominent");
  };

  const cancelOrder = async (app: any) => {
    const btn = await app.findByRole("button", {name: /Cancel buying.*/i});
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(btn).not.toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(app.getByLabelText("Recent"));
    expect(app.queryByLabelText("John Snow")).not.toBeInTheDocument();
  };

  const selectCommittees = (app: any) => {
    fireEvent.click(app.getByLabelText("Committees"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/committees");
  };

  const selectCompucie = (app: any) => {
    fireEvent.click(app.getByRole("button", {name: "Compucie"}));
    expect(screen.getByLabelText("location")).toHaveTextContent("/committees/0");
  };

  const selectRecent = (app: any) => {
    fireEvent.click(app.getByLabelText("Recent"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/recent");
  };

  const selectStatistics = (app: any) => {
    fireEvent.click(app.getByLabelText("Statistics"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/statistics");
  };

  it("allows a member to buy a product", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    await waitFor(() => {
      expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    });

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

    await cancelOrder(app);
  });

  it("is possible to buy products using the prominent list", async () => {
    const app = render(<AppContainer />);
    selectProminent(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });

  it("is possible to buy products using the committees list", async () => {
    MockDate.set(new Date(1514764800001));

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

    expect(await screen.findByRole("button", {name: "Go back"})).toBeInTheDocument();
    fireEvent.click(app.getByLabelText("Statistics"));

    const recentTransactions = screen.getByRole("list", {name: "Recent transactions"});
    await waitFor(() => {
      expect(within(recentTransactions).getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("shows a splashscreen when buying specific products", async () => {
    const app = render(<AppContainer />);
    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);

    const background = "Uo6qQC4Hm8TUqyNjw2G4.jpg";
    const splashStyle = {backgroundImage: `url("${background}")`};
    const layout = app.getByTestId("layout");

    await waitFor(() => {
      expect(layout).toHaveStyle(splashStyle);
    });

    await expectOrderToBeBought(app);
    expect(layout).not.toHaveStyle(splashStyle);
  });

  // This test checks if we don't have any async issues
  it("is possible to buy a product after someone else has bought a product", async () => {
    const app = render(<AppContainer />);

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    await waitFor(() => {
      expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    });
    addHertogJanToOrder(app);

    // Buy another product by clicking the go back button
    await waitFor(() => {
      expect(screen.getByLabelText("location")).not.toHaveTextContent("/products");
    });

    selectJohnSnow(app);

    expect(await app.findByText(/Cancel buying .*/)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    await waitFor(() => {
      expect(app.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    addHertogJanToOrder(app);
    await waitFor(() => {
      expect(screen.getByLabelText("location")).not.toHaveTextContent("/products");
    });

    selectStatistics(app);

    expect(await app.findAllByText("bought by John Snow")).toHaveLength(1);
    await waitFor(async () => {
      expect(await app.findByText(/Cancel buying .*/)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    await waitFor(async () => {
      expect(app.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(app.getAllByText(/bought by.*/)).toHaveLength(2);
    });
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
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL / 2);
    });

    MockDate.set(new Date(1514764800000 + 4000));
    selectJohnSnow(app);
    addHertogJanToOrder(app);

    // Run the first timeout
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL / 2);
    });
    const cancelBtn = await app.findByText(/Cancel buying .*/);
    fireEvent.click(cancelBtn);
    expect(cancelBtn).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    selectStatistics(app);
    expect(await app.findAllByText(/bought by.*/)).toHaveLength(1);
  });

  describe("when the system is idle for a specific time", () => {
    it("goes back to the main screen after 30 seconds", () => {
      const app = render(<AppContainer />);
      selectRangeIncludingJohnSnow(app);
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT);
      });
      expect(screen.getByLabelText("location")).toHaveTextContent("/");
    });

    it("should reset the screensaver timer when going to a different route", () => {
      const app = render(<AppContainer />);
      selectRangeIncludingJohnSnow(app);
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      selectRecent(app);
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      expect(screen.getByLabelText("location")).toHaveTextContent("/recent");
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      expect(screen.getByLabelText("location")).toHaveTextContent("/");
    });
  });

  it("is possible select members through the compucie screen", async () => {
    const app = render(<AppContainer />);

    const header = app.getByRole("heading", {level: 2});
    expect(header).toHaveTextContent("T.F.V. 'Professor Francken'");
    fireEvent.click(header);

    expect(screen.getByLabelText("location")).toHaveTextContent("/compucie");

    selectJohnSnow(app);

    addHertogJanToOrder(app);
    await expectOrderToBeBought(app);
  });
});
