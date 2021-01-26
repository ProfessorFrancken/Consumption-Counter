import {useDispatch, useSelector} from "react-redux";
import {selectMember} from "../../actions";
import {recentBuyersSelector} from "./selectors";
import Members, {MemberType} from "./../Members/Members";

export default () => {
  const dispatch = useDispatch();
  const members = useSelector(recentBuyersSelector);

  return (
    <Members
      members={members}
      selectMember={(member: MemberType) => dispatch(selectMember(member))}
    />
  );
};
