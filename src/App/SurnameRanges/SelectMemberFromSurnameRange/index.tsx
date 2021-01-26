import {useDispatch, useSelector} from "react-redux";
import {selectMember} from "actions";
import {membersInRangeSelector} from "selectors";
import Members, {MemberType} from "App/Members/Members";
import {useParams} from "react-router";

export default () => {
  const dispatch = useDispatch();
  const params = useParams();
  const members = useSelector((state: any) => membersInRangeSelector(state, params));

  return (
    <Members
      members={members}
      selectMember={(member: MemberType) => dispatch(selectMember(member))}
    />
  );
};
