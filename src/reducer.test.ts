import {transactions, recentBuyers} from "./reducer";
import {TYPES} from "./actions";
import expect from "expect";

describe("keeping track of the latest transactions", () => {
  it("has no transactions by default", () => {
    expect(transactions(undefined, {})).toEqual([]);
  });

  it("saves a transaction", () => {
    expect(
      transactions(undefined, {
        type: TYPES.BUY_ORDER_SUCCESS,
        member: {id: 1},
        order: {id: 2},
      })
    ).toEqual([{member: {id: 1}, order: {id: 2}}]);
  });

  it("saves additional transactions", () => {
    expect(
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
      transactions([{member: {id: 1}, order: {id: 2}}], {
        type: TYPES.BUY_ORDER_SUCCESS,
        member: {id: 3},
        order: {id: 4},
      })
    ).toEqual([
      {member: {id: 3}, order: {id: 4}},
      {member: {id: 1}, order: {id: 2}},
    ]);
  });

  it("only keeps track of the latest 10 transactions", () => {
    expect(
      transactions(
        [
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 9}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 8}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 7}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 6}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 5}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 4}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 3}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 2}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 1}, order: {id: 2}},
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          {member: {id: 0}, order: {id: 2}},
        ],
        {type: TYPES.BUY_ORDER_SUCCESS, member: {id: 33}, order: {id: 33}}
      )
    ).toEqual([
      {member: {id: 33}, order: {id: 33}},
      {member: {id: 9}, order: {id: 2}},
      {member: {id: 8}, order: {id: 2}},
      {member: {id: 7}, order: {id: 2}},
      {member: {id: 6}, order: {id: 2}},
      {member: {id: 5}, order: {id: 2}},
      {member: {id: 4}, order: {id: 2}},
      {member: {id: 3}, order: {id: 2}},
      {member: {id: 2}, order: {id: 2}},
      {member: {id: 1}, order: {id: 2}},
    ]);
  });
});

describe("a list of members who recently made an order", () => {
  it("keeps track of members that made an order", () => {
    expect(recentBuyers(undefined, {})).toEqual([]);
    expect(
      recentBuyers([], {
        type: TYPES.BUY_ORDER_SUCCESS,
        order: {products: [], member: {id: 33}, orderd_at: 1},
      })
    ).toEqual([33]);
  });

  it("sorts the members on the date of their last order", () => {
    expect(
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
      recentBuyers([1], {
        type: TYPES.BUY_ORDER_SUCCESS,
        order: {products: [], member: {id: 33}, orderd_at: 1},
      })
    ).toEqual([33, 1]);
  });

  it("moves the most recent buyer to the top", () => {
    expect(
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
      recentBuyers([1, 33], {
        type: TYPES.BUY_ORDER_SUCCESS,
        order: {products: [], member: {id: 33}, orderd_at: 1},
      })
    ).toEqual([33, 1]);
  });
});
