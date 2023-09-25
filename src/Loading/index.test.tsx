import React from "react";
import {render} from "test-utils";
import LoadingScreen from "./index";
import {baseApi} from "api";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";

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
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("renders", async () => {
    const storeState = {
      members: null,
      boardMembers: null,
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
    const {getByRole, getByLabelText, findByLabelText} = render(<LoadingScreen />, {
      storeState,
    });

    expect(
      getByRole("heading", {name: "Loading consumption counter..."})
    ).toBeInTheDocument();

    expect(getByLabelText("Loading Members")).toBeInTheDocument();
    expect(getByLabelText("Loading Boards")).toBeInTheDocument();
    expect(getByLabelText("Succesfully loaded Committees")).toBeInTheDocument();
    expect(await findByLabelText("Failed loading Boards")).toBeInTheDocument();
  });
});
