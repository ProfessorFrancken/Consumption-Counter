import React from "react";

const RangeButton = ({range, onClick}: any) => (
  <button className="button tile" onClick={() => onClick(range)}>
    {range.surname_start}
    <br />
    -<br />
    {range.surname_end}
  </button>
);

type Range = {
  idx: number;
  members?: {}[];
  surname_start: string;
  surname_end: string;
};
type SurnameRangesProps = {
  ranges: Range[];
  selectRange: (range: Range) => void;
};

const SurnameRanges = ({ranges, selectRange}: SurnameRangesProps) => (
  <div className="tilesGrid">
    {ranges.map((range, idx) => (
      <RangeButton range={range} onClick={selectRange} key={range.idx} />
    ))}
  </div>
);

export default SurnameRanges;
