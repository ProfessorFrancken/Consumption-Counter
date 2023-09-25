import React from "react";
import {useOrder} from "App/Products/OrdersContext";
import {useCommittees} from "App/Committees/CommitteesContext";
import {NavLink, Route, Routes, useParams} from "react-router-dom";

const CommitteeTitle = ({}: any) => {
  const params = useParams<{page: string}>();
  const {committees = []} = useCommittees();
  const selectedCommittee = committees.find(
    ({id}: any) => id === parseInt(params.page ?? "", 10)
  );

  return <span>{selectedCommittee ? selectedCommittee.name : "Unknown committee"}</span>;
};

const BuyProductsForMemberTitle = () => {
  const {order} = useOrder();

  if (order.member === undefined) {
    console.warn("Tried rendering header for undefined member", order);
    return null;
  }

  return <span>{order.member.fullname}</span>;
};

const HeaderTitle = () => {
  return (
    <h1 className="titleName header-item h4 d-flex align-items-center font-weight-normal mb-0">
      <Routes>
        <Route path="/pricelist" Component={() => <span>Pricelist</span>} />
        <Route path="/settings" Component={() => <span>Settings</span>} />
        <Route path="/prominent" Component={() => <span>Prominent</span>} />
        <Route path="/recent" Component={() => <span>Recent</span>} />
        <Route path="/committees" Component={() => <span>Committees</span>} />
        <Route path="/statistics" Component={() => <span>Statistics</span>} />
        <Route path="/screensaver" Component={() => <span>Screensaver</span>} />
        <Route path="/committees/:page" element={<CommitteeTitle />} />
        <Route path="/products" element={<BuyProductsForMemberTitle />} />
        <Route path="/present" Component={() => <span>Present</span>} />
      </Routes>
    </h1>
  );
};

const Header = ({onClick, failedOrders}: any) => (
  <header className="header">
    <HeaderTitle />
    <div className="header-item d-flex justify-content-center">
      <Routes>
        <Route
          path="/products"
          Component={() => <NavLink to="/pricelist">Show prices</NavLink>}
        />
        <Route
          path="/pricelist"
          Component={() => <NavLink to="/products">Buy products</NavLink>}
        />
      </Routes>
    </div>
    <h2
      className="association header-item text-right h4 d-flex align-items-center font-weight-normal mb-0"
      onClick={onClick}
    >
      T.F.V. 'Professor Francken'
    </h2>
    {failedOrders > 0 && (
      <div className="ml-3">
        <NavLink to="/settings">
          <div className="badge badge-danger">{failedOrders}</div>
        </NavLink>
      </div>
    )}
  </header>
);

export default Header;
