import {useSelector} from "react-redux";
import PriceList from "./PriceList";

export default () => {
  const products = useSelector((state: any) => state.products);
  return <PriceList products={products} />;
};
