import {useDispatch, useSelector} from "react-redux";
import {selectMember} from "actions";
import {membersInCommitteesSelector} from "./../selectors";
import Members, {MemberType} from "App/Members/Members";
import {useParams} from "react-router";

const SelectMemberFromCommitteeScreen = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const members = useSelector((state) => membersInCommitteesSelector(state, params));

  return (
    <Members
      members={members}
      selectMember={(member: MemberType) => dispatch(selectMember(member))}
    />
  );
};

export default SelectMemberFromCommitteeScreen;
