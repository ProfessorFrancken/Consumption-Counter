import {useCommittees} from "../../queries/committees";

const CommitteeButton = ({committee, onClick}: any) => (
  <button className="button tile" onClick={() => onClick(committee)}>
    {committee.name}
  </button>
);

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
      <CommitteeButton committee={committee} onClick={selectCommittee} key={idx} />
    ))}
  </nav>
);

const CommitteesScreen = () => {
  const {selectCommittee, committees = []} = useCommittees();

  return <Committees committees={committees} selectCommittee={selectCommittee} />;
};

export default CommitteesScreen;
