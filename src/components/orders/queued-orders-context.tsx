import React from "react";
import {pick, maxBy} from "lodash";
import {MemberType} from "../../queries/members";
import {Product} from "../orders-context";
import api from "api";
import useLocalStorage from "./../../utils/use-local-storage";

export type OrderedOrder = {
  ordered_at: number;
  products: Product[];
  member: MemberType;
};

export type QueuedOrder = {
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

  const dequeQueuedOrder = (order: OrderedOrder) => {
    setQueuedOrders((orders: QueuedOrder[]) =>
      orders.filter(({order: {ordered_at}}) => ordered_at !== order.ordered_at)
    );
  };

  const buyOrder = async (order: OrderedOrder) => {
    const ordered_at = order.ordered_at;
    delete orderTimeoutQueue[ordered_at];

    setQueuedOrders((orders: QueuedOrder[]) =>
      orders.map((otherOrder) => {
        return otherOrder.order.ordered_at === order.ordered_at
          ? {...otherOrder, state: "requesting" as const}
          : otherOrder;
      })
    );

    try {
      await api.post("/orders", {
        order: {
          member: pick(order.member, ["id", "firstName", "surname"]),
          products: order.products.map((product) =>
            pick(product, ["id", "name", "price"])
          ),
          ordered_at,
        },
      });
      dequeQueuedOrder(order);
    } catch (ex) {
      setQueuedOrders((orders: QueuedOrder[]) =>
        orders.map((otherOrder) => {
          return otherOrder.order.ordered_at === order.ordered_at
            ? {...otherOrder, fails: otherOrder.fails + 1, state: "queued" as const}
            : otherOrder;
        })
      );

      throw ex;
    }
  };

  // TODO: rewrite put this into OrdersContext, and make QueuedOrders a fallback for
  // failed orders instead
  const makeOrder = (order: OrderedOrder) => {
    setQueuedOrders((orders: QueuedOrder[]) => {
      return [{order, fails: 0, state: "queued" as const}, ...orders];
    });
  };

  const cancelOrder = (order: OrderedOrder) => {
    clearTimeout(orderTimeoutQueue[order.ordered_at]);
    delete orderTimeoutQueue[order.ordered_at];
    dequeQueuedOrder(order);
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
  makeOrder: (order: OrderedOrder) => void;
  buyOrder: (order: OrderedOrder) => Promise<void>;
  cancelOrder: (order: OrderedOrder) => void;
};

const QueuedOrdersContext = React.createContext<State | undefined>(undefined);
export const QueuedOrdersProvider: React.FC<{
  queuedOrder?: QueuedOrder | null;
  queuedOrders?: QueuedOrder[];
  children: React.ReactNode;
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
      ({order}) => order.ordered_at
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
