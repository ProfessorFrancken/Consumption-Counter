import LoadingScreen from "./index";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";
import {useBoardMembersQuery} from "App/Prominent/BoardsContext";
import {render, screen} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MemoryRouter} from "react-router";
import {ReactNode} from "react";

describe("Loading screen", () => {
  const members = [
    {
      id: 314,
      voornaam: "John",
      initialen: "",
      tussenvoegsel: "",
      achternaam: "Snow",
      geboortedatum: "2000-01-01",
      prominent: null,
      kleur: null,
      afbeelding: null,
      bijnaam: null,
      button_width: null,
      button_height: null,
      latest_purchase_at: "2018-01-01 00:00:00",
    },
  ];

  const server = setupServer(
    rest.get("*/members", (req, res, ctx) => {
      return res(ctx.json({members}));
    }),
    rest.get("*/boards", (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({error: "moi"}));
    }),
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.json({products: []}));
    }),
    rest.get("*/statistics", (req, res, ctx) => {
      return res(ctx.json({statistics: []}));
    }),
    rest.get("*/statistics/categories", (req, res, ctx) => {
      return res(ctx.json({statistics: []}));
    }),
    rest.get("*/activities", (req, res, ctx) => {
      return res(ctx.json({activities: []}));
    }),
    rest.get("*/orders", (req, res, ctx) => {
      return res(ctx.json({products: []}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("renders", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {queries: {retry: false}},
    });

    queryClient.setQueryData(
      ["committees"],
      [
        {
          member_id: 1,
          year: 2017,
          function: "King",
          committee: {id: 1, name: "Compucie"},
        },
        {
          member_id: 2,
          year: 2017,
          function: "",
          committee: {id: 2, name: "s[ck]rip(t|t?c)ie"},
        },
      ]
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoadingScreen />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(
      screen.getByRole("heading", {name: "Loading consumption counter..."})
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Loading Members")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading Boards")).toBeInTheDocument();
    expect(screen.getByLabelText("Succesfully loaded Committees")).toBeInTheDocument();
    expect(await screen.findByLabelText("Failed loading Boards")).toBeInTheDocument();
  });
});
