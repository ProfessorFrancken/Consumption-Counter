import React from "react";
import OnLongPress from "./OnLongPress";

const AmountBeingOrdered = ({product}: any) =>
  product.ordered > 0 ? (
    <div className="productAmountOverlay">
      <div className="productAmount">
        <span>{product.ordered}</span>
      </div>
    </div>
  ) : (
    ""
  );

const ProductName = ({product}: any) => <span>{product.name}</span>;

const Product = ({product, toggle, onClick, locked}: any) => (
  <OnLongPress onClick={() => onClick(product)} onLongPress={() => toggle(product)}>
    <button
      className={"button tile " + (locked ? "locked" : "")}
      style={{
        backgroundImage: `url(${product.image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
    >
      {/* @ts-expect-error ts-migrate(2786) FIXME: 'AmountBeingOrdered' cannot be used as a JSX compo... Remove this comment to see the full error message */}
      <AmountBeingOrdered product={product} />
      {product.ordered === 0 && <ProductName product={product} />}
    </button>
  </OnLongPress>
);

export default Product;
