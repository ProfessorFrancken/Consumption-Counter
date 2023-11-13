import {fireEvent, screen} from "@testing-library/react";
import AuthenticationForm from "./authentication-form";
import {render} from "../../test-utils";
import {setupServer} from "msw/node";
import {rest} from "msw";

describe("<AuthenticationForm />", () => {
  beforeEach(() => {
    localStorage.removeItem("plus_one_authorization");
  });

  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

  const server = setupServer(
    rest.post("*/authenticate", async (req, res, ctx) => {
      const data = await req.json();

      if (data.password === "An incorrect passphrase") {
        return res(ctx.status(401, "Unauthorized"));
      }

      if (data.password === "Something weird") {
        return res(ctx.status(500, "Whoops"));
      }

      return res(ctx.json({token}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("is possible to refresh a token after authenticating", async () => {
    render(<AuthenticationForm />);

    expect(screen.getByRole("button")).toHaveTextContent("Authenticate");

    fireEvent.change(screen.getByPlaceholderText("Passphrase"), {
      target: {value: "Correct passphrase"},
    });

    fireEvent.submit(screen.getByText("Authenticate"));

    expect(
      await screen.findByRole("button", {name: "Refresh token"})
    ).toBeInTheDocument();
  });

  it("tells the user if their password was incorrect", async () => {
    render(<AuthenticationForm />);

    fireEvent.change(screen.getByPlaceholderText("Passphrase"), {
      target: {value: "An incorrect passphrase"},
    });

    fireEvent.submit(screen.getByText("Authenticate"));

    expect(
      await screen.findByText("The given password was incorrect")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Passphrase"), {
      target: {value: "Something weird"},
    });

    fireEvent.submit(screen.getByText("Authenticate"));

    expect(
      await screen.findByText("call the compucie", {exact: false})
    ).toBeInTheDocument();
  });
});
