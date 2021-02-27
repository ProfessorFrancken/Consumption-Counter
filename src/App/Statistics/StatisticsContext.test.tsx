import * as React from "react";
import {render} from "@testing-library/react";
import {useStatistics, StatisticsProvider} from "./StatisticsContext";
import moxios from "moxios";
import {create} from "./../../Setup/store";
import {InfrastructureProviders} from "Root";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

describe("Statistics context", () => {
  clock.set("2021-01-01");

  const SelectStatistic: React.FC = () => {
    const {statistics} = useStatistics();

    if (statistics === undefined) {
      return null;
    }

    return (
      <ul>
        {statistics.map((statistic, idx) => (
          <li key={idx}>
            {statistic.date}: {statistic.beer}, {statistic.soda}, {statistic.food}:{" "}
            {statistic.total}
          </li>
        ))}
      </ul>
    );
  };

  it("Fetches a list of statistics", async () => {
    // TODO: replace by msw or miragejs
    moxios.install();
    moxios.stubRequest(
      /statistics\/categories\?startDate=2019-01-01&endDate=2021-01-01/,
      {
        response: {statistics},
        headers: {"content-type": "application/json"},
      }
    );

    const {findByText} = render(
      <InfrastructureProviders store={create()}>
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
    expect(spy).toHaveBeenCalledTimes(2);

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
