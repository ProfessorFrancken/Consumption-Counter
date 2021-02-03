import React from "react";
import {Product as ProductType} from "./Context";
import Product from "./Product";

const Category = ({products, onClick, onLongPress, name, locked}: any) => (
  <nav className={"categoryRow"} aria-label={`${name} category`}>
    {products.map((product: any) => (
      <Product
        key={product.id}
        product={product}
        onClick={() => onClick(product)}
        onLongPress={() => onLongPress(product)}
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
  addProductToOrderOrMakeOrder: (product: ProductType) => any;
};

const Products = ({
  products,
  addProductToOrder,
  addProductToOrderOrMakeOrder,
}: ProductsProps) => {
  const beer = products["Bier"] || [];
  const soda = products["Fris"] || [];
  const food = products["Eten"] || [];

  return (
    <div className="productsGrid">
      {beer.length > 0 && (
        <Category
          name="beer"
          onClick={addProductToOrderOrMakeOrder}
          onLongPress={addProductToOrder}
          products={beer}
          locked={false}
        />
      )}
      {soda.length > 0 && (
        <Category
          name="soda"
          onClick={addProductToOrderOrMakeOrder}
          onLongPress={addProductToOrder}
          products={soda}
        />
      )}
      {food.length > 0 && (
        <Category
          name="food"
          onClick={addProductToOrderOrMakeOrder}
          onLongPress={addProductToOrder}
          products={food}
        />
      )}
    </div>
  );
};

export default Products;
