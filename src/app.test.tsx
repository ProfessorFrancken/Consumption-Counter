import Products from "./routes/products/index";
import Prominent from "./routes/prominent/index";
import RecentMembers from "./routes/recent/index";
import {render, screen, within} from "./test-utils";
import clock from "jest-plugin-clock";
import {mockedState} from "./test-utils/mocked-state";
import {createAppRoutes} from "./app-container";
import {useQueryClient} from "@tanstack/react-query";
import {ApplicationProviders} from "./application-providers";
import {createMemoryRouter, RouterProvider} from "react-router";

const NewAppContainer = ({routes}: {routes: string[]}) => {
  const queryClient = useQueryClient();
  const appRoutes = createAppRoutes(queryClient, ApplicationProviders);
  const router = createMemoryRouter(appRoutes, {initialEntries: routes});
  return <RouterProvider router={router} />;
};

async function setup(routes = ["/"]) {
  localStorage.setItem(
    "plus_one_authorization",
    JSON.stringify({
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4",
    })
  );

  const storeState = mockedState();
  render(<NewAppContainer routes={routes} />, {
    storeState,
    routes,
    dontRenderRouterProvider: true,
  });

  await screen.findByRole("img", {name: "Logo of T.F.V. 'Professor Francken'"});
}

describe("rendering", () => {
  it("renders without crashing", async () => {
    await setup();

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Check the header banner
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", {level: 1})).toBeInTheDocument();

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("shows a selection of surname ranges by default", async () => {
    await setup();
    const main = within(screen.getByRole("main"));

    expect(main.getByRole("button")).toHaveTextContent("Snow-Snow");
  });

  describe("rendering routes depending on state", () => {
    clock.set("2018-01-01");

    const routes = [
      {path: "/prominent", component: Prominent, title: "Prominent"},
      {path: "/statistics", component: "Statistics", title: "Statistics"},
      {path: "/committees", component: "Committees", title: "Committees"},
      {path: "/committees/0", component: "Members", title: "Compucie"},
      {path: "/products/pricelist", component: "PriceList", title: "Pricelist"},
      {path: "/recent", component: RecentMembers, title: "Recent"},
      {path: "/products?memberId=1", component: Products, title: "John Snow"},
      {path: "/members/0", component: "Members", title: ""},
    ];

    beforeEach(() => {
      Object.defineProperty(global, "ResizeObserver", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          observe: jest.fn(() => "Mocking works"),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        })),
      });
    });

    routes.forEach((route) => {
      it(`renders ${route.path}`, async () => {
        await setup([route.path]);

        const title = screen.getByRole("heading", {level: 1});
        expect(title).toHaveTextContent(route.title);
      });
    });
  });
});
