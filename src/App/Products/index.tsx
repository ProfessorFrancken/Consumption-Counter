import Products from "./Products";
import {useOrder} from "./OrdersContext";

const ProductsScreen = () => {
  const {products, addProductToOrder, addProductToOrderOrMakeOrder} = useOrder();

  return (
    <Products
      products={products}
      addProductToOrder={addProductToOrder}
      addProductToOrderOrMakeOrder={addProductToOrderOrMakeOrder}
    />
  );
};

export default ProductsScreen;
