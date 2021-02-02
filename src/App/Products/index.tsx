import Products from "./Products";
import {useProductPurchase} from "./Context";

const ProductsScreen = () => {
  const {addProductToOrder, productsWithHour, toggle} = useProductPurchase();

  return (
    <Products
      products={productsWithHour}
      addProductToOrder={addProductToOrder}
      toggle={toggle}
    />
  );
};

export default ProductsScreen;
