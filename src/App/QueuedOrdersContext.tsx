import {TYPES} from "actions";
import {pick, sortBy} from "lodash";
import React, {useReducer} from "react";
import {useDispatch} from "react-redux";
import {MemberType} from "./Members/Members";
import {Order, Product} from "./Products/OrdersContext";
import api from "api";
import {useHistory} from "react-router";

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

type Action =
  | {type: "BUY_ORDER_REQUEST"; order: OrderedOrder}
  | {type: "BUY_ORDER_REQUEST_SUCCESS"; order: OrderedOrder}
  | {type: "BUY_ORDER_REQUEST_FAILURE"; order: OrderedOrder}
  | {type: "QUEUE_ORDER"; order: OrderedOrder}
  | {type: "CANCEL_ORDER"; order: OrderedOrder};

type QueuedOrderState = QueuedOrder[];

const orderTimeoutQueue = {} as any;
const useQueuedOrderState = (defaultQueuedOrders: QueuedOrder[] = []) => {
  const [queuedOrders, dispatch] = useReducer(
    (state: QueuedOrderState, action: Action) => {
      switch (action.type) {
        case "QUEUE_ORDER":
          return [
            {
              ordered_at: action.order.ordered_at,
              order: action.order,
              fails: 0,
              state: "queued" as const,
            },
            ...state,
          ];
        case "BUY_ORDER_REQUEST":
          return state.map((order) => {
            return order.ordered_at === action.order.ordered_at
              ? {...order, state: "requesting" as const}
              : order;
          });
        case "BUY_ORDER_REQUEST_SUCCESS":
          return [
            ...state.filter((order) => order.ordered_at !== action.order.ordered_at),
          ];
        case "CANCEL_ORDER":
          return [
            ...state.filter((order) => order.ordered_at !== action.order.ordered_at),
          ];
        case "BUY_ORDER_REQUEST_FAILURE":
          return state.map((order) => {
            return order.ordered_at === action.order.ordered_at
              ? {...order, fails: order.fails + 1, state: "queued" as const}
              : order;
          });
        default:
          return state;
      }
    },
    defaultQueuedOrders
  );
  const globalDispatch = useDispatch();

  const {push} = useHistory();

  const buyOrder = async (order: OrderedOrder) => {
    const ordered_at = order.ordered_at;
    delete orderTimeoutQueue[ordered_at];

    dispatch({type: "BUY_ORDER_REQUEST", order});

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
      dispatch({type: "BUY_ORDER_REQUEST_SUCCESS", order});
      globalDispatch({type: TYPES.BUY_ORDER_SUCCESS, order});
    } catch (ex) {
      dispatch({type: "BUY_ORDER_REQUEST_FAILURE", order});
    }
  };

  const makeOrder = (order: Order) => {
    const date = new Date();

    if (order.member === undefined) {
      throw new Error("Can't make an order without a member");
    }

    const orderedOrder = {...order, ordered_at: date.getTime()} as OrderedOrder;

    dispatch({type: "QUEUE_ORDER", order: orderedOrder});

    push("/");

    orderTimeoutQueue[orderedOrder.ordered_at] = setTimeout(() => {
      buyOrder(orderedOrder);
    }, TIME_TO_CANCEL);
  };

  const cancelOrder = (order: OrderedOrder) => {
    clearTimeout(orderTimeoutQueue[order.ordered_at]);
    delete orderTimeoutQueue[order.ordered_at];

    dispatch({type: "CANCEL_ORDER", order});
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

  const queuedOrdersf = queuedOrders.filter((order) => order.state === "queued");
  const newQueuedOrder =
    queuedOrdersf.length > 0
      ? sortBy(queuedOrdersf, (order) => order.ordered_at)[0]
      : null;

  return (
    <QueuedOrdersContext.Provider
      value={{
        queuedOrder: newQueuedOrder,
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
