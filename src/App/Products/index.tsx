import {useDispatch, useSelector} from "react-redux";
import {addProductToOrder, buyMore} from "actions";
import {productsWithOrderCountSelector} from "./selectors";
import Products from "./Products";

export default () => {
  const dispatch = useDispatch();
  const products = useSelector((state: any) =>
    productsWithOrderCountSelector(state, {
      hour: new Date().getHours(),
    })
  );

  return (
    <Products
      /* @ts-expect-error FIXME: Requires better type control of selectors */
      products={products}
      addProductToOrder={(product: any) => dispatch(addProductToOrder(product))}
      toggle={(product: any) => dispatch(buyMore(product))}
    />
  );
};
