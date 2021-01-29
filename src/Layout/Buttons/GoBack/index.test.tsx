import React from "react";
import GoBack from ".";
import {render, fireEvent} from "test-utils";

describe("<GoBack />", () => {
  it("renders", () => {
    const storeState = {queuedOrder: null};
    const routes = ["/products"];

    const {getByRole} = render(<GoBack />, {storeState, routes});

    fireEvent.click(getByRole("button"));
    expect(getByRole("button")).toHaveTextContent("Go back");
  });

  it("goes back to a previous customer", () => {
    const storeState = {
      queuedOrder: {
        ordered_at: 1,
        order: {
          member: {
            id: 1,
            firstName: "John",
            surname: "Snow",
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
