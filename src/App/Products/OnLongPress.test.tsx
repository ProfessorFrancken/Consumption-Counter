import React from "react";
import {render, fireEvent, act} from "test-utils";
import OnLongPress from "./OnLongPress";

describe("<OnLongPress>", () => {
  beforeEach(() => jest.useFakeTimers());

  it("simulates normal clicks", () => {
    const wasClicked = jest.fn();
    const wasLongPressed = jest.fn();

    const {getByRole} = render(
      <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed}>
        <button>Hoi</button>
      </OnLongPress>
    );

    fireEvent.mouseDown(getByRole("button"));
    fireEvent.mouseUp(getByRole("button"));

    expect(wasClicked).toBeCalled();
    expect(wasLongPressed).not.toBeCalled();

    expect(wasClicked).toBeCalledTimes(1);
    expect(wasLongPressed).toBeCalledTimes(0);
  });

  it("records long pressed clicks", () => {
    const wasClicked = jest.fn();
    const wasLongPressed = jest.fn();

    const {getByRole} = render(
      <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed} timeout={100}>
        <button>Hoi</button>
      </OnLongPress>
    );

    fireEvent.mouseDown(getByRole("button"));
    act(() => {
      jest.runTimersToTime(100);
    });
    fireEvent.mouseUp(getByRole("button"));

    expect(wasClicked).not.toBeCalled();
    expect(wasLongPressed).toBeCalled();

    expect(wasClicked).toBeCalledTimes(0);
    expect(wasLongPressed).toBeCalledTimes(1);
  });

  describe("should also work on touch screens", () => {
    it("simulates normal clicks", () => {
      const wasClicked = jest.fn();
      const wasLongPressed = jest.fn();

      const {getByRole} = render(
        <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed}>
          <button>Hoi</button>
        </OnLongPress>
      );

      fireEvent.touchStart(getByRole("button"));
      fireEvent.touchEnd(getByRole("button"));

      expect(wasClicked).toBeCalled();
      expect(wasLongPressed).not.toBeCalled();

      expect(wasClicked).toBeCalledTimes(1);
      expect(wasLongPressed).toBeCalledTimes(0);
    });

    it("records long pressed clicks", () => {
      const wasClicked = jest.fn();
      const wasLongPressed = jest.fn();

      const {getByRole} = render(
        <OnLongPress onClick={wasClicked} onLongPress={wasLongPressed} timeout={100}>
          <button>Hoi</button>
        </OnLongPress>
      );

      fireEvent.touchStart(getByRole("button"));
      act(() => {
        jest.runTimersToTime(100);
      });
      fireEvent.touchEnd(getByRole("button"));

      expect(wasClicked).not.toBeCalled();
      expect(wasLongPressed).toBeCalled();

      expect(wasClicked).toBeCalledTimes(0);
      expect(wasLongPressed).toBeCalledTimes(1);
    });
  });
});
