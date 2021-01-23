import React from "react";
import AuthenticationForm from "./AuthenticationForm";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import {mount} from "enzyme";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

describe("<AuthenticationForm />", () => {
  it("shows a warning if the system is not authenticated", () => {
    const app = mount(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={null}
        request={false}
        error={undefined}
      />
    );

    expect(app.find('button[type="submit"]').text()).toContain("Authenticate");
  });

  it("is possible to refresh a token if a token is already present", () => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

    const app = mount(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={token}
        request={false}
        error={undefined}
      />
    );

    expect(app.find('button[type="submit"]').text()).toContain("Refresh token");
    expect(app.find('button[type="submit"]').find(FontAwesomeIcon).props().icon).toBe(
      "sync"
    );
  });

  it("shows a waiting message when authenticating", () => {
    const app = mount(
      <AuthenticationForm
        changePassword={jest.fn()}
        submit={jest.fn()}
        password={"password"}
        token={undefined}
        request={true}
        error={undefined}
      />
    );

    expect(app.find('button[type="submit"]').text()).toContain("Waiting");
  });

  describe("error messages", () => {
    it("tells the user if their password was incorrect", () => {
      const app = mount(
        <AuthenticationForm
          changePassword={jest.fn()}
          submit={jest.fn()}
          password={"password"}
          token={null}
          request={false}
          error={"Unauthorized"}
        />
      );

      expect(app.find(".invalid-feedback").length).toBe(1);
      expect(app.find(".invalid-feedback").text()).toContain("password");
    });

    it("tells the user if something went wrong on the server", () => {
      const app = mount(
        <AuthenticationForm
          changePassword={jest.fn()}
          submit={jest.fn()}
          password={"password"}
          token={null}
          request={false}
          error={"error"}
        />
      );

      expect(app.find(".invalid-feedback").length).toBe(1);
      expect(app.find(".invalid-feedback").text()).toContain("compucie");
    });
  });
});
