import axios from "axios";

const api = process.env.REACT_APP_API_SERVER;

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

function get(uri: string, params?: any) {
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
