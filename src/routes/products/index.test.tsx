import React from "react";
import {screen} from "@testing-library/react";
import Products from "./index";
import {render, fireEvent, getMember, getProduct} from "test-utils";
import {
  OrderContext,
  useSelectedMember,
  useSelectMember,
} from "../../components/orders-context";
import {MemberType} from "../../queries/members";
import clock from "jest-plugin-clock";
import ProductsScreen from "./index";
import {Product} from "queries/products";
import {defaultMembers} from "App/MockedState";

it("renders without crashing", () => {
  render(<Products />);
});

it("adds products to an order when clicked", async () => {
  const addToOrder = jest.fn();

  const hertogJan: Product = {
    id: 1,
    name: "Hertog-Jan",
    image: "",
    age_restriction: 18,
    category: "Bier",
    position: 0,
    price: 1,
    splash_image: "",
  };

  const makeOrder = jest.fn();
  const value = {
    products: {
      Bier: [hertogJan],
      Fris: [],
      Eten: [],
    },
    addProductToOrder: addToOrder,
    reset: () => {},
    order: {products: [], member: undefined},
    makeOrderMutation: {mutate: makeOrder},
    cancelOrder: () => {},
  };

  const products = (
    // @ts-expect-error this is ugly but mockin the use mutation is a bit too much
    <OrderContext.Provider value={value}>
      <Products />
    </OrderContext.Provider>
  );

  const kinderBueno = getProduct({name: "Kinder Bueno", id: 2});
  render(products, {
    routes: ["?memberId=1"],
    storeState: {
      products: {
        Bier: [hertogJan],
        Fris: [],
        Eten: [kinderBueno],
      },
    },
  });

  // Since this component uses a long press event, we need to simulate mouse down and up
  fireEvent.mouseDown(screen.getByLabelText("Buy Kinder Bueno"));
  fireEvent.mouseUp(screen.getByLabelText("Buy Kinder Bueno"));

  expect(makeOrder).toBeCalledWith({
    member: defaultMembers[0],
    products: [kinderBueno],
  });
});

it("it does not include products that a member is not allowed to buy (due to age distriction)", () => {
  const storeState = {
    products: {
      Bier: [
        getProduct({id: 1, name: "Hertog Jan", age_restriction: 18, category: "Bier"}),
      ],
      Fris: [getProduct({id: 2, name: "Ice Tea", category: "Fris"})],
      Eten: [],
    },
    order: {
      products: [],
    },
    members: [getMember({age: 17})],
  };

  render(<Products />, {
    storeState,
    routes: ["?memberId=1"],
  });

  expect(screen.queryByLabelText("beer category")).toBeNull();
  expect(screen.getByLabelText("soda category")).toBeInTheDocument();

  const soda = screen.getByLabelText("soda category");
  expect(screen.getAllByRole("button", soda)).toHaveLength(1);
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

  render(<Products />, {
    storeState,
    routes: ["?memberId=1"],
  });

  const orderedProducts = screen.getAllByLabelText("amount ordered");
  expect(orderedProducts).toHaveLength(1);
  expect(orderedProducts[0]).toHaveTextContent("2");
});

describe("Selecting a member", () => {
  const SelectMember: React.FC<{member: MemberType}> = ({member}) => {
    const selectedMember = useSelectedMember();
    const selectMember = useSelectMember();

    if (selectedMember) {
      return <span>{selectedMember.fullname}</span>;
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
    storeState: {order: {products: []}},
    routes: ["/"],
  };

  it("Selects a member when they do not have a latest purchse", () => {
    window.confirm = jest.fn().mockImplementationOnce(() => true);

    render(<SelectMember member={member} />, state);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("John Snow")).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });

  it("Selects a member when their latest purchase was recent", () => {
    render(
      <SelectMember member={{...member, latest_purchase_at: new Date("2017-12-30")}} />,
      state
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("John Snow")).toBeInTheDocument();
  });

  it("Selects a member after confirming they want to be selected", () => {
    window.confirm = jest.fn().mockImplementationOnce(() => true);

    render(
      <SelectMember member={{...member, latest_purchase_at: new Date("2016-12-30")}} />,
      state
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("John Snow")).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });

  it("Does not select a member if they do not confirm they want to be selected", () => {
    window.confirm = jest.fn().mockImplementationOnce(() => false);

    render(
      <SelectMember member={{...member, latest_purchase_at: new Date("2016-12-30")}} />,
      state
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("John Snow")).not.toBeInTheDocument();
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
      storeState: {order: {products: []}},
      routes: ["/?memberId=1"],
    };

    render(<ProductsScreen />, state);
    expect(screen.getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();
  });

  it("Doesn't show alcohol minors", () => {
    const state = {
      storeState: {
        members: [{...member, age: 17}],
        order: {
          products: [],
        },
      },
      routes: ["/?memberId=1"],
    };

    render(<ProductsScreen />, state);
    expect(screen.getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
    expect(screen.queryByRole("button", {name: /Hertog Jan/})).not.toBeInTheDocument();
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
      storeState: {order: {products: [hertog, hertog, iceTea]}},
      routes: ["/?memberId=1"],
    };

    render(<ProductsScreen />, state);
    expect(screen.getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /Hertog Jan/})).toHaveTextContent("2");
    expect(screen.getByRole("button", {name: /Ice Tea/})).toHaveTextContent("1");
  });

  describe("Before 4", () => {
    clock.set("2018-01-01 15:00:00");
    it("Locks beer before 4", () => {
      const state = {
        storeState: {order: {products: []}},
        routes: ["/?memberId=1"],
      };

      render(<ProductsScreen />, state);
      expect(screen.getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();

      expect(screen.getByRole("button", {name: /Ice Tea/})).not.toBeDisabled();
      expect(screen.getByRole("button", {name: /Kinder Bueno/})).not.toBeDisabled();

      // We don't want to disable buying beer before 4 but we do want to discourage it
      const btn = screen.getByRole("button", {name: /Hertog Jan/});
      expect(screen.getByRole("button", {name: /Hertog Jan/})).not.toBeDisabled();
      expect(btn.className).toContain("locked");
    });
  });

  describe("After 4", () => {
    clock.set("2018-01-01 16:00:00");
    it("Locks beer before 4", () => {
      const state = {
        storeState: {order: {products: []}},
        routes: ["/?memberId=1"],
      };

      render(<ProductsScreen />, state);
      expect(screen.getByRole("button", {name: /Ice Tea/})).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Kinder Bueno/})).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /Hertog Jan/})).toBeInTheDocument();

      expect(screen.getByRole("button", {name: /Ice Tea/})).not.toBeDisabled();
      expect(screen.getByRole("button", {name: /Kinder Bueno/})).not.toBeDisabled();
      expect(screen.getByRole("button", {name: /Hertog Jan/})).not.toBeDisabled();
    });
  });
});
