import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import decode from "jwt-decode";
import moment from "moment";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router";

const Button = ({children, ...props}: any) => (
  <button className="btn btn-secondary mb-2" {...props} type="submit">
    {children}
  </button>
);

const authenticated = (token: any) => {
  const decoded = decode(token);
  const expiration = new Date((decoded as any).exp * 1000);
  return (
    <span>
      The system is authentiated until {moment(expiration).calendar()}. You can refresh
      the token by reauthenticating the system.
    </span>
  );
};

const unauthenticated = () => {
  return (
    <span>
      You need to authenticate with our server in order to connect the Consumption
      Counter.
    </span>
  );
};

const invalidFeedback = (error: string) => {
  return error === "Unauthorized"
    ? "The given password was incorrect"
    : "There probably was an unexpected error on the server, call the compucie to solve this.";
};

const AuthenticateButton = ({request, token}: any) => {
  if (request) {
    return <Button disabled>Waiting</Button>;
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

const AuthenticationForm = ({authenticate, token, request, error}: any) => {
  const {handleSubmit, register, errors} = useForm();
  const {push} = useHistory();

  const onSubmit = handleSubmit(({password}) => {
    authenticate(password, {
      onSuccess: () => {
        push("/loading");
      },
    });
  });

  return (
    <div>
      <p className="lead">
        {token ? authenticated(token) : unauthenticated()}
        <br />
        If you don't know the passphrase you should shout "Compucie!" or something
        similar.
      </p>
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="form-group col-lg-5 col-md-8 col-sm-10 col-12">
            <input
              type="password"
              name="password"
              placeholder="Passphrase"
              autoFocus
              className={error ? "form-control is-invalid" : "form-control"}
              ref={register({
                required: "Required",
                minLength: {
                  value: 6,
                  message: "That's not a good passphrase",
                },
              })}
            />
            {errors.password ? (
              <p className="invalid-feedback text-dark">{errors.password.message}</p>
            ) : null}

            {error ? <p className="invalid-feedback">{invalidFeedback(error)}</p> : null}
          </div>
          <div className="form-group col">
            <AuthenticateButton request={request} token={token} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuthenticationForm;
