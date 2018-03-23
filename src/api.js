import { authHeader } from './Setup/authHeader';

const api = process.env.REACT_APP_API_SERVER;

export default {
  get,
  post
};

function get(uri) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  };

  return fetch(api + uri, requestOptions).then(handleResponse);
}

function post(uri, body) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(body)
  };

  return fetch(api + uri, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
