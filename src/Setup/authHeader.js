export function setHeader(token) {
  localStorage.setItem('plus_one_authorization', JSON.stringify({ token }));
}

export function authHeader() {
  // return authorization header with jwt token
  const encoded_token = localStorage.getItem('plus_one_authorization');

  if (encoded_token === undefined) {
    return {};
  }

  let token = JSON.parse(encoded_token);

  if (token) {
    return { Authorization: 'Bearer ' + token.token };
  } else {
    return {};
  }
}
