import React from "react";
import {Product as ProductType} from "./Context";
import Product from "./Product";

const Category = ({products, onClick, toggle, name, locked}: any) => (
  <nav className={"categoryRow"} aria-label={`${name} category`}>
    {products.map((product: any) => (
      <Product
        key={product.id}
        product={product}
        onClick={() => onClick(product)}
        onLongPress={() => toggle(product)}
        locked={product.locked || locked}
      />
    ))}
  </nav>
);

export type ProductPropType = {
  id: number;
  name: string;
  image: string;
};

export type ProductsType = {
  Bier: ProductPropType[];
  Fris: ProductPropType[];
  Eten: ProductPropType[];
};
type ProductsProps = {
  products: ProductsType;
  addProductToOrder: (product: ProductType) => any;
  toggle: (product: ProductType) => void;
};

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

export default Products;
