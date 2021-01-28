import {useDispatch, useSelector} from "react-redux";
import AuthenticationForm from "./AuthenticationForm";
import {useAuthentication} from "./Context";

export default () => {
  const authentication = useAuthentication();

  return <AuthenticationForm {...authentication} />;
};
