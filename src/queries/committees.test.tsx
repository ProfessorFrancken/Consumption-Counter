import * as React from "react";
import {screen} from "@testing-library/react";
import {useCommittees} from "./committees";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {render} from "test-utils";

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
      member_id: 314,
      year: 2018,
      function: "King",
      committee: {
        id: 14,
        name: "Night's Watch",
      },
    },
    {
      member_id: 314,
      year: 2018,
      function: "King",
      committee: {
        id: 0,
        name: "Compucie",
      },
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
    render(<SelectCommittee />, {
      storeState: {
        members: [
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
        ],
        committeeMembers,
      },
    });

    expect(await screen.findByText("Compucie")).toBeInTheDocument();
    expect(await screen.findByText("Night's Watch")).toBeInTheDocument();
  });

  // it only shows current active members
});
