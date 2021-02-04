import React from "react";
import Price from "App/Price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";
import {useOrder} from "App/Products/OrdersContext";

const BuyAll = () => {
  const {buyAll, order} = useOrder();
  const {pathname} = useLocation();

  if (pathname !== "/products") {
    return null;
  }

  if (order.products.length === 0) {
    return null;
  }

  return (
    <button className="button buyAllButton" onClick={() => buyAll()}>
      <FontAwesomeIcon icon={"check-circle"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        Buy it all! (<Price products={order.products} />)
      </span>
    </button>
  );
};

export default BuyAll;
