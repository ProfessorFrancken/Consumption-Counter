import React from "react";
import PropTypes from "prop-types";
import Price from "./Price";

const Product = ({product}: any) => (
  <button
    className="button tile"
    style={{
      backgroundImage: `url(${product.image})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
    }}
  >
    <div className="productAmountOverlay">
      <div className="productAmount">
        <Price price={product.price} />
      </div>
    </div>
  </button>
);

const Category = ({category, onClick, toggle, name}: any) => (
  <nav className="categoryRow">
    {category.products.map((product: any) => (
      <Product product={product} key={product.id} />
    ))}
  </nav>
);

type PriceListProps = {
  products: {
    Bier: ProductPropType[];
    Fris: ProductPropType[];
    Eten: ProductPropType[];
  };
};

const PriceList = ({products}: PriceListProps) => {
  const beer = products["Bier"];
  const drinks = products["Fris"];
  const food = products["Eten"];

  return (
    <div className="productsGrid">
      <Category category={{name: "Beer", products: beer}} />
      <Category category={{name: "Drinks", products: drinks}} />
      <Category category={{name: "Food", products: food}} />
    </div>
  );
};

type ProductPropType = {
  id: number;
  name: string;
  price: number;
};

const ProductPropType: PropTypes.Requireable<ProductPropType> = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
});

export default PriceList;
