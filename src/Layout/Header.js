import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { committeesSelector, orderSelector } from 'selectors';

const CommitteeTitle = ({
  match: {
    params: { page }
  }
}) => {
  const committees = useSelector(committeesSelector);
  const selectedCommittee = committees.find(
    ({ id }) => id === parseInt(page, 10)
  );

  return (
    <span>
      {selectedCommittee ? selectedCommittee.name : 'Unkown committee'}
    </span>
  );
};

const BuyProductsForMemberTitle = ({
  match: {
    params: { page }
  }
}) => {
  const order = useSelector(orderSelector);

  return <span>{order.member.fullname}</span>;
};

const HeaderTitle = () => (
  <div className="titleName header-item">
    <Route exact path="/pricelist" render={() => <span>Pricelist</span>} />
    <Route exact path="/settings" render={() => <span>Settings</span>} />
    <Route exact path="/prominent" render={() => <span>Prominent</span>} />
    <Route exact path="/recent" render={() => <span>Recent</span>} />
    <Route exact path="/committees" render={() => <span>Committees</span>} />
    <Route exact path="/statistics" render={() => <span>Statistics</span>} />
    <Route exact path="/screensaver" render={() => <span>Screensaver</span>} />
    <Route exact path="/committees/:page(\d+)" component={CommitteeTitle} />
    <Route exact path="/products" component={BuyProductsForMemberTitle} />
    <Route exact path="/present" render={() => <span>Present</span>} />
  </div>
);

const Header = ({ onClick, failedOrders }) => (
  <div className="header">
    <HeaderTitle />
    <div className="header-item">
      <Route
        exact
        path="/products"
        render={() => (
          <NavLink exact to="/pricelist">
            Show prices
          </NavLink>
        )}
      />
      <Route
        exact
        path="/pricelist"
        render={() => (
          <NavLink exact to="/products">
            Buy products
          </NavLink>
        )}
      />
    </div>
    <div className="association header-item text-right" onClick={onClick}>
      T.F.V. 'Professor Francken'
    </div>
    {failedOrders > 0 && (
      <div className="ml-3">
        <NavLink exact to="/settings">
          <div className="badge badge-danger">{failedOrders}</div>
        </NavLink>
      </div>
    )}
  </div>
);

export default Header;
