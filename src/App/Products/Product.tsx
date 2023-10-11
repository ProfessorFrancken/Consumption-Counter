import React from "react";
import {useOnLongPress} from "./OnLongPress";
import {Product as ProductType, useOrder} from "./OrdersContext";

const AmountBeingOrdered = ({amount}: {amount: number}) => {
  return (
    <div className="productAmountOverlay">
      <div className="productAmount">
        <span aria-label="amount ordered">{amount}</span>
      </div>
    </div>
  );
};

const ProductName = ({product}: any) => <span>{product.name}</span>;

const isProductLocked = (product: ProductType, hour: number) => {
  if (product.category === "Bier") {
    if (["Almanak", "Almanac"].includes(product.name)) {
      return false;
    }

    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hour);
  }

  if (product.name === "Goede morgen!") {
    return ![6, 7, 8, 9, 10, 11].includes(hour);
  }

  return false;
};

const Product = ({
  product,
  onLongPress,
  onClick,
}: {
  product: ProductType;
  onClick: () => void;
  onLongPress: () => void;
}) => {
  const handlers = useOnLongPress({onClick, onLongPress});
  const {order} = useOrder();
  const orderAmount = order.products.filter(({id}) => id === product.id).length;

  const hour = new Date().getHours();
  const locked = isProductLocked(product, hour);

  return (
    <button
      aria-label={`Buy ${product.name} ${locked ? "(disabled)" : ""}`}
      className={"button tile " + (locked ? "locked" : "")}
      style={{
        backgroundImage: `url(${product.image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
      {...handlers}
    >
      {orderAmount === 0 ? (
        <ProductName product={product} amount={orderAmount} />
      ) : (
        <AmountBeingOrdered amount={orderAmount} />
      )}
    </button>
  );
};

export default Product;
