import React from "react";
import {TYPES} from "actions";
import {pick, maxBy} from "lodash";
import {useDispatch} from "react-redux";
import {MemberType} from "./Members/Members";
import {Order, Product} from "./Products/OrdersContext";
import api from "api";
import {useHistory} from "react-router";
import useLocalStorage from "./useLocalStorage";

type OrderedOrder = {
  ordered_at: number;
  products: Product[];
  member: MemberType;
};
export type QueuedOrder = {
  ordered_at: number;
  order: OrderedOrder;
  fails: number;
  state: "queued" | "requesting";
};

const orderTimeoutQueue = {} as any;
const useQueuedOrderState = (defaultQueuedOrders: QueuedOrder[] = []) => {
  const [queuedOrders, setQueuedOrders] = useLocalStorage(
    "plus_one_order_queue",
    defaultQueuedOrders
  );
  const dispatch = useDispatch();
  const {push} = useHistory();

  const buyOrder = async (order: OrderedOrder) => {
    const ordered_at = order.ordered_at;
    delete orderTimeoutQueue[ordered_at];

    setQueuedOrders((orders: QueuedOrder[]) =>
      orders.map((otherOrder) => {
        return otherOrder.ordered_at === order.ordered_at
          ? {...otherOrder, state: "requesting" as const}
          : otherOrder;
      })
    );

    const member = order.member;
    try {
      await api.post("/orders", {
        order: {
          member: pick(member, ["id", "firstName", "surname"]),
          products: order.products.map((product: any) =>
            pick(product, ["id", "name", "price"])
          ),
          ordered_at,
        },
      });

      setQueuedOrders((orders: QueuedOrder[]) =>
        orders.filter(({ordered_at}) => ordered_at !== order.ordered_at)
      );
      dispatch({type: TYPES.BUY_ORDER_SUCCESS, order});
    } catch (ex) {
      setQueuedOrders((orders: QueuedOrder[]) =>
        orders.map((otherOrder) => {
          return otherOrder.ordered_at === order.ordered_at
            ? {...otherOrder, fails: otherOrder.fails + 1, state: "queued" as const}
            : otherOrder;
        })
      );
    }
  };

  const makeOrder = (order: Order) => {
    const date = new Date();

    if (order.member === undefined) {
      throw new Error("Can't make an order without a member");
    }

    const orderedOrder = {...order, ordered_at: date.getTime()} as OrderedOrder;

    setQueuedOrders((orders: QueuedOrder[]) => {
      return [
        {
          ordered_at: orderedOrder.ordered_at,
          order: orderedOrder,
          fails: 0,
          state: "queued" as const,
        },
        ...orders,
      ];
    });

    push("/");

    orderTimeoutQueue[orderedOrder.ordered_at] = setTimeout(() => {
      buyOrder(orderedOrder);
    }, TIME_TO_CANCEL);
  };

  const cancelOrder = (order: OrderedOrder) => {
    clearTimeout(orderTimeoutQueue[order.ordered_at]);
    delete orderTimeoutQueue[order.ordered_at];

    setQueuedOrders((orders: QueuedOrder[]) =>
      orders.filter(({ordered_at}) => ordered_at !== order.ordered_at)
    );
  };

  return {
    queuedOrders,
    makeOrder,
    cancelOrder,
    buyOrder,
  };
};

export const TIME_TO_CANCEL = 7000;

type State = {
  queuedOrders: QueuedOrder[];
  queuedOrder: QueuedOrder | null;
  makeOrder: (order: Order) => void;
  buyOrder: (order: OrderedOrder) => void;
  cancelOrder: (order: OrderedOrder) => void;
};

const QueuedOrdersContext = React.createContext<State | undefined>(undefined);
export const QueuedOrdersProvider: React.FC<{
  queuedOrder?: QueuedOrder | null;
  queuedOrders?: QueuedOrder[];
}> = ({
  queuedOrder: defaultQueuedOrder = null,
  queuedOrders: defaultQueuedOrders = [],
  ...props
}) => {
  const {queuedOrders, makeOrder, buyOrder, cancelOrder} = useQueuedOrderState(
    defaultQueuedOrders.length === 0
      ? defaultQueuedOrder === null
        ? []
        : [{...defaultQueuedOrder, state: "queued" as const, fails: 0}]
      : defaultQueuedOrders
  );

  const queuedOrder =
    maxBy(
      queuedOrders.filter(({state}) => state === "queued"),
      (order) => order.ordered_at
    ) ?? null;

  return (
    <QueuedOrdersContext.Provider
      value={{
        queuedOrder: queuedOrder === undefined ? null : queuedOrder,
        queuedOrders,
        makeOrder,
        buyOrder,
        cancelOrder,
      }}
      {...props}
    />
  );
};

export const useQueuedOrders = () => {
  const context = React.useContext(QueuedOrdersContext);

  if (!context) {
    throw new Error(`useQueuedOrders must be used within a ProductPurchaseProvider`);
  }

  return context;
};

export const useBackgroundFromOrder = () => {
  const {queuedOrder: order} = useQueuedOrders();

  if (order === null) {
    return null;
  }

  const product = order.order.products.find((product) => product.splash_image !== null);

  return product === undefined ? null : product.splash_image;
};

export const useFailedOrders = () => {
  const {queuedOrders} = useQueuedOrders();

  return queuedOrders.filter((order) => order.fails > 0).length;
};
