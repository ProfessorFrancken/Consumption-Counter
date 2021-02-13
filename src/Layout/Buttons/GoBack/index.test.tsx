import React from "react";
import GoBack from ".";
import {render, fireEvent} from "test-utils";

afterEach(() => {
  localStorage.removeItem("plus_one_order_queue");
});

describe("<GoBack />", () => {
  it("renders", () => {
    const storeState = {queuedOrder: null};
    const routes = ["/products"];

    const {getByRole} = render(<GoBack />, {storeState, routes});

    fireEvent.click(getByRole("button"));
    expect(getByRole("button")).toHaveTextContent("Go back");
  });

  it("doesn't render on the frontpage if no order is queued", () => {
    const storeState = {queuedOrder: null};
    const routes = ["/"];

    const {queryByRole} = render(<GoBack />, {storeState, routes});

    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("goes back to a previous customer", () => {
    const storeState = {
      queuedOrder: {
        ordered_at: 1,
        order: {
          ordered_at: 1,
          member: {
            id: 1,
            firstName: "John",
            surname: "Snow",
            fullname: "John Snow",
            age: 18,
            prominent: null,
            latest_purchase_at: new Date(),
            cosmetics: {
              color: null,
              image: null,
              nickname: null,
              button: {
                width: null,
                height: null,
              },
            },
          },
          products: [],
        },
      },
    };
    const {getByRole} = render(<GoBack />, {storeState});

    fireEvent.click(getByRole("button"));
    expect(getByRole("button")).toHaveTextContent("John Snow");
  });
});
