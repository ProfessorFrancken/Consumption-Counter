import {useSelectedMember} from "../orders-context";
import {useCommittees} from "../../queries/committees";
import {NavLink, useLocation, useMatches, useParams} from "react-router-dom";
import {ReactNode} from "react";

export const CommitteeTitle = () => {
  const params = useParams<{page: string}>();
  const {committees = []} = useCommittees();
  const selectedCommittee = committees.find(
    ({id}: any) => id === parseInt(params.page ?? "", 10)
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
    return null;
  }
  if (lastMatch.handle === undefined) {
    return null;
  }

  const titleHandle = lastMatch.handle as {title: ReactNode};

  return (
    <h1 className="titleName header-item h4 d-flex align-items-center font-weight-normal mb-0">
      {titleHandle.title}
    </h1>
  );
};

const GoBackToBuying = () => {
  const member = useSelectedMember();
  const location = useLocation();

  if (!member) {
    return null;
  }

  if (location.pathname.includes("pricelist")) {
    return <NavLink to={`/products?memberId=${member.id}`}>Buy products</NavLink>;
  }
  return <NavLink to={`/products/pricelist?memberId=${member.id}`}>Show prices</NavLink>;
};

const Header = ({onClick, failedOrders}: any) => (
  <header className="header">
    <HeaderTitle />
    <div className="header-item d-flex justify-content-center">
      <GoBackToBuying />
    </div>
    <h2
      className="association header-item text-right h4 d-flex align-items-center font-weight-normal mb-0"
      onClick={onClick}
    >
      T.F.V. 'Professor Francken'
    </h2>
    {failedOrders > 0 && (
      <div className="ms-2">
        <NavLink to="/settings">
          <div className="badge badge-danger">{failedOrders}</div>
        </NavLink>
      </div>
    )}
  </header>
);

export default Header;
