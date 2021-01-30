import {useSelector} from "react-redux";
import SurnameRanges from "./SurnameRanges";
import {rangesSelector} from "./../../selectors";
import {useHistory} from "react-router";

export default () => {
  const {push} = useHistory();
  const ranges = useSelector(rangesSelector);
  const selectRange = (range: any) => push(`/members/${range.idx}`);

  return <SurnameRanges ranges={ranges} selectRange={selectRange} />;
};
