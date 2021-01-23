export function setHeader(token: any) {
  localStorage.setItem("plus_one_authorization", JSON.stringify({token}));
}

export function authHeader() {
  // return authorization header with jwt token
  const encoded_token = localStorage.getItem("plus_one_authorization");

  if (encoded_token === undefined) {
    return {};
  }

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
  let token = JSON.parse(encoded_token);

  if (token) {
    return {Authorization: "Bearer " + token.token};
  } else {
    return {};
  }
}
