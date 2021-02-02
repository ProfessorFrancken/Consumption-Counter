import {useSelector} from "react-redux";
import {boardsSelector, prominentSelector} from "./selectors";
import Prominent from "./Prominent";
import {useProductPurchase} from "App/Products/Context";

const ProminentScreen = () => {
  const boards = useSelector((state: any) => boardsSelector(state));
  const prominent = useSelector((state: any) => prominentSelector(state));
  const {selectMember} = useProductPurchase();
  return <Prominent boards={boards} prominent={prominent} selectMember={selectMember} />;
};

export default ProminentScreen;
