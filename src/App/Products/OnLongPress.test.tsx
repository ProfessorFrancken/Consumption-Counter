import React from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import {mount} from "enzyme";
import OnLongPress from "./OnLongPress";

describe("<OnLongPress>", () => {
  beforeEach(() => jest.useFakeTimers());

  it("simulates normal clicks", () => {
    const wasClicked = jest.fn();
    const wasLongPressed = jest.fn();

    const onLongPress = mount(
      <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed}>
        <button>Hoi</button>
      </OnLongPress>
    );

    onLongPress.find("button").simulate("mouseDown").simulate("mouseUp");

    expect(wasClicked).toBeCalled();
    expect(wasLongPressed).not.toBeCalled();
  });

  it("records long pressed clicks", () => {
    const wasClicked = jest.fn();
    const wasLongPressed = jest.fn();

    const onLongPress = mount(
      <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed} timeout={100}>
        <button>Hoi</button>
      </OnLongPress>
    );

    onLongPress.find("button").simulate("mouseDown");

    jest.runTimersToTime(100);

    onLongPress.find("button").simulate("mouseUp");

    expect(wasClicked).not.toBeCalled();
    expect(wasLongPressed).toBeCalled();
  });

  describe("should also work on touch screens", () => {
    it("simulates normal clicks", () => {
      const wasClicked = jest.fn();
      const wasLongPressed = jest.fn();

      const onLongPress = mount(
        <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed}>
          <button>Hoi</button>
        </OnLongPress>
      );

      onLongPress.find("button").simulate("touchStart").simulate("touchEnd");

      expect(wasClicked).toBeCalled();
      expect(wasLongPressed).not.toBeCalled();
    });

    it("records long pressed clicks", () => {
      const wasClicked = jest.fn();
      const wasLongPressed = jest.fn();

      const onLongPress = mount(
        <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed} timeout={100}>
          <button>Hoi</button>
        </OnLongPress>
      );

      onLongPress.find("button").simulate("touchStart");

      jest.runTimersToTime(100);

      onLongPress.find("button").simulate("touchEnd");

      expect(wasClicked).not.toBeCalled();
      expect(wasLongPressed).toBeCalled();
    });
  });
});
