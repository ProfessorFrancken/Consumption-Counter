import axios from "axios";

export const baseApi = process.env.REACT_APP_API_SERVER;

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

  return axios.get<T>(baseApi + uri, requestOptions).then(handleResponse);
}

async function post(uri: any, body: any) {
  return axios
    .post(baseApi + uri, body, {
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
