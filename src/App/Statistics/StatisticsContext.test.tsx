import * as React from "react";
import {render} from "@testing-library/react";
import {useStatistics, statisticsReducer, StatisticsProvider} from "./StatisticsContext";
import moxios from "moxios";
import {create} from "./../../Setup/store";
import {InfrastructureProviders} from "Root";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";
import {BUY_ORDER_SUCCESS_EVENT, FETCH_STATISTICS_EVENT} from "actions";

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

describe("Statistics reducer", () => {
  it("fetches statistics", () => {
    expect(
      statisticsReducer(
        [],
        FETCH_STATISTICS_EVENT({
          statistics: [{date: "2018-06-01", total: 1, beer: 1, soda: 1, food: 1}],
        })
      )
    ).toEqual([{date: "2018-06-01", total: 1, beer: 1, soda: 1, food: 1}]);
  });

  it("records statistics after a product is purchased", () => {
    const productProps = {
      name: "HJ",
      price: 0,
      position: 0,
      image: "",
      splash_image: "",
      age_restriction: null,
    };
    const orderAction = BUY_ORDER_SUCCESS_EVENT({
      order: {
        member: {
          id: 1,
          firstName: "John",
          surname: "Snow",
          fullname: "John Snow",
          latest_purchase_at: null,
          prominent: null,
          age: 33,
          cosmetics: undefined,
        },
        products: [
          {id: 3, category: "Bier", ...productProps},
          {id: 4, category: "Fris", ...productProps},
          {id: 4, category: "Fris", ...productProps},
          {id: 5, category: "Eten", ...productProps},
        ],
        ordered_at: new Date("2018-06-01T18:00:00").getTime(),
      },
    });

    expect(
      statisticsReducer(
        [
          {date: "2018-05-01", total: 1, beer: 1, soda: 0, food: 0},
          {date: "2018-06-01", total: 3, beer: 1, soda: 1, food: 1},
        ],
        orderAction
      )
    ).toEqual([
      {date: "2018-05-01", total: 1, beer: 1, soda: 0, food: 0},
      {date: "2018-06-01", total: 7, beer: 2, soda: 3, food: 2},
    ]);
  });
});
