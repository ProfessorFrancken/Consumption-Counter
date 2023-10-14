import SurnameRanges from "./SurnameRanges";
import {render, fireEvent, screen} from "test-utils";

describe("selecting a range of surnames", () => {
  it("shows a list of ranges of surnames the user can select", () => {
    render(
      <SurnameRanges
        ranges={[{idx: 0, members: [], surname_start: "A", surname_end: "B"}]}
        selectRange={() => {}}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("A-B");
  });

  it("is possible to select a range", () => {
    const selectRange = jest.fn();

    render(
      <SurnameRanges
        ranges={[{idx: 0, members: [], surname_start: "A", surname_end: "B"}]}
        selectRange={selectRange}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(selectRange).toBeCalledWith({
      idx: 0,
      members: [],
      surname_start: "A",
      surname_end: "B",
    });
  });

  it("Renders all ranges", () => {
    render(
      <SurnameRanges
        ranges={[
          {idx: 0, members: [], surname_start: "A", surname_end: "B"},
          {idx: 1, members: [], surname_start: "C", surname_end: "D"},
          {idx: 2, members: [], surname_start: "E", surname_end: "F"},
        ]}
        selectRange={() => {}}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
