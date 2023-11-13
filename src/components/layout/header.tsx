import {useSelectedMember} from "../orders-context";
import {useCommittees} from "../../queries/committees";
import {NavLink, useLocation, useMatches, useParams} from "react-router-dom";
import {ReactNode} from "react";
import {useFailedOrders} from "components/orders/queued-orders-context";

export const CommitteeTitle = () => {
  const params = useParams<{page: string}>();
  const {committees = []} = useCommittees();
  const selectedCommittee = committees.find(
    ({id}) => id === parseInt(params.page ?? "", 10)
  );

  return <span>{selectedCommittee ? selectedCommittee.name : "Unknown committee"}</span>;
};

export const BuyProductsForMemberTitle = () => {
  const member = useSelectedMember();

  if (member === undefined) {
    console.warn("Tried rendering header for undefined member", member);
    return null;
  }

  return <span>{member.fullname}</span>;
};

const HeaderTitle = () => {
  const matches = useMatches();
  const lastMatch = matches.at(-1);

  if (lastMatch === undefined) {
    return (
      <h1 className="titleName header-item h4 d-flex align-items-center font-weight-normal mb-0">
        &nbsp;
      </h1>
    );
  }
  if (lastMatch.handle === undefined) {
    return (
      <h1 className="titleName header-item h4 d-flex align-items-center font-weight-normal mb-0">
        &nbsp;
      </h1>
    );
  }

  const titleHandle = lastMatch.handle as {title: ReactNode};

  return (
    <h1 className="titleName header-item h4 d-flex align-items-center font-weight-normal mb-0">
      {titleHandle.title}
    </h1>
  );
};

const SubTitle = () => {
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  const member = useSelectedMember();
  const location = useLocation();

  if (lastMatch?.handle !== undefined) {
    const subTitleHandle = lastMatch.handle as {subTitle?: ReactNode};
    if (subTitleHandle.subTitle) {
      return <>{subTitleHandle.subTitle}</>;
    }
  }

  if (!member) {
    return null;
  }

  if (location.pathname.includes("pricelist")) {
    return (
      <div className="header-item d-flex justify-content-center">
        <NavLink to={`/products?memberId=${member.id}`}>Buy products</NavLink>
      </div>
    );
  }
  return (
    <div className="header-item d-flex justify-content-center">
      <NavLink to={`/products/pricelist?memberId=${member.id}`}>Show prices</NavLink>
    </div>
  );
};

const RightHeader = ({onClick}: {onClick: () => void}) => {
  const matches = useMatches();
  const lastMatch = matches.at(-1);

  if (lastMatch?.handle !== undefined) {
    const rightTitleHandle = lastMatch.handle as {rightTitle?: ReactNode};
    if (rightTitleHandle.rightTitle) {
      return <>{rightTitleHandle.rightTitle}</>;
    }
  }

  return (
    <h2 className="association text-right h4 font-weight-normal mb-0" onClick={onClick}>
      T.F.V. 'Professor Francken'
    </h2>
  );
};

const Header = ({onClick}: {onClick: () => void}) => {
  const failedOrders = useFailedOrders();

  return (
    <header className="header d-flex justify-content-between align-items-center">
      <HeaderTitle />
      <SubTitle />
      <div className="header-item d-flex align-items-center">
        <RightHeader onClick={onClick} />
        {failedOrders > 0 && (
          <div className="ms-2">
            <NavLink to="/settings">
              <div className="badge badge-danger">{failedOrders}</div>
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
