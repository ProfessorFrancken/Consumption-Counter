import React from "react";
import {render, fireEvent} from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage", () => {
  const key = "consumption_counter_test_text";

  afterEach(() => {
    localStorage.removeItem(key);
  });

  const Component = () => {
    const [{text}, setText] = useLocalStorage(key, {text: "initial text"});

    const onClick = () => setText({text: "hoi"});

    return <button onClick={onClick}>{text}</button>;
  };

  it("Acts like use state", () => {
    const {getByRole} = render(<Component />);

    const btn = getByRole("button", {name: "initial text"});
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(getByRole("button", {name: "hoi"})).toBeInTheDocument();
  });

  it("Returns the initial value if localstorage has invalid state", () => {
    localStorage.setItem(key, JSON.stringify({text: "test"}));

    const {getByRole} = render(<Component />);

    const btn = getByRole("button", {name: "test"});
    expect(btn).toBeInTheDocument();
  });

  it("Shows a warning if reading local storage failed", () => {
    localStorage.setItem(key, "test{");
    const spy = jest.spyOn(console, "warn").mockImplementation();

    const {getByRole} = render(<Component />);

    const btn = getByRole("button", {name: "initial text"});
    expect(btn).toBeInTheDocument();

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockReset();
    spy.mockRestore();
  });

  it("Shows a warning if setting local storage failed", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation();
    const storageSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("TEST");
    });

    const {getByRole} = render(<Component />);

    const btn = getByRole("button", {name: "initial text"});
    expect(btn).toBeInTheDocument();

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockReset();
    spy.mockRestore();

    storageSpy.mockReset();
    storageSpy.mockRestore();
  });
});
