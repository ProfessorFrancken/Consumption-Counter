import AuthenticationForm from "./AuthenticationForm";
import {useAuthentication} from "./Context";

const AuthenticationScreen = () => {
  const authentication = useAuthentication();

  return <AuthenticationForm {...authentication} />;
};

export default AuthenticationScreen;
