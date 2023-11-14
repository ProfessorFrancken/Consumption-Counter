import {createAppRoutes} from "./app-container";
import MockDate from "mockdate";
import {render, fireEvent, act, screen} from "./test-utils";
import {TIME_TO_CANCEL} from "./components/orders/queued-orders-context";
import {SCREEN_SAVER_TIMEOUT} from "./components/redirect-when-idle";
import {waitFor, within} from "@testing-library/react";
import {createMemoryRouter, RouterProvider} from "react-router";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {mocks} from "./test-utils/mocked-state";
import {useQueryClient} from "@tanstack/react-query";
import {ApplicationProviders} from "./application-providers";

const NewAppContainer = ({navigate}: {navigate: (to: string) => void}) => {
  const queryClient = useQueryClient();
  const appRoutes = createAppRoutes(queryClient, ApplicationProviders);
  const router = createMemoryRouter(appRoutes);
  router.subscribe((x) => {
    navigate(x.location.pathname);
  });
  return <RouterProvider router={router} />;
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

  const navigate = jest.fn();
  beforeEach(() => {
    navigate.mockReset();

    localStorage.setItem(
      "plus_one_authorization",
      JSON.stringify({
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4",
      })
    );

    MockDate.set(new Date(1514764800000));

    jest.useFakeTimers();
    window.confirm = (text: string | undefined) => {
      return true;
    };

    Object.defineProperty(global, "ResizeObserver", {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(() => "Mocking works"),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      })),
    });
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

  const selectRangeIncludingJohnSnow = async () => {
    fireEvent.click(screen.getByText("Snow-Snow"));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/members/0");
    });

    expect(screen.getByText("John Snow")).toBeInTheDocument();
  };

  const selectJohnSnow = () => {
    fireEvent.click(screen.getByText("John Snow"));
  };

  const addHertogJanToOrder = async () => {
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/products");
    });

    const product = await screen.findByLabelText(/Buy Hertog Jan/);
    expect(product).toBeInTheDocument();

    fireEvent.mouseDown(product);
    fireEvent.mouseUp(product);
  };

  const expectOrderToBeBought = async () => {
    expect(await screen.findByText(/Cancel buying .*/)).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith("/");

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Recent"));
    expect(await screen.findByLabelText("John Snow")).toBeInTheDocument();
  };

  const selectBuyMore = async () => {
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/products");
    });

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
    expect(navigate).toHaveBeenCalledWith("/prominent");
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
    expect(navigate).toHaveBeenCalledWith("/committees");
  };

  const selectCompucie = () => {
    fireEvent.click(screen.getByRole("button", {name: "Compucie"}));
    expect(navigate).toHaveBeenCalledWith("/committees/0");
  };

  const selectRecent = () => {
    fireEvent.click(screen.getByLabelText("Recent"));
    expect(navigate).toHaveBeenCalledWith("/recent");
  };

  const selectStatistics = async () => {
    fireEvent.click(screen.getByLabelText("Statistics"));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/statistics");
    });
  };

  it("allows a member to buy a product", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    selectRangeIncludingJohnSnow();
    selectJohnSnow();

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/products");
    });

    await addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  it("allows buying multiple products", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    await selectRangeIncludingJohnSnow();
    selectJohnSnow();

    // Now enable buying more products
    await selectBuyMore();
    expectBuyMoreToBeSelected();

    // Let's buy some pils
    await addHertogJanToOrder();
    await addHertogJanToOrder();

    await buyAll();
  });

  it("is possible to cancel an order", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    await selectRangeIncludingJohnSnow();
    selectJohnSnow();

    await addHertogJanToOrder();

    await cancelOrder();
  });

  it("is possible to buy products using the prominent list", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    selectProminent();
    selectJohnSnow();

    await addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  it("is possible to buy products using the committees list", async () => {
    MockDate.set(new Date(1514764800001));

    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    selectCommittees();
    selectCompucie();
    selectJohnSnow();

    await addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  it("is possible to buy products using the recent list", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    // TODO: Here we are duplicating buying an order, it might be better
    // to mock the state?
    await selectRangeIncludingJohnSnow();
    selectJohnSnow();
    await addHertogJanToOrder();
    await expectOrderToBeBought();

    selectRecent();
    selectJohnSnow();

    await addHertogJanToOrder();
    await expectOrderToBeBought();

    expect(await screen.findByRole("button", {name: "Go back"})).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Statistics"));

    const recentTransactions = screen.getByRole("list", {name: "Recent transactions"});
    await waitFor(() => {
      expect(within(recentTransactions).getAllByRole("listitem")).toHaveLength(2);
    });
  });

  it("shows a splashscreen when buying specific products", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    await selectRangeIncludingJohnSnow();
    selectJohnSnow();

    await addHertogJanToOrder();

    const background = "Uo6qQC4Hm8TUqyNjw2G4.jpg";
    const splashStyle = {backgroundImage: `url("${background}")`};
    const layout = screen.getByTestId("layout");

    await waitFor(() => {
      expect(layout).toHaveStyle(splashStyle);
    });

    await expectOrderToBeBought();
    expect(layout).not.toHaveStyle(splashStyle);
  });

  // Redirects
  // Shows a list of transactions

  // Shows error messages when things go wrong

  // Keeps track of all transactions that went wrong

  // Retries transactions

  it("does allows cancelling an order after an other order's timeout was handled", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    await selectRangeIncludingJohnSnow();
    selectJohnSnow();
    await addHertogJanToOrder();

    // Run time forward a little so that the timeout of the first orders
    // does not occur on the same time as the second
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL / 2);
    });

    MockDate.set(new Date(1514764800000 + 4000));
    selectJohnSnow();
    await addHertogJanToOrder();

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
    await selectStatistics();
    expect(await screen.findAllByText(/bought by.*/)).toHaveLength(1);
  });

  describe("when the system is idle for a specific time", () => {
    it("goes back to the main screen after 30 seconds", async () => {
      render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

      await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

      await selectRangeIncludingJohnSnow();
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT);
      });
      expect(navigate).toHaveBeenCalledWith("/");
    });

    it("should reset the screensaver timer when going to a different route", async () => {
      render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

      await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

      await selectRangeIncludingJohnSnow();
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      selectRecent();
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      expect(navigate).toHaveBeenCalledWith("/recent");
      act(() => {
        jest.advanceTimersByTime(SCREEN_SAVER_TIMEOUT / 2);
      });
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });

  it("is possible select members through the compucie screen", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    const header = screen.getByRole("heading", {level: 2});
    expect(header).toHaveTextContent("T.F.V. 'Professor Francken'");
    fireEvent.click(header);

    expect(navigate).toHaveBeenCalledWith("/compucie");

    selectJohnSnow();

    await addHertogJanToOrder();
    await expectOrderToBeBought();
  });

  // This test checks if we don't have any async issues
  it("is possible to buy a product after someone else has bought a product", async () => {
    render(<NewAppContainer navigate={navigate} />, {dontRenderRouterProvider: true});

    await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});

    await selectRangeIncludingJohnSnow();
    selectJohnSnow();

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/products");
    });
    await addHertogJanToOrder();

    // Buy another product by clicking the go back button
    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(6, "/");
    });

    selectJohnSnow();

    expect(await screen.findByText(/Cancel buying .*/)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(TIME_TO_CANCEL);
    });
    await waitFor(() => {
      expect(screen.queryByText(/Cancel buying .*/)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      //console.log(navigate.call, navigate.caller);
      expect(navigate).toHaveBeenNthCalledWith(5, "/products");
    });
    await addHertogJanToOrder();

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(10, "/");
    });

    await selectStatistics();

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
});
