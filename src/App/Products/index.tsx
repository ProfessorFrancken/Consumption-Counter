import Products from "./Products";
import {useProductPurchase} from "./Context";

const ProductsScreen = () => {
  const {
    addProductToOrder,
    productsWithHour,
    addProductToOrderOrMakeOrder,
  } = useProductPurchase();

  return (
    <Products
      products={productsWithHour}
      addProductToOrder={addProductToOrder}
      addProductToOrderOrMakeOrder={addProductToOrderOrMakeOrder}
    />
  );
};

export default ProductsScreen;
