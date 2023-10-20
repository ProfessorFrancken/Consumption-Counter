import {useSelectedMember} from "../orders-context";
import {useCommittees} from "../../queries/committees";
import {NavLink, Route, Routes, useParams} from "react-router-dom";

const CommitteeTitle = () => {
  const params = useParams<{page: string}>();
  const {committees = []} = useCommittees();
  const selectedCommittee = committees.find(
    ({id}: any) => id === parseInt(params.page ?? "", 10)
  );

  return <span>{selectedCommittee ? selectedCommittee.name : "Unknown committee"}</span>;
};

const BuyProductsForMemberTitle = () => {
  const member = useSelectedMember();

  if (member === undefined) {
    console.warn("Tried rendering header for undefined member", member);
    return null;
  }

  return <span>{member.fullname}</span>;
};

const HeaderTitle = () => {
  return (
    <h1 className="titleName header-item h4 d-flex align-items-center font-weight-normal mb-0">
      <Routes>
        <Route path="/products/pricelist" Component={() => <span>Pricelist</span>} />
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

const ShowPriceList = () => {
  const member = useSelectedMember();

  if (!member) {
    return null;
  }

  return <NavLink to={`./pricelist?memberId=${member.id}`}>Show prices</NavLink>;
};
const GoBacToBuying = () => {
  const member = useSelectedMember();

  if (!member) {
    return null;
  }

  return <NavLink to={`/products?memberId=${member.id}`}>Buy products</NavLink>;
};

const Header = ({onClick, failedOrders}: any) => (
  <header className="header">
    <HeaderTitle />
    <div className="header-item d-flex justify-content-center">
      <Routes>
        <Route path="/products" element={<ShowPriceList />} />
        <Route path="/products/pricelist" element={<GoBacToBuying />} />
      </Routes>
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
