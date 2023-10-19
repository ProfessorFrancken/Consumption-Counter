import React from "react";
import {UseMutateFunction, useMutation} from "@tanstack/react-query";
import AuthenticationForm from "./AuthenticationForm";
import api from "./../../../api";
import useLocalStorage from "App/useLocalStorage";
import {UnauthenticatedLayout} from "App/UnauthenticatedLayout";

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
      setToken({token});
      return token;
    } catch (e) {
      // @ts-expect-error This is a known limitation
      throw new Error(e.response.statusText as string);
    }
  };

  return useMutation<string, Error, string>({
    mutationKey: ["login"],
    mutationFn: login,
  });
}

export const AuthenticationProvider: React.FC<{
  token?: string;
  children: React.ReactNode;
}> = ({token: defaultToken, ...props}) => {
  //
  const [{token}, setToken] = useLocalStorage("plus_one_authorization", {
    token: defaultToken,
  });

  const login = useLogin(setToken);

  const value = {
    request: login.isPending,
    token: token,
    error: login.isError && login.error !== null ? login.error.message : null,
    authenticate: login.mutate,
  };

  if (!value.token) {
    return (
      <AuthenticationContext.Provider value={value} {...props}>
        <UnauthenticatedLayout>
          <h1>Francken Consumption Counter</h1>
          <AuthenticationForm {...value} />
        </UnauthenticatedLayout>
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
