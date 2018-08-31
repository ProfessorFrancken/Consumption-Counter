import { authHeader } from './Setup/authHeader';
import axios from 'axios';

const api = process.env.REACT_APP_API_SERVER;

export default {
  get,
  post,
  put
};

function get(uri, params) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    params
  };

  return axios.get(api + uri, requestOptions).then(handleResponse);
}

function post(uri, body) {
  return axios
    .post(api + uri, body, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })
    .then(handleResponse);
}

function put(uri, body) {
  return axios
    .put(api + uri, body, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })
    .then(handleResponse);
}

function handleResponse(response) {
  return Promise.resolve(response.data);
}
