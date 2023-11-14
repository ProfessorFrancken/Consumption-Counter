import axios, {isAxiosError} from "axios";
import {json} from "react-router-dom";
import {BASE_API} from "./configuration";

export const baseApi = BASE_API;

function authHeader() {
  // return authorization header with jwt token
  const encoded_token = localStorage.getItem("plus_one_authorization");

  if (encoded_token === undefined || encoded_token === null) {
    return {};
  }

  let token = JSON.parse(encoded_token);

  if (token) {
    return {Authorization: "Bearer " + token.token};
  } else {
    return {};
  }
}

async function get<T extends unknown>(uri: string, params?: any): Promise<T> {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    params,
  };

  try {
    const response = await axios.get<T>(baseApi + uri, requestOptions);

    return handleResponse(response);
  } catch (error) {
    if (isAxiosError(error)) {
      throw json({message: error.message}, {status: error.response?.status});
    }

    throw error;
  }
}

async function post(uri: any, body: any) {
  try {
    const response = await axios.post(baseApi + uri, body, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    return handleResponse(response);
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response;
    }

    throw error;
  }
}

function handleResponse(response: any) {
  return Promise.resolve(response.data);
}

const apiMethods = {get, post};

export default apiMethods;
