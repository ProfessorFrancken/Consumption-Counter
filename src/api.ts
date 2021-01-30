import {authHeader} from "./Setup/authHeader";
import axios from "axios";

const api = process.env.REACT_APP_API_SERVER;

function get(uri: any, params: any) {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    params,
  };

  return axios.get(api + uri, requestOptions).then(handleResponse);
}

function post(uri: any, body: any) {
  return axios
    .post(api + uri, body, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    })
    .then(handleResponse);
}

function handleResponse(response: any) {
  return Promise.resolve(response.data);
}

const apiMethods = {get, post};

export default apiMethods;
