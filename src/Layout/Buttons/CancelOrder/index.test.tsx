import React, {useEffect} from "react";
import CancelOrder from ".";
import {fireEvent, getMember, getProduct, render, screen} from "test-utils";
import {useOrder} from "App/Products/OrdersContext";

afterEach(() => {
  localStorage.removeItem("plus_one_order_queue");
});

describe("<CancelOrder>", () => {
  it("cancels orders", async () => {
    const member = getMember({id: 2, firstName: "John", surname: "Snow"});
    const products = [getProduct({id: 1, price: 100, name: "Pils"})];

    const App = () => {
      const {makeOrderMutation} = useOrder();

      useEffect(() => {
        makeOrderMutation.mutate({member, products});
      }, []);

      return <CancelOrder />;
    };

    render(<App />);

    expect(await screen.findByRole("button")).toHaveTextContent(
      "Cancel buying Pils for €1.00"
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not show all products when buying multiple products", async () => {
    const member = getMember({id: 2, firstName: "John", surname: "Snow"});
    const products = [
      getProduct({id: 1, price: 100, name: "Pils"}),
      getProduct({id: 2, price: 100, name: "Kinder bueno"}),
    ];

    const App = () => {
      const {makeOrderMutation} = useOrder();

      useEffect(() => {
        makeOrderMutation.mutate({member, products});
      }, []);

      return <CancelOrder />;
    };

    render(<App />);

    expect(await screen.findByRole("button")).toHaveTextContent(
      "Cancel buying multiple products for €2.00"
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("isn't shown when no order is queud", () => {
    const storeState = {queuedOrder: null};

    render(<CancelOrder />, {storeState});

    expect(screen.queryByRole("button")).toBeNull();
  });
});
