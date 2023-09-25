import SurnameRanges from "./SurnameRanges";
import {useNavigate} from "react-router";
import {useGroupedSurnames} from "App/Members/Context";

const SurnameRangesScreen = () => {
  const navigate = useNavigate();
  const groupedSurnames = useGroupedSurnames();

  const selectRange = (range: any) => navigate(`/members/${range.idx}`);

  return <SurnameRanges ranges={groupedSurnames} selectRange={selectRange} />;
};

export default SurnameRangesScreen;
