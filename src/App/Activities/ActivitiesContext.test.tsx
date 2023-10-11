import * as React from "react";
import {render, screen} from "@testing-library/react";
import {useActivities, ActivitiesProvider} from "./ActivitiesContext";
import {InfrastructureProviders} from "Root";
import {rest} from "msw";
import {setupServer} from "msw/node";

const activities = [
  {
    title: "Crash & Compile",
    description: "Competitive team based coding heuristic to identify the ballmer peak",
    locatoin: "Online",
    startDate: "2021-02-28T18:00:00+01:00",
    endDate: "2021-02-28T23:00:00+01:00",
  },
];

describe("Activities context", () => {
  const server = setupServer(
    rest.get("*/statistics/activities", (req, res, ctx) => {
      return res(ctx.json({activities}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

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
    render(
      <InfrastructureProviders>
        <ActivitiesProvider>
          <SelectActivity />
        </ActivitiesProvider>
      </InfrastructureProviders>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();

    expect(await screen.findByText("Crash & Compile")).toBeInTheDocument();
  });

  it("Requires the ActivitiesProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectActivity />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(3);

    spy.mockReset();
    spy.mockRestore();
  });
});
