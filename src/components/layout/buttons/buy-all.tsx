import ProductsPrice from "../../products-price";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";
import {useOrder, useSelectedMember} from "../../orders-context";

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
        Buy it all! (<ProductsPrice products={order.products} />)
      </span>
    </button>
  );
};

export default BuyAll;
