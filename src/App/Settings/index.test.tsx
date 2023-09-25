import React from "react";
import Settings from "./index";
import {render} from "test-utils";

describe("Authentication", () => {
  it("Shows a warning that the system is not authenticated", () => {
    const {getByRole, getByText} = render(<Settings />, {
      storeState: {
        queuedOrders: [
          {
            order: {
              member: {fullname: "John Snow"},
              products: [{name: "Ice Tea", price: 100}],
            },
            fails: 0,
            state: "test",
          },
        ],
      },
    });

    expect(getByText("Queued Orders")).toBeInTheDocument();
    expect(getByRole("button", {name: "Retry all"})).toBeInTheDocument();
  });
});
