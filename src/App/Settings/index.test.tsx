import React from "react";
import Settings from "./index";
import moxios from "moxios";
import {render, fireEvent} from "test-utils";

describe("Authentication", () => {
  const base_api = process.env.REACT_APP_API_SERVER;

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

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
