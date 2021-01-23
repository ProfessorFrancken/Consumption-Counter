import React from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {connect} from "react-redux";
import {buyAll} from "actions";
import Price from "App/Price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {useLocation} from "react-router-dom";

const BuyAll = ({buyAll, products = []}: any) => {
  const {pathname} = useLocation();

  if (pathname !== "/products") {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <button className="button buyAllButton" onClick={buyAll}>
      <FontAwesomeIcon icon={"check-circle"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        Buy it all! (<Price products={products} />)
      </span>
    </button>
  );
};

const mapStateToProps = ({order}: any) => ({
  products: order.products,
});

const mapDispatchToProps = (dispatch: any) => ({
  buyAll: () => dispatch(buyAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyAll);
