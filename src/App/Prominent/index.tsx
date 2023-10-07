import Prominent from "./Prominent";
import {useSelectMember} from "App/Products/OrdersContext";
import {useActiveBoardMembers, useMostRecentBoards} from "./BoardsContext";

const ProminentScreen = () => {
  const boards = useMostRecentBoards();
  const prominent = useActiveBoardMembers();
  const selectMember = useSelectMember();

  return <Prominent boards={boards} prominent={prominent} selectMember={selectMember} />;
};

export default ProminentScreen;
