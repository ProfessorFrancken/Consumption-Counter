import Committees from "./Committees";
import {useCommittees} from "./CommitteesContext";

const CommitteesScreen = () => {
  const {selectCommittee, committees = []} = useCommittees();

  return <Committees committees={committees} selectCommittee={selectCommittee} />;
};

export default CommitteesScreen;
