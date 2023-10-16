import * as React from "react";
import {render, screen} from "@testing-library/react";
import {useBoards} from "./BoardsContext";
import {InfrastructureProviders} from "Root";
import {MembersProvider} from "App/Members/Context";
import {rest} from "msw";
import {setupServer} from "msw/node";

const boardMembers = [
  {
    lid_id: 314,
    jaar: 2018,
    functie: "King",
  },
];

describe("Board context", () => {
  const SelectBoard: React.FC = () => {
    const {boardMembers} = useBoards();

    if (boardMembers === undefined) {
      return null;
    }

    return (
      <ul>
        {boardMembers.map((board, idx) => (
          <li key={idx}>
            {board.member?.fullname} - {board.year}
          </li>
        ))}
      </ul>
    );
  };

  const server = setupServer(
    rest.get("*/boards", (req, res, ctx) => {
      return res(ctx.json({boardMembers}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Fetches a list of boards", async () => {
    render(
      <InfrastructureProviders>
        <MembersProvider
          members={[
            {
              id: 314,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
              age: 33,
              prominent: null,
              cosmetics: undefined,
              latest_purchase_at: null,
            },
          ]}
        >
          <SelectBoard />
        </MembersProvider>
      </InfrastructureProviders>
    );

    expect(await screen.findByText("John Snow - 2018")).toBeInTheDocument();
  });

  // it only shows current active members
});
