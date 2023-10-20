import {useNavigate} from "react-router";
import {useGroupedSurnames} from "../queries/members";
import {MemberType} from "../queries/members";

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
  members?: MemberType[];
  surname_start: string;
  surname_end: string;
};
type SurnameRangesProps = {
  ranges: Range[];
  selectRange: (range: Range) => void;
};

export const SurnameRanges = ({ranges, selectRange}: SurnameRangesProps) => (
  <div className="tilesGrid">
    {ranges.map((range, idx) => (
      <RangeButton range={range} onClick={selectRange} key={range.idx} />
    ))}
  </div>
);

const SurnameRangesScreen = () => {
  const navigate = useNavigate();
  const groupedSurnames = useGroupedSurnames();

  const selectRange = (range: any) => navigate(`/members/${range.idx}`);

  return <SurnameRanges ranges={groupedSurnames} selectRange={selectRange} />;
};

export default SurnameRangesScreen;
