import React from "react";
import {render, fireEvent, screen} from "test-utils";
import CompucieScreen from "./index";
import {Route, Routes} from "react-router";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";

describe("Compucie screen", () => {
  const server = setupServer(
    rest.get("*/members", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.get("*/boards", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.get("*/committees", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.get("*/statistics", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.get("*/statistics/categories", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.get("*/activities", (req, res, ctx) => {
      return res(ctx.status(400));
    }),
    rest.post("*/orders", (req, res, ctx) => {
      return res(ctx.status(400));
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

  it("renders", () => {
    const storeState = {
      members: [
        {id: 1, fullname: "John Snow", cosmetics: {}},
        {id: 2, fullname: "Arya Stark", cosmetics: {}},
      ],
      committeeMembers: [
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
      ],
    };
    render(<CompucieScreen />, {storeState});

    expect(screen.getByRole("button", {name: /John Snow/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Arya Stark/})).toBeInTheDocument();
  });

  it("Decreases the temple count", async () => {
    render(<CompucieScreen />);

    expect(
      await screen.findByRole("button", {name: /Decrease Temple Count \(10\)/i})
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: /Decrease Temple Count \(10\)/}));

    expect(
      await screen.findByRole("button", {name: /Decrease Temple Count \(9\)/})
    ).toBeInTheDocument();
  });

  it("Reloads the application", async () => {
    render(
      <Routes>
        <Route path="/compucie" element={<CompucieScreen />} />
        <Route path="*" element={<span role="progressbar">loading</span>} />
      </Routes>,
      {routes: ["/compucie"]}
    );

    fireEvent.click(screen.getByRole("button", {name: /Refresh/}));

    expect(await screen.findByRole("progressbar")).toBeInTheDocument();
  });
});
