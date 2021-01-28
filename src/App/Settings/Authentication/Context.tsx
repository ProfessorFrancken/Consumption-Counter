import {fetchInitialData} from "actions";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setHeader} from "Setup/authHeader";
import AuthenticationForm from "./AuthenticationForm";
import logo from "assets/logo.png";

type State = {
  request: boolean;
  token: string;
  error?: string;
  authenticate: (passphrase: string) => void;
};

const AuthenticationContext = React.createContext<State | undefined>(undefined);

const TYPES = {
  AUTHENTICATE_REQUEST: "AUTHENTICATE_REQUEST",
  AUTHENTICATE_SUCCESS: "AUTHENTICATE_SUCCESS",
  AUTHENTICATE_FAILURE: "AUTHENTICATE_FAILURE",
};

function login(password: any) {
  return (dispatch: any, getState: any, api: any) => {
    dispatch({
      type: TYPES.AUTHENTICATE_REQUEST,
      password,
    });

    return api
      .post("/authenticate", {password})
      .then((response: any) => {
        setHeader(response.token);
        dispatch({
          type: TYPES.AUTHENTICATE_SUCCESS,
          token: response.token,
        });
        dispatch(fetchInitialData());
      })
      .catch((ex: any) => dispatch({type: TYPES.AUTHENTICATE_FAILURE, error: ex}));
  };
}

export function AuthenticationProvider({...props}) {
  const dispatch = useDispatch();
  const authentication = useSelector((state: any) => state.authentication);

  const value = {
    request: authentication.request,
    token: authentication.token,
    error: authentication.error,
    authenticate: (passphrase: string) => dispatch(login(passphrase)),
  };

  if (false && !authentication.token) {
    return (
      <AuthenticationContext.Provider value={value} {...props}>
        <div className="d-flex align-items-center justify-content-center h-100">
          <div className="d-flex align-items-center">
            <div className="px-4">
              <img
                src={logo}
                className="franckenLogo img-fluid"
                width={200}
                alt="Logo of T.F.V. 'Professor Francken'"
              />
            </div>
            <div>
              <h1>Francken Consumption Counter</h1>
              <AuthenticationForm {...value} />
            </div>
          </div>
        </div>
      </AuthenticationContext.Provider>
    );
  }

  return <AuthenticationContext.Provider value={value} {...props} />;
}

export const useAuthentication = () => {
  const context = React.useContext(AuthenticationContext);

  if (!context) {
    throw new Error(`useAuthentication must be used within a AuthenticationProvider`);
  }

  return context;
};
