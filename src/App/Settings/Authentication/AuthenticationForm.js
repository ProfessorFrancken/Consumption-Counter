import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import decode from 'jwt-decode';
import moment from 'moment';

const Button = ({ children, ...props }) => (
  <button className="btn btn-secondary mb-2" {...props} type="submit">
    {children}
  </button>
);

const authenticated = token => {
  const decoded = decode(token);
  const expiration = new Date(decoded.exp * 1000);

  return (
    <span>
      The system is authentiated until {moment(expiration).calendar()}. You can
      refresh the token by reauthenticating the system.
    </span>
  );
};

const unauthenticated = () => {
  return (
    <span>
      You need to authenticate with our server in order to connect the Plus One
      system.
    </span>
  );
};

const invalidFeedback = error => {
  return error === 'Unauthorized'
    ? 'The given password was incorrect'
    : 'There probably was an unexpected error on the server, call the compucie to solve this.';
};

const AuthenticateButton = ({ request, token }) => {
  if (request) {
    return <Button>Waiting</Button>;
  }

  if (token) {
    return (
      <Button>
        <FontAwesomeIcon icon="sync" className="mr-1" />
        Refresh token
      </Button>
    );
  }

  return (
    <Button>
      <FontAwesomeIcon icon="key" className="mr-1" />
      Authenticate
    </Button>
  );
};

const AuthenticationForm = ({
  changePassword,
  submit,
  password,
  token,
  request,
  error
}) => {
  return (
    <div className="mb-5 p-3 bg-light">
      <h2 className="h4 font-weight-normal">
        {token ? null : (
          <FontAwesomeIcon icon="exclamation-triangle" className="mr-1" />
        )}{' '}
        Authenticate Plus One
      </h2>
      <p className="lead">
        {token ? authenticated(token) : unauthenticated()}
        <br />
        If you don't know the passphrase you should shout "Compucie!" or
        something similar.
      </p>
      <form onSubmit={submit}>
        <div className="row">
          <div className="form-group col-lg-5 col-md-8 col-sm-10 col-12">
            <input
              type="password"
              value={password}
              onChange={changePassword}
              className={error ? 'form-control is-invalid' : 'form-control'}
              placeholder="Passphrase"
            />
            {error ? (
              <p className="invalid-feedback">{invalidFeedback(error)}</p>
            ) : null}
          </div>
        </div>
        <AuthenticateButton request={request} token={token} />
      </form>
    </div>
  );
};

export default AuthenticationForm;
