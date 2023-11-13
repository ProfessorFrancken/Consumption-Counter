import * as React from "react";
import {screen} from "@testing-library/react";
import {useBoards} from "./boards";
import {rest} from "msw";
import {setupServer} from "msw/node";
import {render} from "../test-utils";

const boardMembers = [
  {
    member_id: 314,
    year: 2018,
    function: "King",
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
    render(<SelectBoard />, {
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
        boardMembers,
      },
    });

    expect(await screen.findByText("John Snow - 2018")).toBeInTheDocument();
  });

  // it only shows current active members
});
