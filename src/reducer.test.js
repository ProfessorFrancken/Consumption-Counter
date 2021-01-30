import {
  surnameRanges,
  members,
  order,
  transactions,
  queuedOrder,
  queuedOrders,
  recentBuyers,
  statistics,
  menuItems,
} from "./reducer";
import {TYPES} from "./actions";
import expect from "expect";

describe("Surname selection reducer", () => {
  it("should return an empty initial state", () => {
    expect(surnameRanges(undefined, {})).toEqual({
      members_per_range: 6 * 5,
      ranges: [],
    });
  });

  it("ranges members based on their surname", () => {
    const members = [
      {surname: "A"},
      {surname: "B"},
      {surname: "C"},
      {surname: "D"},
      {surname: "E"},
      {surname: "F"},
    ];

    expect(
      surnameRanges(
        {members_per_range: 6 * 5},
        {
          type: TYPES.FETCH_MEMBERS_SUCCESS,
          members,
        }
      )
    ).toEqual({
      members_per_range: 6 * 5,
      ranges: [{idx: 0, members, surname_start: "A", surname_end: "F"}],
    });
  });

  it("uses multiple ranges when not all members fit in a range", () => {
    const members = [
      {surname: "A"},
      {surname: "B"},
      {surname: "C"},
      {surname: "D"},
      {surname: "E"},
      {surname: "F"},
    ];

    expect(
      surnameRanges(
        {members_per_range: 3},
        {
          type: TYPES.FETCH_MEMBERS_SUCCESS,
          members,
        }
      )
    ).toEqual({
      members_per_range: 3,
      ranges: [
        {
          idx: 0,
          members: [{surname: "A"}, {surname: "B"}, {surname: "C"}],
          surname_start: "A",
          surname_end: "C",
        },
        {
          idx: 1,
          members: [{surname: "D"}, {surname: "E"}, {surname: "F"}],
          surname_start: "D",
          surname_end: "F",
        },
      ],
    });
  });
});

describe("members", () => {
  it("fetches members", () => {
    const fetchedMembers = [
      {
        id: 1,
        latest_purchase_at: new Date("2018-05-25"),
      },
    ];
    expect(
      members(undefined, {
        type: TYPES.FETCH_MEMBERS_SUCCESS,
        members: fetchedMembers,
      })
    ).toEqual(fetchedMembers);
  });

  it("updates the latest purchase date of a member", () => {
    const orderAction = {
      type: TYPES.BUY_ORDER_SUCCESS,
      order: {
        member: {id: 1},
        ordered_at: 1531323576167,
      },
    };

    expect(
      members(
        [
          {id: 1, latest_purchase_at: new Date("2018-05-25")},
          {id: 2, latest_purchase_at: new Date("2018-06-25")},
        ],
        orderAction
      )
    ).toEqual([
      {id: 1, latest_purchase_at: new Date(1531323576167)},
      {id: 2, latest_purchase_at: new Date("2018-06-25")},
    ]);
  });
});

describe("selecting a member", () => {
  describe("selecting a member", () => {
    it("has no selected member by default", () => {
      expect(order(undefined, {}).member).toEqual({age: 0});
    });

    it("selects a member", () => {
      expect(
        order(undefined, {
          type: TYPES.SELECT_MEMBER,
          member: {name: "mark"},
        }).member
      ).toEqual({name: "mark"});
    });
  });
});

describe("cancelling choices", () => {});

describe("buying products", () => {
  it("is possible to buy more products", () => {
    expect(
      order({products: []}, {type: TYPES.BUY_MORE, product: {id: 1}}).products
    ).toEqual([{id: 1}]);
  });

  it("clears the order list when changing from buy more to buying single", () => {
    expect(order({products: [{id: 1}]}, {type: TYPES.BUY_MORE}).products).toEqual([]);
  });
});

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
          {member: {id: 9}, order: {id: 2}},
          {member: {id: 8}, order: {id: 2}},
          {member: {id: 7}, order: {id: 2}},
          {member: {id: 6}, order: {id: 2}},
          {member: {id: 5}, order: {id: 2}},
          {member: {id: 4}, order: {id: 2}},
          {member: {id: 3}, order: {id: 2}},
          {member: {id: 2}, order: {id: 2}},
          {member: {id: 1}, order: {id: 2}},
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
      recentBuyers([1], {
        type: TYPES.BUY_ORDER_SUCCESS,
        order: {products: [], member: {id: 33}, orderd_at: 1},
      })
    ).toEqual([33, 1]);
  });

  it("moves the most recent buyer to the top", () => {
    expect(
      recentBuyers([1, 33], {
        type: TYPES.BUY_ORDER_SUCCESS,
        order: {products: [], member: {id: 33}, orderd_at: 1},
      })
    ).toEqual([33, 1]);
  });
});

