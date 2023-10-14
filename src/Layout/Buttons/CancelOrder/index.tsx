import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Price from "App/Price";
import {useQueuedOrders} from "App/QueuedOrdersContext";
import {useOrder} from "App/Products/OrdersContext";

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
        <Price products={queuedOrder.order.products} />
      </span>
    </button>
  );
};

export default CancelOrder;
