import React from "react";
import AuthenticationForm from "./AuthenticationForm";
import {render, fireEvent} from "test-utils";

describe("<AuthenticationForm />", () => {
  it("shows a warning if the system is not authenticated", () => {
    const {getByRole} = render(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={null}
        request={false}
        error={undefined}
      />
    );

    expect(getByRole("button")).toHaveTextContent("Authenticate");
  });

  it("is possible to refresh a token if a token is already present", () => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

    const {getByRole} = render(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={token}
        request={false}
        error={undefined}
      />
    );

    expect(getByRole("button")).toHaveTextContent("Refresh token");
  });

  it("shows a waiting message when authenticating", () => {
    const {getByRole} = render(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={undefined}
        request={true}
        error={undefined}
      />
    );

    expect(getByRole("button")).toHaveTextContent("Waiting");
    expect(getByRole("button")).toHaveAttribute("disabled");
  });

  describe("error messages", () => {
    fit("tells the user if their password was incorrect", () => {
      const {getByText} = render(
        <AuthenticationForm
          changePassword={jest.fn()}
          submit={jest.fn()}
          password={"password"}
          token={null}
          request={false}
          error={"Unauthorized"}
        />
      );

      expect(getByText("The given password was incorrect")).toBeVisible();
    });

    it("tells the user if something went wrong on the server", () => {
      const {getByText} = render(
        <AuthenticationForm
          changePassword={jest.fn()}
          submit={jest.fn()}
          password={"password"}
          token={null}
          request={false}
          error={"error"}
        />
      );

      expect(getByText("call the compucie")).toBeVisible();
    });
  });
});
