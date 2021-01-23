import React from "react";

const Range = ({range, onClick}: any) => (
  <button className="button tile" onClick={() => onClick(range)}>
    {range.surname_start}
    <br />
    -<br />
    {range.surname_end}
  </button>
);

type SurnameRangesProps = {
  ranges: {
    members?: {}[];
    surname_start: string;
    surname_end: string;
  }[];
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'selectRange' does not exist on type 'Sur... Remove this comment to see the full error message
const SurnameRanges = ({ranges, selectRange}: SurnameRangesProps) => (
  <div className="tilesGrid">
    {ranges.map((range, idx) => (
      <Range range={range} onClick={selectRange} key={idx} />
    ))}
  </div>
);

export default SurnameRanges;
