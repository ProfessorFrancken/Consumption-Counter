import * as React from "react";
import {render} from "@testing-library/react";
import {useActivities, ActivitiesProvider} from "./ActivitiesContext";
import moxios from "moxios";
import {create} from "./../../Setup/store";
import {InfrastructureProviders} from "Root";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

describe("Activities context", () => {
  clock.set("2021-01-01");

  const SelectActivity: React.FC = () => {
    const {activities} = useActivities();

    if (activities === undefined) {
      return null;
    }

    return (
      <ul>
        {activities.map((activity, idx) => (
          <li key={idx}>{activity.title}</li>
        ))}
      </ul>
    );
  };

  it("Fetches a list of activities", async () => {
    // TODO: replace by msw or miragejs
    moxios.install();
    moxios.stubRequest(/activities\?after=2019-01-01&before=2022-01-01/, {
      response: {activities},
      headers: {"content-type": "application/json"},
    });

    const {findByText} = render(
      <InfrastructureProviders store={create()}>
        <ActivitiesProvider>
          <SelectActivity />
        </ActivitiesProvider>
      </InfrastructureProviders>
    );

    expect(await findByText("Crash & Compile")).toBeInTheDocument();
  });

  it("Requires the ActivitiesProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectActivity />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockReset();
    spy.mockRestore();
  });
});

const activities = [
  {
    title: "Crash & Compile",
    description: "Competitive team based coding heuristic to identify the ballmer peak",
    locatoin: "Online",
    startDate: "2021-02-28T18:00:00+01:00",
    endDate: "2021-02-28T23:00:00+01:00",
  },
];
