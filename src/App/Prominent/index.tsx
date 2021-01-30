import {useDispatch, useSelector} from "react-redux";
import {selectMember} from "../../actions";
import {boardsSelector, prominentSelector} from "./selectors";
import Prominent from "./Prominent";
import {MemberType} from "App/Members/Members";

const ProminentScreen = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state: any) => boardsSelector(state));
  const prominent = useSelector((state: any) => prominentSelector(state));
  return (
    <Prominent
      boards={boards}
      prominent={prominent}
      selectMember={(member: MemberType) => dispatch(selectMember(member))}
    />
  );
};

export default ProminentScreen;
