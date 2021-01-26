import {useDispatch, useSelector} from "react-redux";
import SurnameRanges from "./SurnameRanges";
import {selectRangeOfSurnames} from "./../../actions";
import {rangesSelector} from "./../../selectors";

export default () => {
  const dispatch = useDispatch();
  const ranges = useSelector(rangesSelector);

  return (
    <SurnameRanges
      ranges={ranges}
      selectRange={(range: any) => dispatch(selectRangeOfSurnames(range))}
    />
  );
};
