import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {buyAll} from "actions";
import Price from "App/Price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";

const BuyAll = () => {
  const dispatch = useDispatch();
  const onClick = () => dispatch(buyAll());
  const products = useSelector((state: any) => state.order.products);
  const {pathname} = useLocation();

  if (pathname !== "/products") {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <button className="button buyAllButton" onClick={onClick}>
      <FontAwesomeIcon icon={"check-circle"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        Buy it all! (<Price products={products} />)
      </span>
    </button>
  );
};

export default BuyAll;
