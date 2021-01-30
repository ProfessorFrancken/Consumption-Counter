import {useSelector} from "react-redux";
import PriceList from "./PriceList";

const PriceListScreen = () => {
  const products = useSelector((state: any) => state.products);
  return <PriceList products={products} />;
};

export default PriceListScreen;
