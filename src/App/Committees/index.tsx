import {useDispatch, useSelector} from "react-redux";
import {selectCommittee} from "actions";
import {committeesWithMembersSelector} from "./selectors";
import Committees, {Committee} from "./Committees";

const CommitteesScreen = () => {
  const dispatch = useDispatch();
  const committees = useSelector(committeesWithMembersSelector);

  return (
    <Committees
      committees={committees}
      selectCommittee={(committee: Committee) => dispatch(selectCommittee(committee))}
    />
  );
};

export default CommitteesScreen;
