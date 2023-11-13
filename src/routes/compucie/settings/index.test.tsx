import {screen} from "@testing-library/react";
import Settings from "./index";
import {render, fireEvent} from "../../../test-utils";
import {setupServer} from "msw/node";
import {rest} from "msw";

describe("Settings", () => {
  it("Shows a warning that the system is not authenticated", () => {
    render(<Settings />, {
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

    expect(screen.getByText("Queued Orders")).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Retry all"})).toBeInTheDocument();
  });

  describe("Authentication", () => {
    beforeEach(() => {
      localStorage.removeItem("plus_one_authorization");
    });

    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

    const server = setupServer(
      rest.post("*/authenticate", (req, res, ctx) => {
        return res(ctx.json({token}));
      })
    );

    beforeAll(() => {
      server.listen();
    });

    afterAll(() => {
      server.close();
    });

    it("Shows a warning that the system is not authenticated", () => {
      render(<Settings />, {
        storeState: {authentication: {token: null}},
      });

      expect(
        screen.getByText(
          "You need to authenticate with our server in order to connect the Consumption Counter."
        )
      ).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent("Authenticate");
    });

    it("authenticates the plus one system", async () => {
      render(<Settings />, {
        storeState: {authentication: {token: null}},
      });

      fireEvent.change(screen.getByPlaceholderText("Passphrase"), {
        target: {value: "some long passphrase"},
      });
      fireEvent.submit(screen.getByText("Authenticate"));

      expect(
        await screen.findByText("The system is authentiated until", {exact: false})
      ).toBeInTheDocument();
    });
  });
});
