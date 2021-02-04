import {useOrder} from "../OrdersContext";
import PriceList from "./PriceList";

const PriceListScreen = () => {
  const {products} = useOrder();
  return <PriceList products={products} />;
};

export default PriceListScreen;
