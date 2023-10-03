import React from "react";
import AvailableProducts from "./index";
import {render, fireEvent, getMember, getProduct} from "test-utils";
import {useOrder} from "./OrdersContext";
import {MemberType} from "App/Members/Members";
import clock from "jest-plugin-clock";
import ProductsScreen from "./index";

it("renders, and it does not include products that a member is not allowed to buy (due to age distriction)", () => {
  const storeState = {
    products: {
      Bier: [
        getProduct({
          name: "Hertog Jan",
          id: 1,
          age_restriction: 18,
          category: "Bier",
        }),
      ],
      Fris: [
        getProduct({
          name: "Ice Tea",
          id: 2,
          age_restriction: null,
          category: "Fris",
        }),
      ],
      Eten: [],
    },
    order: {member: getMember({age: 17}), products: []},
  };
  const {queryByLabelText, getByLabelText, getAllByRole} = render(<AvailableProducts />, {
    storeState,
  });

  expect(queryByLabelText("beer category")).toBeNull();
  expect(queryByLabelText("soda category")).not.toBeNull();

  const soda = getByLabelText("soda category");
  expect(getAllByRole("button", soda)).toHaveLength(1);
});

it("shows the amount of products that are currently being orderd", () => {
  const storeState = {
    products: {
      Bier: [
        getProduct({
          name: "Hertog Jan",
          id: 1,
          age_restriction: 18,
          category: "Bier",
        }),
      ],
      Fris: [
        getProduct({
          name: "Ice Tea",
          id: 2,
          age_restriction: null,
          category: "Fris",
        }),
      ],
      Eten: [],
    },
    order: {
      member: getMember({age: 19}),
      products: [
        getProduct({
          id: 1,
          name: "Hertog Jan",
          price: 65,
          category: "Bier",
        }),
        getProduct({
          id: 1,
          name: "Hertog Jan",
          price: 65,
          category: "Bier",
        }),
      ],
    },
  };
  const {getAllByLabelText} = render(<AvailableProducts />, {storeState});

  const orderedProducts = getAllByLabelText("amount ordered");
  expect(orderedProducts).toHaveLength(1);
  expect(orderedProducts[0]).toHaveTextContent("2");
});

describe("Selecting a member", () => {
  const SelectMember: React.FC<{member: MemberType}> = ({member}) => {
    // HERE
    const {selectMember, order} = useOrder();

    if (order.member) {
      return <span>{order.member.fullname}</span>;
    }

    return <button onClick={() => selectMember(member)}>Select {member.fullname}</button>;
  };

  clock.set("2018-01-01");
  const member: MemberType = {
    id: 1,
    firstName: "John",
    surname: "Snow",
    fullname: "John Snow",
    latest_purchase_at: null,
    age: 0,
    prominent: null,
    cosmetics: undefined,
  };
  const state = {
    storeState: {order: {member: undefined, products: []}},
  };

  it("Selects a member when they do not have a latest purchse", () => {
    window.confirm = jest.fn().mockImplementationOnce(() => true);

    const {getByRole, getByText} = render(<SelectMember member={member} />, state);

    fireEvent.click(getByRole("button"));
    expect(getByText("John Snow")).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });

  it("Selects a member when their latest purchase was recent", () => {
    const {getByRole, getByText} = render(
      <SelectMember member={{...member, latest_purchase_at: new Date("2017-12-30")}} />,
      state
    );

    fireEvent.click(getByRole("button"));
    expect(getByText("John Snow")).toBeInTheDocument();
  });

  it("Selects a member after confirming they want to be selected", () => {
    window.confirm = jest.fn().mockImplementationOnce(() => true);

    const {getByRole, getByText} = render(
      <SelectMember member={{...member, latest_purchase_at: new Date("2016-12-30")}} />,
      state
    );

    fireEvent.click(getByRole("button"));
    expect(getByText("John Snow")).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });

  it("Does not select a member if they do not confirm they want to be selected", () => {
    window.confirm = jest.fn().mockImplementationOnce(() => false);

    const {getByRole, queryByText} = render(
      <SelectMember member={{...member, latest_purchase_at: new Date("2016-12-30")}} />,
      state
    );

    fireEvent.click(getByRole("button"));
    expect(queryByText("John Snow")).not.toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });
});

describe("Listing available products", () => {
  clock.set("2018-01-01");

  const member = getMember({
    latest_purchase_at: new Date("2017-12-30"),
    age: 19,
  });
  it("Shows products to a member", () => {
    const state = {
      storeState: {order: {member, products: []}},
    };

    const {getByRole} = render(<ProductsScreen />, state);
    expect(getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();
  });

  it("Doesn't show alcohol minors", () => {
    const state = {
      storeState: {
        members: [{...member, age: 17}],
        order: {
          member: {...member, age: 17},
          products: [],
        },
      },
    };

    const {getByRole, queryByRole} = render(<ProductsScreen />, state);
    expect(getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
    expect(queryByRole("button", {name: /Hertog Jan/})).not.toBeInTheDocument();
  });

  it("Shows the amount of a product a member is about to purchase", () => {
    const hertog = getProduct({
      id: 3,
      name: "Hertog Jan",
      price: 68,
      category: "Bier",
      age_restriction: 18,
    });
    const iceTea = getProduct({
      id: 27,
      name: "Ice Tea",
      price: 60,
      category: "Fris",
    });

    const state = {
      storeState: {order: {member, products: [hertog, hertog, iceTea]}},
    };

    const {getByRole} = render(<ProductsScreen />, state);
    expect(getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Hertog Jan/})).toHaveTextContent("2");
    expect(getByRole("button", {name: /Ice Tea/})).toHaveTextContent("1");
  });

  describe("Before 4", () => {
    clock.set("2018-01-01 15:00:00");
    it("Locks beer before 4", () => {
      const state = {
        storeState: {order: {member, products: []}},
      };

      const {getByRole} = render(<ProductsScreen />, state);
      expect(getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
      expect(getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
      expect(getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();

      expect(getByRole("button", {name: /Ice Tea/})).not.toBeDisabled();
      expect(getByRole("button", {name: /Kinder Bueno/})).not.toBeDisabled();

      // We don't want to disable buying beer before 4 but we do want to discourage it
      const btn = getByRole("button", {name: /Hertog Jan/});
      expect(getByRole("button", {name: /Hertog Jan/})).not.toBeDisabled();
      expect(btn.className).toContain("locked");
    });
  });

  describe("After 4 ", () => {
    clock.set("2018-01-01 16:00:00");
    it("Locks beer before 4", () => {
      const state = {
        storeState: {order: {member, products: []}},
      };

      const {getByRole} = render(<ProductsScreen />, state);
      expect(getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
      expect(getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
      expect(getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();

      expect(getByRole("button", {name: /Ice Tea/})).not.toBeDisabled();
      expect(getByRole("button", {name: /Kinder Bueno/})).not.toBeDisabled();
      expect(getByRole("button", {name: /Hertog Jan/})).not.toBeDisabled();
    });
  });
});
