import {useDispatch, useSelector} from "react-redux";
import {authenticate} from "../../../actions";
import AuthenticationForm from "./AuthenticationForm";

export default () => {
  const dispatch = useDispatch();
  const authentication = useSelector((state: any) => state.authentication);

  return (
    <AuthenticationForm
      authenticate={(password: string) => dispatch(authenticate(password))}
      {...authentication}
    />
  );
};
