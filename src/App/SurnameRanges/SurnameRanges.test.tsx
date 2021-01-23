import React from "react";
import SurnameRanges from "./SurnameRanges";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import {mount} from "enzyme";

describe("selecting a range of surnames", () => {
  it("shows a list of ranges of surnames the user can select", () => {
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ ranges: never[]; selectRange: () => void; ... Remove this comment to see the full error message
    const ranges = <SurnameRanges ranges={[]} selectRange={() => {}} />;

    const wrapper = mount(ranges);

    expect(wrapper.find("div").hasClass("tilesGrid")).toBe(true);
  });

  it("is possible to select a range", () => {
    const props = {
      ranges: [{range: [], surname_start: "A", surname_end: "B"}],
      selectRange: jest.fn(),
    };

    const ranges = <SurnameRanges {...props} />;
    const wrapper = mount(ranges);

    const range = wrapper.find("Range").first();
    range.simulate("click");

    expect(props.selectRange).toBeCalledWith({
      range: [],
      surname_start: "A",
      surname_end: "B",
    });
  });

  it("Renders all ranges", () => {
    const ranges = (
      <SurnameRanges
        ranges={[
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ range: never[]; surname_start: string; sur... Remove this comment to see the full error message
          {range: [], surname_start: "A", surname_end: "B"},
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ range: never[]; surname_start: string; sur... Remove this comment to see the full error message
          {range: [], surname_start: "C", surname_end: "D"},
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ range: never[]; surname_start: string; sur... Remove this comment to see the full error message
          {range: [], surname_start: "E", surname_end: "F"},
        ]}
        selectRange={() => {}}
      />
    );

    const wrapper = mount(ranges);
    expect(wrapper.find("Range").length).toBe(3);
  });
});
