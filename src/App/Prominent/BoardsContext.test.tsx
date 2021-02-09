import * as React from "react";
import {render} from "@testing-library/react";
import {useBoards, BoardsProvider} from "./BoardsContext";
import moxios from "moxios";
import {InfrastructureProviders} from "Root";
import {create} from "./../../Setup/store";

describe("Board context", () => {
  const SelectBoard: React.FC = () => {
    const {boardMembers} = useBoards();

    if (boardMembers === undefined) {
      return <span>Hoi</span>;
    }

    return (
      <ul>
        {boardMembers.map((board, idx) => (
          <li key={idx}>
            {board.member.fullname} - {board.year}
          </li>
        ))}
      </ul>
    );
  };

  it("Fetches a list of boards", async () => {
    // TODO: replace by msw or miragejs
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`${base_api}/boards`, {
      response: {boardMembers},
      headers: {"content-type": "application/json"},
    });

    const {findByText} = render(
      <InfrastructureProviders
        store={create({
          members: [
            {
              id: 314,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
            },
          ],
        })}
      >
        <BoardsProvider>
          <SelectBoard />
        </BoardsProvider>
      </InfrastructureProviders>
    );

    expect(await findByText("John Snow - 2018")).toBeInTheDocument();
  });

  it("Requires the BoardsProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectBoard />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockReset();
    spy.mockRestore();
  });

  // it only shows current active members
});

const boardMembers = [
  {
    lid_id: 314,
    jaar: 2018,
    functie: "King",
  },
];
