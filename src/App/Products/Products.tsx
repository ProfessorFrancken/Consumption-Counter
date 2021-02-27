import React from "react";
import {AvailableProduct} from "./OrdersContext";
import Product from "./Product";

const Category = ({
  products,
  onClick,
  onLongPress,
  name,
}: {
  products: AvailableProduct[];
  onClick: (product: AvailableProduct) => void;
  onLongPress: (product: AvailableProduct) => void;
  name: string;
}) => (
  <nav className={"categoryRow"} aria-label={`${name} category`}>
    {products.map((product) => (
      <Product
        key={product.id}
        product={product}
        onClick={() => onClick(product)}
        onLongPress={() => onLongPress(product)}
        locked={product.locked}
      />
    ))}
  </nav>
);

export type ProductsType = {
  Bier: AvailableProduct[];
  Fris: AvailableProduct[];
  Eten: AvailableProduct[];
};
type ProductsProps = {
  products: ProductsType;
  addProductToOrder: (product: AvailableProduct) => void;
  addProductToOrderOrMakeOrder: (product: AvailableProduct) => void;
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
