import {TYPES} from "actions";
import {pick} from "lodash";
import React, {useReducer} from "react";
import {useDispatch, useSelector} from "react-redux";
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
  | {type: "QUEUE_ORDER"; order: any}
  | {type: "CANCEL_ORDER"; order: any};

type QueuedOrderState = {
  queuedOrders: QueuedOrder[];
  queuedOrder: null | QueuedOrder;
};

export function queuedOrders(state: QueuedOrder[] = [], action: any) {
  switch (action.type) {
    case TYPES.QUEUE_ORDER:
      return [
        {
          ordered_at: action.order.ordered_at,
          order: action.order,
          fails: 0,
          state: "queued",
        },
        ...state,
      ];
    case TYPES.BUY_ORDER_REQUEST:
      return state.map((order) => {
        return (order as any).ordered_at === action.order.ordered_at
          ? {...order, state: "requesting"}
          : order;
      });
    case TYPES.BUY_ORDER_SUCCESS:
    case TYPES.CANCEL_ORDER:
      return [
        ...state.filter((order) => (order as any).ordered_at !== action.order.ordered_at),
      ];
    case TYPES.BUY_ORDER_FAILURE:
      return state.map((order) => {
        return (order as any).ordered_at === action.order.ordered_at
          ? {...order, fails: order.fails + 1, state: "queued"}
          : order;
      });
    default:
      return state;
  }
}

const useQueuedOrderState = (
  defaultQueuedOrder: QueuedOrder | null = null,
  defaultQueuedOrders: QueuedOrder[] = []
) => {
  const [state, dispatch] = useReducer(
    (state: QueuedOrderState, action: Action) => {
      switch (action.type) {
        case "QUEUE_ORDER":
          return {
            queuedOrder: {
              ordered_at: action.order.ordered_at,
              order: action.order,
              fails: 0,
              state: "queued" as const,
            },
            queuedOrders: state.queuedOrders,
          };
        case "BUY_ORDER_REQUEST":
          if (state.queuedOrder === null) {
            return {
              queuedOrder: null,
              queuedOrders: state.queuedOrders,
            };
          }

          return {
            queuedOrder:
              state.queuedOrder.ordered_at === action.order.ordered_at
                ? null
                : state.queuedOrder,
            queuedOrders: state.queuedOrders,
          };
        case "CANCEL_ORDER":
          return {
            queuedOrder: null,
            queuedOrders: state.queuedOrders,
          };
        default:
          return state;
      }

      return {
        queuedOrder: null, //queuedOrderReducer(state.queuedOrder, action),
        queuedOrders: [], //queuedOrdersReducer(state.queuedOrders, action),
      };
    },
    {queuedOrders: defaultQueuedOrders, queuedOrder: defaultQueuedOrder}
  );
  const globalDispatch = useDispatch();

  /* const { queuedOrder: red } = state; */
  const queuedOrders = useSelector((state: any) => state.queuedOrders);
  const queuedOrder = useSelector((state: any) => state.queuedOrder);

  const {push} = useHistory();

  const buyOrder = async (order: OrderedOrder) => {
    const ordered_at = order.ordered_at;
    delete orderQueue[ordered_at];

    dispatch({type: "BUY_ORDER_REQUEST", order});
    globalDispatch({type: TYPES.BUY_ORDER_REQUEST, order});

    const member = order.member;
    try {
      const response = await api.post("/orders", {
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
      globalDispatch({type: TYPES.BUY_ORDER_FAILURE, order});
    }
  };

  // TODO don't make this exportable and m ake order not be optional
  const makeOrder = (order: Order) => {
    const date = new Date();

    if (order.member === undefined) {
      throw new Error("Can't make an order without a member");
    }

    const orderedOrder = {...order, ordered_at: date.getTime()} as OrderedOrder;

    dispatch({
      type: "QUEUE_ORDER",
      order: pick(orderedOrder, "member", "products", "ordered_at"),
    });
    globalDispatch({
      type: TYPES.QUEUE_ORDER,
      order: pick(orderedOrder, "member", "products", "ordered_at"),
    });

    push("/");

    orderQueue[orderedOrder.ordered_at] = setTimeout(() => {
      buyOrder(orderedOrder);
    }, TIME_TO_CANCEL);
  };

  const cancelOrder = (order: OrderedOrder) => {
    clearTimeout(orderQueue[order.ordered_at]);
    delete orderQueue[order.ordered_at];

    dispatch({
      type: "CANCEL_ORDER",
      order: pick(order, "member", "products", "ordered_at"),
    });
    globalDispatch({
      type: TYPES.CANCEL_ORDER,
      order: pick(order, "member", "products", "ordered_at"),
    });
  };

  return {
    queuedOrder: state.queuedOrder,
    queuedOrders,
    makeOrder,
    cancelOrder,
    buyOrder,
  };
};

const orderQueue = {} as any;

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
  const {
    queuedOrder,
    queuedOrders,
    makeOrder,
    buyOrder,
    cancelOrder,
  } = useQueuedOrderState(defaultQueuedOrder, defaultQueuedOrders);

  return (
    <QueuedOrdersContext.Provider
      value={{
        queuedOrder,
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
