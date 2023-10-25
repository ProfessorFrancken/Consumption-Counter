import {useNavigate} from "react-router";
import {useGroupedSurnames} from "../queries/members";
import {MemberType} from "../queries/members";

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
    {ranges.map((range) => (
      <button className="button tile" onClick={() => selectRange(range)} key={range.idx}>
        {range.surname_start}
        <br />
        -<br />
        {range.surname_end}
      </button>
    ))}
  </div>
);

const SurnameRangesScreen = () => {
  const navigate = useNavigate();
  const groupedSurnames = useGroupedSurnames();

  const selectRange = (range: {idx: number}) => navigate(`/members/${range.idx}`);

  return <SurnameRanges ranges={groupedSurnames} selectRange={selectRange} />;
};

export default SurnameRangesScreen;
