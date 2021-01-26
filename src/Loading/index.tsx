import {useSelector} from "react-redux";
import {loadingScreenSelector} from "./selectors";
import LoadingScreen from "./LoadingScreen";

export default () => {
  const props = useSelector(loadingScreenSelector);

  return <LoadingScreen {...props} />;
};
