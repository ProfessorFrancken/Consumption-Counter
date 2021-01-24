import React from "react";
import SurnameRanges from "./SurnameRanges";
import {render, fireEvent} from "test-utils";

describe("selecting a range of surnames", () => {
  it("shows a list of ranges of surnames the user can select", () => {
    const wrapper = render(
      <SurnameRanges
        ranges={[{idx: 0, members: [], surname_start: "A", surname_end: "B"}]}
        selectRange={() => {}}
      />
    );

    expect(wrapper.getByRole("button")).toHaveTextContent("A-B");
  });

  it("is possible to select a range", () => {
    const selectRange = jest.fn();

    const {getByRole} = render(
      <SurnameRanges
        ranges={[{idx: 0, members: [], surname_start: "A", surname_end: "B"}]}
        selectRange={selectRange}
      />
    );

    fireEvent.click(getByRole("button"));

    expect(selectRange).toBeCalledWith({
      idx: 0,
      members: [],
      surname_start: "A",
      surname_end: "B",
    });
  });

  it("Renders all ranges", () => {
    const {getAllByRole} = render(
      <SurnameRanges
        ranges={[
          {idx: 0, members: [], surname_start: "A", surname_end: "B"},
          {idx: 1, members: [], surname_start: "C", surname_end: "D"},
          {idx: 2, members: [], surname_start: "E", surname_end: "F"},
        ]}
        selectRange={() => {}}
      />
    );

    expect(getAllByRole("button")).toHaveLength(3);
  });
});
