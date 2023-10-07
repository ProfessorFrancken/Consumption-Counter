import {useOrderableProducts} from "../OrdersContext";
import PriceList from "./PriceList";

const PriceListScreen = () => {
  const products = useOrderableProducts();

  return <PriceList products={products} />;
};

export default PriceListScreen;
