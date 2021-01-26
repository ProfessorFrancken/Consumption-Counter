import React from "react";
import PropTypes from "prop-types";
import Product from "./Product";

const Category = ({products, onClick, toggle, name, locked}: any) => (
  <nav className={"categoryRow"} aria-label={`${name} category`}>
    {products.map((product: any) => (
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

export type ProductsType = {
  Bier: ProductPropType[];
  Fris: ProductPropType[];
  Eten: ProductPropType[];
};
type ProductsProps = {
  products: ProductsType;
  addProductToOrder: (...args: any[]) => any;
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'toggle' does not exist on type 'Products... Remove this comment to see the full error message
const Products = ({products, addProductToOrder, toggle}: ProductsProps) => {
  const beer = products["Bier"] || [];
  const soda = products["Fris"] || [];
  const food = products["Eten"] || [];

  return (
    <div className="productsGrid">
      {beer.length > 0 && (
        <Category
          name="beer"
          onClick={addProductToOrder}
          toggle={toggle}
          products={beer}
          locked={false}
        />
      )}
      {soda.length > 0 && (
        <Category
          name="soda"
          onClick={addProductToOrder}
          toggle={toggle}
          products={soda}
        />
      )}
      {food.length > 0 && (
        <Category
          name="food"
          onClick={addProductToOrder}
          toggle={toggle}
          products={food}
        />
      )}
    </div>
  );
};

export type ProductPropType = {
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
