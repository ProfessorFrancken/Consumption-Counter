import {screen} from "@testing-library/react";
import AuthenticationForm from "./AuthenticationForm";
import {render} from "test-utils";

describe("<AuthenticationForm />", () => {
  it("shows a warning if the system is not authenticated", () => {
    render(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={null}
        request={false}
        error={undefined}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Authenticate");
  });

  it("is possible to refresh a token if a token is already present", () => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

    render(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={token}
        request={false}
        error={undefined}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Refresh token");
  });

  it("shows a waiting message when authenticating", () => {
    render(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={undefined}
        request={true}
        error={undefined}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Waiting");
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });

  describe("error messages", () => {
    it("tells the user if their password was incorrect", () => {
      render(
        <AuthenticationForm
          changePassword={jest.fn()}
          submit={jest.fn()}
          password={"password"}
          token={null}
          request={false}
          error={"Unauthorized"}
        />
      );

      expect(screen.getByText("The given password was incorrect")).toBeInTheDocument();
    });

    it("tells the user if something went wrong on the server", () => {
      render(
        <AuthenticationForm
          changePassword={jest.fn()}
          submit={jest.fn()}
          password={"password"}
          token={null}
          request={false}
          error={"error"}
        />
      );

      expect(screen.getByText("call the compucie", {exact: false})).toBeInTheDocument();
    });
  });
});
