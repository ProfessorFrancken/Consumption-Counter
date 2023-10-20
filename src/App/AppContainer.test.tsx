import AppContainerWithoutLocation from "./AppContainer";
import MockDate from "mockdate";
import {render, fireEvent, act, screen} from "test-utils";
import {TIME_TO_CANCEL} from "App/QueuedOrdersContext";
import {SCREEN_SAVER_TIMEOUT} from "./../components/redirect-when-idle";
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
    rest.get("*/statistics/categories", (req, res, ctx) => {
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

    // Run all timers twice, once to trigger the screensaver to go to home,
    // another time to trigger the second screensaver to go to statistics
    // this prevents a warning about state changes outside of act
    act(() => {
      jest.runAllTimers();
    });
    act(() => {
      jest.runAllTimers();
    });
  });

  const selectRangeIncludingJohnSnow = () => {
    fireEvent.click(screen.getByText("Snow-Snow"));

    expect(screen.getByLabelText("location")).toHaveTextContent("/members/0");
    expect(screen.getByText("John Snow")).toBeInTheDocument();
  };

  const selectJohnSnow = () => {
    fireEvent.click(screen.getByText("John Snow"));
  };

  const addHertogJanToOrder = () => {
    expect(screen.getByLabelText("location")).toHaveTextContent("/products");

    const product = screen.getByLabelText(/Buy Hertog Jan/);
    expect(product).toBeInTheDocument();

    fireEvent.mouseDown(product);
    fireEvent.mouseUp(product);
  };

  const expectOrderToBeBought = async () => {
    expect(await screen.findByText(/Cancel buying .*/)).toBeInTheDocument();
    expect(screen.getByLabelText("location")).toHaveTextContent("/");

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Recent"));
    expect(await screen.findByLabelText("John Snow")).toBeInTheDocument();
  };

  const selectBuyMore = () => {
    expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    expect(screen.getByText("Hertog Jan")).toBeInTheDocument();
    const product = screen.getByText("Hertog Jan");

    fireEvent.mouseDown(product);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    fireEvent.mouseUp(product);
  };

  const expectBuyMoreToBeSelected = () => {
    expect(screen.getByRole("button", {name: /Buy it all!.*/i})).toBeInTheDocument();
  };

  const buyAll = async () => {
    const buyAll = screen.getByRole("button", {name: /Buy it all!.*/i});
    fireEvent.click(buyAll);

    await expectOrderToBeBought();
  };

  const selectProminent = () => {
    fireEvent.click(screen.getByLabelText("Prominent"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/prominent");
  };

  const cancelOrder = async () => {
    const btn = await screen.findByRole("button", {name: /Cancel buying.*/i});
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(btn).not.toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    fireEvent.click(screen.getByLabelText("Recent"));
    expect(screen.queryByLabelText("John Snow")).not.toBeInTheDocument();
  };

  const selectCommittees = () => {
    fireEvent.click(screen.getByLabelText("Committees"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/committees");
  };

  const selectCompucie = () => {
    fireEvent.click(screen.getByRole("button", {name: "Compucie"}));
    expect(screen.getByLabelText("location")).toHaveTextContent("/committees/0");
  };

  const selectRecent = () => {
    fireEvent.click(screen.getByLabelText("Recent"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/recent");
  };

  const selectStatistics = () => {
    fireEvent.click(screen.getByLabelText("Statistics"));
    expect(screen.getByLabelText("location")).toHaveTextContent("/statistics");
  };

  it("allows a member to buy a product", async () => {
    render(<AppContainer />);

    selectRangeIncludingJohnSnow();
    selectJohnSnow();

    await waitFor(() => {
      expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    });

    addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  it("allows buying multiple products", async () => {
    render(<AppContainer />);

    selectRangeIncludingJohnSnow();
    selectJohnSnow();

    // Now enable buying more products
    selectBuyMore();
    expectBuyMoreToBeSelected();

    // Let's buy some pils
    addHertogJanToOrder();
    addHertogJanToOrder();

    await buyAll();
  });

  it("is possible to cancel an order", async () => {
    render(<AppContainer />);

    selectRangeIncludingJohnSnow();
    selectJohnSnow();

    addHertogJanToOrder();

    await cancelOrder();
  });

  it("is possible to buy products using the prominent list", async () => {
    render(<AppContainer />);
    selectProminent();
    selectJohnSnow();

    addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  it("is possible to buy products using the committees list", async () => {
    MockDate.set(new Date(1514764800001));

    render(<AppContainer />);
    selectCommittees();
    selectCompucie();
    selectJohnSnow();

    addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  it("is possible to buy products using the recent list", async () => {
    render(<AppContainer />);

    // TODO: Here we are duplicating buying an order, it might be better
    // to mock the state?
    selectRangeIncludingJohnSnow();
    selectJohnSnow();
    addHertogJanToOrder();
    await expectOrderToBeBought();

    selectRecent();
    selectJohnSnow();

    addHertogJanToOrder();
    await expectOrderToBeBought();

    expect(await screen.findByRole("button", {name: "Go back"})).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Statistics"));

    const recentTransactions = screen.getByRole("list", {name: "Recent transactions"});
    await waitFor(() => {
      expect(within(recentTransactions).getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("shows a splashscreen when buying specific products", async () => {
    render(<AppContainer />);
    selectRangeIncludingJohnSnow();
    selectJohnSnow();

    addHertogJanToOrder();

    const background = "Uo6qQC4Hm8TUqyNjw2G4.jpg";
    const splashStyle = {backgroundImage: `url("${background}")`};
    const layout = screen.getByTestId("layout");

    await waitFor(() => {
      expect(layout).toHaveStyle(splashStyle);
    });

    await expectOrderToBeBought();
    expect(layout).not.toHaveStyle(splashStyle);
  });

  // This test checks if we don't have any async issues
  it("is possible to buy a product after someone else has bought a product", async () => {
    render(<AppContainer />);

    selectRangeIncludingJohnSnow();
    selectJohnSnow();

    await waitFor(() => {
      expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    });
    addHertogJanToOrder();

    // Buy another product by clicking the go back button
    await waitFor(() => {
      expect(screen.getByLabelText("location")).not.toHaveTextContent("/products");
    });

    selectJohnSnow();

    expect(await screen.findByText(/Cancel buying .*/)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    await waitFor(() => {
      expect(screen.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText("location")).toHaveTextContent("/products");
    addHertogJanToOrder();
    await waitFor(() => {
      expect(screen.getByLabelText("location")).not.toHaveTextContent("/products");
    });

    selectStatistics();

    expect(await screen.findAllByText("bought by John Snow")).toHaveLength(1);
    await waitFor(async () => {
      expect(await screen.findByText(/Cancel buying .*/)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    await waitFor(async () => {
      expect(screen.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText(/bought by.*/)).toHaveLength(2);
    });
  });
  // Redirects
  // Shows a list of transactions

  // Shows error messages when things go wrong

  // Keeps track of all transactions that went wrong

  // Retries transactions

  it("does allows cancelling an order after an other order's timeout was handled", async () => {
    render(<AppContainer />);

    selectRangeIncludingJohnSnow();
    selectJohnSnow();
    addHertogJanToOrder();

    // Run time forward a little so that the timeout of the first orders
    // does not occur on the same time as the second
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL / 2);
    });

    MockDate.set(new Date(1514764800000 + 4000));
    selectJohnSnow();
    addHertogJanToOrder();

    // Run the first timeout
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL / 2);
    });
    const cancelBtn = await screen.findByText(/Cancel buying .*/);
    fireEvent.click(cancelBtn);
    expect(cancelBtn).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    selectStatistics();
    expect(await screen.findAllByText(/bought by.*/)).toHaveLength(1);
  });

  describe("when the system is idle for a specific time", () => {
    it("goes back to the main screen after 30 seconds", () => {
      render(<AppContainer />);
      selectRangeIncludingJohnSnow();
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT);
      });
      expect(screen.getByLabelText("location")).toHaveTextContent("/");
    });

    it("should reset the screensaver timer when going to a different route", () => {
      render(<AppContainer />);
      selectRangeIncludingJohnSnow();
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      selectRecent();
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
    render(<AppContainer />);

    const header = screen.getByRole("heading", {level: 2});
    expect(header).toHaveTextContent("T.F.V. 'Professor Francken'");
    fireEvent.click(header);

    expect(screen.getByLabelText("location")).toHaveTextContent("/compucie");

    selectJohnSnow();

    addHertogJanToOrder();
    await expectOrderToBeBought();
  });
});
