import Price from "App/Price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";
import {useOrder, useSelectedMember} from "App/Products/OrdersContext";

const BuyAll = () => {
  const member = useSelectedMember();
  const {order, makeOrderMutation} = useOrder();
  const {pathname} = useLocation();

  if (!pathname.includes("/products")) {
    return null;
  }

  if (order.products.length === 0) {
    return null;
  }

  return (
    <button
      className="button buyAllButton"
      onClick={() => {
        if (member) {
          makeOrderMutation.mutate({...order, member});
        }
      }}
    >
      <FontAwesomeIcon icon={"check-circle"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        Buy it all! (<Price products={order.products} />)
      </span>
    </button>
  );
};

export default BuyAll;
