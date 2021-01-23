import React from "react";
import PropTypes from "prop-types";
import Product from "./Product";

const Category = ({category, onClick, toggle, name, locked}: any) => (
  <nav className={"categoryRow"}>
    {category.map((product: any) => (
      <Product
        product={product}
        onClick={onClick}
        toggle={toggle}
        key={product.id}
        locked={product.locked || locked}
      />
    ))}
  </nav>
);

type ProductsProps = {
  products: {
    Bier: ProductPropType[];
    Fris: ProductPropType[];
    Eten: ProductPropType[];
  };
  addProductToOrder: (...args: any[]) => any;
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'toggle' does not exist on type 'Products... Remove this comment to see the full error message
const Products = ({products, addProductToOrder, toggle}: ProductsProps) => {
  const beer = products["Bier"] || [];
  const drinks = products["Fris"] || [];
  const food = products["Eten"] || [];

  return (
    <div className="productsGrid">
      {beer.length > 0 && (
        <Category
          onClick={addProductToOrder}
          toggle={toggle}
          category={beer}
          locked={false}
        />
      )}
      {drinks.length > 0 && (
        <Category onClick={addProductToOrder} toggle={toggle} category={drinks} />
      )}
      {food.length > 0 && (
        <Category onClick={addProductToOrder} toggle={toggle} category={food} />
      )}
    </div>
  );
};

type ProductPropType = {
  id: number;
  name: string;
  image: string;
};

const ProductPropType: PropTypes.Requireable<ProductPropType> = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
});

export default Products;
