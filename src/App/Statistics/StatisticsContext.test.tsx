import * as React from "react";
import {render} from "@testing-library/react";
import {StatisticsProvider, useStatisticsQuery} from "./StatisticsContext";
import {InfrastructureProviders} from "Root";
import clock from "jest-plugin-clock";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";

describe("Statistics context", () => {
  clock.set("2021-01-01");

  const SelectStatistic: React.FC = () => {
    const statisticsQuery = useStatisticsQuery();

    if (statisticsQuery.data === undefined) {
      return null;
    }

    return (
      <ul>
        {statisticsQuery.data.map((statistic, idx) => (
          <li key={idx}>
            {statistic.date}: {statistic.beer}, {statistic.soda}, {statistic.food}:{" "}
            {statistic.total}
          </li>
        ))}
      </ul>
    );
  };

  const server = setupServer(
    rest.get("*/statistics/categories", (req, res, ctx) => {
      return res(ctx.json({statistics}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Fetches a list of statistics", async () => {
    const {findByText} = render(
      <InfrastructureProviders>
        <StatisticsProvider>
          <SelectStatistic />
        </StatisticsProvider>
      </InfrastructureProviders>
    );

    expect(await findByText("2021-02-01: 33, 3, 1: 37")).toBeInTheDocument();
  });

  it("Requires the StatisticsProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectStatistic />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(3);

    spy.mockReset();
    spy.mockRestore();
  });
});

const statistics = [
  {
    date: "2021-02-01",
    beer: "33",
    soda: "3",
    food: "1",
  },
];
