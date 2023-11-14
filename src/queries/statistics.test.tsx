import * as React from "react";
import {render, screen} from "@testing-library/react";
import {useTransactionsStatisticsQuery} from "./statistics";
import {InfrastructureProviders} from "../root";
import clock from "jest-plugin-clock";
import {setupServer} from "msw/node";
import {rest} from "msw";

describe("Statistics context", () => {
  clock.set("2021-01-01");

  const SelectStatistic: React.FC = () => {
    const statisticsQuery = useTransactionsStatisticsQuery();

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
    render(
      <InfrastructureProviders>
        <SelectStatistic />
      </InfrastructureProviders>
    );

    expect(await screen.findByText("2021-02-01: 33, 3, 1: 37")).toBeInTheDocument();
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
