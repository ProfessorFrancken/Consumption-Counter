import {useSelector} from "react-redux";
import {boardsSelector, prominentSelector} from "./selectors";
import Prominent from "./Prominent";
import {useOrder} from "App/Products/OrdersContext";

const ProminentScreen = () => {
  const boards = useSelector((state: any) => boardsSelector(state));
  const prominent = useSelector((state: any) => prominentSelector(state));
  const {selectMember} = useOrder();

  return <Prominent boards={boards} prominent={prominent} selectMember={selectMember} />;
};

export default ProminentScreen;
