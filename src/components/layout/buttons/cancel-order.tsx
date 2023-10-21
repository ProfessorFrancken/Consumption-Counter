import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProductsPrice from "../../products-price";
import {useQueuedOrders} from "../../../components/orders/queued-orders-context";
import {useOrder} from "../../../components/orders-context";

const products = (order: any) => {
  return order.products.length === 1 ? order.products[0].name : "multiple products";
};

const CancelOrder = () => {
  const {queuedOrder} = useQueuedOrders();
  const {cancelOrder} = useOrder();

  if (queuedOrder === null) {
    return null;
  }

  return (
    <button className="button cancelButton" onClick={() => cancelOrder()}>
      <FontAwesomeIcon icon={"times-circle"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        Cancel buying {products(queuedOrder.order)} for{" "}
        <ProductsPrice products={queuedOrder.order.products} />
      </span>
    </button>
  );
};

export default CancelOrder;