describe("buying products", () => {
  it("has no order queued by default", () => {
    expect(queuedOrder(undefined, {})).toEqual(null);
  });

  it("keeps track of a newly queued order", () => {
    expect(
      queuedOrder(undefined, {
        type: TYPES.QUEUE_ORDER,
        order: {ordered_at: 1},
      })
    ).toEqual({ordered_at: 1, order: {ordered_at: 1}});
  });

  it("empties the queue when an order was bought", () => {
    expect(
      queuedOrder(
        {ordered_at: 1, order: {}},
        {
          type: TYPES.BUY_ORDER_REQUEST,
          order: {ordered_at: 1},
        }
      )
    ).toEqual(null);
  });

  it("does not empty the queue if an order different than the current queued order is bought", () => {
    expect(
      queuedOrder(
        {ordered_at: 1, order: {}},
        {
          type: TYPES.BUY_ORDER_REQUEST,
          order: {ordered_at: 2},
        }
      )
    ).toEqual({ordered_at: 1, order: {}});
  });

  it("empties the queue when an order was cancelled", () => {
    expect(queuedOrder({ordered_at: 1, order: {}}, {type: TYPES.CANCEL_ORDER})).toEqual(
      null
    );
  });

  it("replaces the queue with a new order", () => {
    expect(
      queuedOrder(
        {ordered_at: 1, order: {}},
        {type: TYPES.QUEUE_ORDER, order: {id: 2, ordered_at: 2}}
      )
    ).toEqual({ordered_at: 2, order: {id: 2, ordered_at: 2}});
  });
});

