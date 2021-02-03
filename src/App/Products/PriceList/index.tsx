import {useProductPurchase} from "../Context";
import PriceList from "./PriceList";

const PriceListScreen = () => {
  const {products} = useProductPurchase();
  return <PriceList products={products} />;
};

export default PriceListScreen;
