import * as React from "react";
import {render} from "@testing-library/react";
import {useTransactions} from "./TransactionsContext";

describe("Transaction context", () => {
  const SelectTransaction: React.FC = () => {
    useTransactions();

    return null;
  };

  it("Requires the TransactionsProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectTransaction />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockReset();
    spy.mockRestore();
  });

  // it only shows current active members
});
