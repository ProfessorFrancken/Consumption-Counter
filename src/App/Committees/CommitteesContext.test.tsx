import * as React from "react";
import {render, screen} from "@testing-library/react";
import {useCommittees} from "./CommitteesContext";
import {InfrastructureProviders} from "Root";
import {MembersProvider} from "App/Members/Context";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";

describe("Committee context", () => {
  const SelectCommittee: React.FC = () => {
    const {committees} = useCommittees();

    if (committees === undefined) {
      return null;
    }

    return (
      <ul>
        {committees.map((committee, idx) => (
          <li key={idx}>{committee.name}</li>
        ))}
      </ul>
    );
  };

  const committeeMembers = [
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
  ];

  const server = setupServer(
    rest.get("*/committees", (req, res, ctx) => {
      return res(ctx.json({committees: committeeMembers}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Fetches a list of committees", async () => {
    render(
      <InfrastructureProviders>
        <MembersProvider
          members={[
            {
              id: 314,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
              age: 18,
              cosmetics: undefined,
              latest_purchase_at: null,
              prominent: null,
            },
          ]}
        >
          <SelectCommittee />
        </MembersProvider>
      </InfrastructureProviders>
    );

    expect(await screen.findByText("Compucie")).toBeInTheDocument();
    expect(await screen.findByText("Night's Watch")).toBeInTheDocument();
  });

  // it only shows current active members
});
