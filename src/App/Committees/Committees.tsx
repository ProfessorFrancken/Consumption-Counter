import React from "react";

const Committee = ({committee, onClick}: any) => (
  <button className="button tile" onClick={() => onClick(committee)}>
    {committee.name}
  </button>
);

type CommitteesProps = {
  committees: {
    members?: {}[];
    id: number;
    name: string;
  }[];
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'selectCommittee' does not exist on type ... Remove this comment to see the full error message
const Committees = ({committees, selectCommittee}: CommitteesProps) => (
  <nav className="tilesGrid">
    {committees.map((committee, idx) => (
      <Committee committee={committee} onClick={selectCommittee} key={idx} />
    ))}
  </nav>
);

export default Committees;
