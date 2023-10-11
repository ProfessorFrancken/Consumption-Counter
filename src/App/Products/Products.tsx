import React from "react";
import {
  Product as ProductType,
  useOrder,
  useOrderableProducts,
  useSelectedMember,
} from "./OrdersContext";
import Product from "./Product";

const Category = ({
  products,
  onClick,
  onLongPress,
  name,
}: {
  products: ProductType[];
  onClick: (product: ProductType) => void;
  onLongPress: (product: ProductType) => void;
  name: string;
}) => {
  return (
    <nav className={"categoryRow"} aria-label={`${name} category`}>
      {products.map((product) => {
        return (
          <Product
            key={product.id}
            product={product}
            onClick={() => onClick(product)}
            onLongPress={() => onLongPress(product)}
          />
        );
      })}
    </nav>
  );
};

const Products = () => {
  const {order, makeOrderMutation, addProductToOrder} = useOrder();
  const products = useOrderableProducts();

  const beer = products["Bier"] || [];
  const soda = products["Fris"] || [];
  const food = products["Eten"] || [];

  const hasPlacedATeporaryOrder = order.products.length > 0;

  const handleClick = (product: ProductType) => {
    if (hasPlacedATeporaryOrder) {
      addProductToOrder(product);
      return;
    }

    makeOrderMutation.mutate({products: [product]});
  };

  return (
    <div className="productsGrid">
      {beer.length > 0 && (
        <Category
          name="beer"
          onClick={handleClick}
          onLongPress={addProductToOrder}
          products={beer}
        />
      )}
      {soda.length > 0 && (
        <Category
          name="soda"
          onClick={handleClick}
          onLongPress={addProductToOrder}
          products={soda}
        />
      )}
      {food.length > 0 && (
        <Category
          name="food"
          onClick={handleClick}
          onLongPress={addProductToOrder}
          products={food}
        />
      )}
    </div>
  );
};

export default Products;
