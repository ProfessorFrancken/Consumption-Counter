import Products from "./Products";
import {useProductPurchase} from "./Context";

const ProductsScreen = () => {
  const {
    products,
    addProductToOrder,
    addProductToOrderOrMakeOrder,
  } = useProductPurchase();

  return (
    <Products
      products={products}
      addProductToOrder={addProductToOrder}
      addProductToOrderOrMakeOrder={addProductToOrderOrMakeOrder}
    />
  );
};

export default ProductsScreen;
