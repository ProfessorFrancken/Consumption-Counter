import React from "react";
import {render, fireEvent, screen} from "@testing-library/react";
import useLocalStorage from "./use-local-storage";

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
    render(<Component />);

    const btn = screen.getByRole("button", {name: "initial text"});
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(screen.getByRole("button", {name: "hoi"})).toBeInTheDocument();
  });

  it("Returns the initial value if localstorage has invalid state", () => {
    localStorage.setItem(key, JSON.stringify({text: "test"}));

    render(<Component />);

    const btn = screen.getByRole("button", {name: "test"});
    expect(btn).toBeInTheDocument();
  });

  it("Shows a warning if reading local storage failed", () => {
    localStorage.setItem(key, "test{");
    const spy = jest.spyOn(console, "warn").mockImplementation();

    render(<Component />);

    const btn = screen.getByRole("button", {name: "initial text"});
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

    render(<Component />);

    const btn = screen.getByRole("button", {name: "initial text"});
    expect(btn).toBeInTheDocument();

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockReset();
    spy.mockRestore();

    storageSpy.mockReset();
    storageSpy.mockRestore();
  });
});