describe("keeping track of orders", () => {
  it("has no order queued by default", () => {
    expect(queuedOrders(undefined, {})).toEqual([]);
  });

  it("keeps track of a newly queued order", () => {
    expect(
      queuedOrders(undefined, {
        type: TYPES.QUEUE_ORDER,
        order: {ordered_at: 1},
      })
    ).toEqual([{ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"}]);
  });

  it("empties the queue when an order was bought", () => {
    expect(
      queuedOrders([{ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"}], {
        type: TYPES.BUY_ORDER_SUCCESS,
        order: {ordered_at: 1},
      })
    ).toEqual([]);
  });

  it("removes orders from the queue when they are cancelled", () => {
    expect(
      queuedOrders([{ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"}], {
        type: TYPES.CANCEL_ORDER,
        order: {ordered_at: 1},
      })
    ).toEqual([]);
  });

  it("keeps track of multiple orders", () => {
    expect(
      queuedOrders([{ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"}], {
        type: TYPES.QUEUE_ORDER,
        order: {ordered_at: 2},
      })
    ).toEqual([
      {ordered_at: 2, order: {ordered_at: 2}, fails: 0, state: "queued"},
      {ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"},
    ]);
  });

  it("keeps track of failed requests", () => {
    expect(
      queuedOrders(
        [
          {
            ordered_at: 2,
            order: {ordered_at: 2},
            fails: 0,
            state: "queued",
          },
          {ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"},
        ],
        {
          type: TYPES.BUY_ORDER_FAILURE,
          order: {ordered_at: 1},
        }
      )
    ).toEqual([
      {ordered_at: 2, order: {ordered_at: 2}, fails: 0, state: "queued"},
      {ordered_at: 1, order: {ordered_at: 1}, fails: 1, state: "queued"},
    ]);

    expect(
      queuedOrders(
        [
          {
            ordered_at: 2,
            order: {ordered_at: 2},
            fails: 0,
            state: "queued",
          },
          {ordered_at: 1, order: {ordered_at: 1}, fails: 2, state: "queued"},
        ],
        {
          type: TYPES.BUY_ORDER_FAILURE,
          order: {ordered_at: 1},
        }
      )
    ).toEqual([
      {ordered_at: 2, order: {ordered_at: 2}, fails: 0, state: "queued"},
      {ordered_at: 1, order: {ordered_at: 1}, fails: 3, state: "queued"},
    ]);
  });

  it("updates the state of an order when sending the order request", () => {
    expect(
      queuedOrders(
        [
          {
            ordered_at: 2,
            order: {ordered_at: 2},
            fails: 0,
            state: "queued",
          },
          {ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "queued"},
        ],
        {
          type: TYPES.BUY_ORDER_REQUEST,
          order: {ordered_at: 1},
        }
      )
    ).toEqual([
      {ordered_at: 2, order: {ordered_at: 2}, fails: 0, state: "queued"},
      {ordered_at: 1, order: {ordered_at: 1}, fails: 0, state: "requesting"},
    ]);
  });
});

describe("menu items", () => {
  it("has a default menu", () => {
    expect(menuItems(undefined, {})).toEqual([
      {icon: "home", url: "/", loading: false},
      {icon: "clock", url: "/recent"},
    ]);
  });

  it("adds buixieval when buixieval is enabled", () => {
    expect(
      menuItems(undefined, {
        type: TYPES.FETCH_MEMBERS_SUCCESS,
        members: [{buixieval: true}],
      })
    ).toEqual([
      {icon: "home", url: "/", loading: false},
      {icon: "clock", url: "/recent"},
      {icon: ["fab", "bitcoin"], url: "/buixieval"},
    ]);
  });

  it("adds committees when committees have been loaded", () => {
    const menuItemsWhenLoadingCommittees = menuItems(undefined, {
      type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST,
    });
    expect(menuItemsWhenLoadingCommittees).toEqual([
      {icon: "home", url: "/", loading: false},
      {icon: "clock", url: "/recent"},
      {icon: "users", url: "/committees", loading: true},
    ]);

    const menuItemsAfterLoadingCommittees = menuItems(menuItemsWhenLoadingCommittees, {
      type: TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS,
    });
    expect(menuItemsAfterLoadingCommittees).toEqual([
      {icon: "home", url: "/", loading: false},
      {icon: "clock", url: "/recent"},
      {icon: "users", url: "/committees", loading: false},
    ]);
  });

  it("adds prominent when board members have been loaded", () => {
    const menuItemsWhenLoadingProminent = menuItems(undefined, {
      type: TYPES.FETCH_BOARD_MEMBERS_REQUEST,
    });
    expect(menuItemsWhenLoadingProminent).toEqual([
      {icon: "chess-queen", url: "/prominent", loading: true},
      {icon: "home", url: "/", loading: false},
      {icon: "clock", url: "/recent"},
    ]);

    const menuItemsAfterLoadingProminent = menuItems(menuItemsWhenLoadingProminent, {
      type: TYPES.FETCH_BOARD_MEMBERS_SUCCESS,
    });
    expect(menuItemsAfterLoadingProminent).toEqual([
      {icon: "chess-queen", url: "/prominent", loading: false},
      {icon: "home", url: "/", loading: false},
      {icon: "clock", url: "/recent"},
    ]);
  });
});

describe("statistics", () => {
  it("fetches statistics", () => {
    expect(
      statistics(undefined, {
        type: TYPES.FETCH_STATISTICS_SUCCESS,
        statistics: [{date: new Date("2018-06-01"), total: 1, beer: 1, soda: 1, food: 1}],
      })
    ).toEqual([{date: new Date("2018-06-01"), total: 1, beer: 1, soda: 1, food: 1}]);
  });

  it("records statistics after a product is purchased", () => {
    const orderAction = {
      type: "BUY_ORDER_SUCCESS",
      order: {
        member: {id: 1},
        products: [
          {id: 3, category: "Bier"},
          {id: 4, category: "Fris"},
          {id: 4, category: "Fris"},
          {id: 5, category: "Eten"},
        ],
        ordered_at: new Date("2018-06-01T18:00:00").getTime(),
      },
    };

    expect(
      statistics(
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
