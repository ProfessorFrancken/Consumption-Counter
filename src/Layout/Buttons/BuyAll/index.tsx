import React from "react";
import Price from "App/Price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";
import {useProductPurchase} from "App/Products/Context";

const BuyAll = () => {
  const {buyAll} = useProductPurchase();
  const {order} = useProductPurchase();
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
