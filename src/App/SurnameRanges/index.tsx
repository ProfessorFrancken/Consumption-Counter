import SurnameRanges from "./SurnameRanges";
import {useHistory} from "react-router";
import {useGroupedSurnames} from "App/Members/Context";

const SurnameRangesScreen = () => {
  const {push} = useHistory();
  const groupedSurnames = useGroupedSurnames();

  const selectRange = (range: any) => push(`/members/${range.idx}`);

  return <SurnameRanges ranges={groupedSurnames} selectRange={selectRange} />;
};

export default SurnameRangesScreen;
