import React from "react";
import {UseMutateFunction, useMutation} from "react-query";
import AuthenticationForm from "./AuthenticationForm";
import logo from "assets/logo.png";
import api from "./../../../api";
import {useLocalStorage} from "@rehooks/local-storage";

type State = {
  request: boolean;
  token: string | undefined;
  error: string | null;
  authenticate: UseMutateFunction<string, Error, string, unknown>;
};

const AuthenticationContext = React.createContext<State | undefined>(undefined);

function useApi() {
  return api;
}

function useLogin(setToken: ({token}: {token: string}) => void) {
  const api = useApi();
  const login = async (password: string) => {
    try {
      const response = await api.post("/authenticate", {password});
      const token = response.token as string;
      return token;
    } catch (e) {
      throw new Error(e.response.statusText as string);
    }
  };

  return useMutation<string, Error, string>("login", login, {
    onSuccess: (token: string) => {
      setToken({token});
    },
  });
}

export const AuthenticationProvider: React.FC<{token?: string}> = ({
  token: defaultToken,
  ...props
}) => {
  //
  const [{token}, setToken] = useLocalStorage("plus_one_authorization", {
    token: defaultToken,
  });

  const login = useLogin(setToken);

  const value = {
    request: login.isLoading,
    token: token,
    error: login.isError && login.error !== null ? login.error.message : null,
    authenticate: login.mutate,
  };

  if (!value.token) {
    return (
      <AuthenticationContext.Provider value={value} {...props}>
        <div className="d-flex align-items-center justify-content-center h-100">
          <div className="d-flex align-items-center">
            <div className="mr-5">
              <img
                src={logo}
                className="franckenLogo img-fluid"
                width={225}
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
};

export const useAuthentication = () => {
  const context = React.useContext(AuthenticationContext);

  if (!context) {
    throw new Error(`useAuthentication must be used within a AuthenticationProvider`);
  }

  return context;
};
