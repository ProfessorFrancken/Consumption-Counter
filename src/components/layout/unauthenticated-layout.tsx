import {ReactNode} from "react";
import logo from "../../assets/logo.png";

export const UnauthenticatedLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <div className="d-flex align-items-center">
        <div className="mr-5">
          <img
            src={logo}
            className="franckenLogo img-fluid"
            width={225}
            alt="Logo of T.F.V. 'Professor Francken'"
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
