import React from "react";
import {useOnLongPress} from "./OnLongPress";
import {AvailableProduct} from "./OrdersContext";

const AmountBeingOrdered = ({product}: {product: AvailableProduct}) =>
  product.ordered > 0 ? (
    <div className="productAmountOverlay">
      <div className="productAmount">
        <span aria-label="amount ordered">{product.ordered}</span>
      </div>
    </div>
  ) : null;

const ProductName = ({product}: any) => <span>{product.name}</span>;

const Product = ({
  product,
  onLongPress,
  onClick,
  locked,
}: {
  product: AvailableProduct;
  onClick: () => void;
  onLongPress: () => void;
  locked: boolean;
}) => {
  const handlers = useOnLongPress({onClick, onLongPress});

  return (
    <button
      aria-label={`Buy ${product.name}`}
      className={"button tile " + (locked ? "locked" : "")}
      style={{
        backgroundImage: `url(${product.image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
      disabled={locked}
      {...handlers}
    >
      <AmountBeingOrdered product={product} />
      {product.ordered === 0 && <ProductName product={product} />}
    </button>
  );
};

export default Product;
