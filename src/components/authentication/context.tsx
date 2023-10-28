import React from "react";
import {UseMutateFunction, useMutation} from "@tanstack/react-query";
import AuthenticationForm from "./authentication-form";
import api from "./../../api";
import {UnauthenticatedLayout} from "../layout/unauthenticated-layout";
import {useLocalStorage} from "usehooks-ts";
import {ErrorResponse} from "react-router";

export type State = {
  request: boolean;
  token: string | undefined;
  error: string | null;
  authenticate: UseMutateFunction<string, Error, string, unknown>;
};

const AuthenticationContext = React.createContext<State | undefined>(undefined);

function isErrorResponse(error: any): error is ErrorResponse {
  return (
    error != null &&
    typeof error.status === "number" &&
    typeof error.statusText === "string"
  );
}

function useLogin(setToken: ({token}: {token: string}) => void) {
  const login = async (password: string) => {
    try {
      const response = await api.post("/authenticate", {password});
      const token = response.token as string;
      setToken({token});

      return token;
    } catch (e) {
      if (isErrorResponse(e)) {
        throw new Error(e.statusText as string);
      }

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
  const value = useAuthentication(defaultToken);

  return (
    <AuthenticationContext.Provider value={value} {...props}>
      {value.token ? (
        props.children
      ) : (
        <UnauthenticatedLayout>
          <h1>Francken Consumption Counter</h1>
          <AuthenticationForm />
        </UnauthenticatedLayout>
      )}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = (defaultToken?: string) => {
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
  return value;
};
