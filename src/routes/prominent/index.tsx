import {useSelectMember} from "../../components/orders-context";
import {useActiveBoardMembers, useMostRecentBoards} from "../../queries/boards";
import {sortBy} from "lodash";
import {MemberType} from "../../queries/members";
import {BoardMember} from "../../queries/boards";
import Member from "./../../components/member-button";

type Props = {
  prominent: MemberType[];
  boards: BoardMember[][];
  selectMember: (member: MemberType) => void;
};

const Prominent = ({prominent, boards, selectMember}: Props) => (
  <div className="prominentGrid">
    <div className="prominentRow" aria-label="prominent members">
      {prominent.map((member) => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </div>
    <div className="boardsRow">
      {boards.map((members, idx) => (
        <div className="boardColumn" key={idx} aria-label="board">
          {sortBy(members, (member: any) => member.function)
            .reverse()
            .map((member: any) => (
              <Member
                member={member.member}
                key={member.member.id}
                onClick={selectMember}
              />
            ))}
        </div>
      ))}
    </div>
  </div>
);

const ProminentScreen = () => {
  const boards = useMostRecentBoards();
  const prominent = useActiveBoardMembers();
  const selectMember = useSelectMember();

  return <Prominent boards={boards} prominent={prominent} selectMember={selectMember} />;
};

export default ProminentScreen;
