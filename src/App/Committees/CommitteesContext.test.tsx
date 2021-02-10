import * as React from "react";
import {render} from "@testing-library/react";
import {useCommittees, CommitteesProvider} from "./CommitteesContext";
import moxios from "moxios";
import {InfrastructureProviders} from "Root";
import {create} from "./../../Setup/store";
import {MembersProvider} from "App/Members/Context";

describe("Committee context", () => {
  const SelectCommittee: React.FC = () => {
    const {committees} = useCommittees();

    if (committees === undefined) {
      return <span>Hoi</span>;
    }

    return (
      <ul>
        {committees.map((committee, idx) => (
          <li key={idx}>{committee.name}</li>
        ))}
      </ul>
    );
  };

  it("Fetches a list of committees", async () => {
    // TODO: replace by msw or miragejs
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`${base_api}/committees`, {
      response: {committees: committeeMembers},
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
        <MembersProvider
          members={[
            {
              id: 314,
              firstName: "John",
              surname: "Snow",
              fullname: "John Snow",
            },
          ]}
        >
          <CommitteesProvider>
            <SelectCommittee />
          </CommitteesProvider>
        </MembersProvider>
      </InfrastructureProviders>
    );

    expect(await findByText("Compucie")).toBeInTheDocument();
    expect(await findByText("Night's Watch")).toBeInTheDocument();
  });

  it("Requires the CommitteesProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectCommittee />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockReset();
    spy.mockRestore();
  });

  // it only shows current active members
});

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
