import {useCommittees} from "../../queries/committees";

export type Committee = {
  members?: {}[];
  id: number;
  name: string;
};

type CommitteesProps = {
  committees: Committee[];
  selectCommittee: (committee: Committee) => void;
};

const Committees = ({committees, selectCommittee}: CommitteesProps) => (
  <nav className="tilesGrid" aria-label="committees">
    {committees.map((committee, idx) => (
      <button
        key={idx}
        className="button tile"
        onClick={() => selectCommittee(committee)}
      >
        {committee.name}
      </button>
    ))}
  </nav>
);

const CommitteesScreen = () => {
  const {selectCommittee, committees = []} = useCommittees();

  return <Committees committees={committees} selectCommittee={selectCommittee} />;
};

export default CommitteesScreen;
