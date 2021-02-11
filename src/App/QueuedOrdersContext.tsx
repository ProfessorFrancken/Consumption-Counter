import {TYPES} from "actions";
import {pick} from "lodash";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {MemberType} from "./Members/Members";
import {Product} from "./Products/OrdersContext";
import api from "api";
import {useHistory} from "react-router";

export function queuedOrder(state = null, action: any) {
  switch (action.type) {
    case TYPES.QUEUE_ORDER:
      return {
        ordered_at: action.order.ordered_at,
        order: action.order,
      };
    case TYPES.BUY_ORDER_REQUEST:
      if (state === null) {
        return null;
      }
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      return state.ordered_at === action.order.ordered_at ? null : state;
    case TYPES.CANCEL_ORDER:
      return null;
    default:
      return state;
  }
}

export function queuedOrders(state = [], action: any) {
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
          ? // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            {...order, state: "requesting"}
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
          ? // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            {...order, fails: order.fails + 1, state: "queued"}
          : order;
      });
    default:
      return state;
  }
}

const orderQueue = {} as any;

export const TIME_TO_CANCEL = 7000;

export type QueuedOrder = {
  order: {
    products: Product[];
    member: MemberType;
    ordered_at: number;
  };
  fails: number;
  state: string;
};

type State = {
  queuedOrders: QueuedOrder[];
  queuedOrder: QueuedOrder;
  makeOrder: (order: any) => void;
  buyOrder: (order: any) => void;
  cancelOrder: (order: any) => void;
};

const QueuedOrdersContext = React.createContext<State | undefined>(undefined);
export const QueuedOrdersProvider: React.FC<{queuedOrders?: QueuedOrder[]}> = ({
  queuedOrders: defaultQueuedOrders = [],
  ...props
}) => {
  const dispatch = useDispatch();
  const {push} = useHistory();
  const queuedOrders = useSelector((state: any) => state.queuedOrders);
  const queuedOrder = useSelector((state: any) => state.queuedOrder);

  const buyOrder = (order: any) => {
    const ordered_at = order.ordered_at;
    delete orderQueue[ordered_at];

    dispatch({type: TYPES.BUY_ORDER_REQUEST, order});

    const member = order.member;
    return api
      .post("/orders", {
        order: {
          member: pick(member, ["id", "firstName", "surname"]),
          products: order.products.map((product: any) =>
            pick(product, ["id", "name", "price"])
          ),
          ordered_at,
        },
      })
      .then((response: any) => {
        dispatch({type: TYPES.BUY_ORDER_SUCCESS, order});
      })
      .catch((ex: any) => dispatch({type: TYPES.BUY_ORDER_FAILURE, order}));
  };

  // TODO don't make this exportable and m ake order not be optional
  const makeOrder = (order: any) => {
    const date = new Date();

    order = {...order, ordered_at: date.getTime()};

    dispatch({
      type: TYPES.QUEUE_ORDER,
      order: pick(order, "member", "products", "ordered_at"),
    });

    push("/");

    orderQueue[order.ordered_at] = setTimeout(() => {
      buyOrder(order);
    }, TIME_TO_CANCEL);
  };

  const cancelOrder = (order: any) => {
    clearTimeout(orderQueue[order.ordered_at]);
    delete orderQueue[order.ordered_at];

    dispatch({
      type: TYPES.CANCEL_ORDER,
      order: pick(order, "member", "products", "ordered_at"),
    });
  };

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

  const product = order.order.products.find(
    (product: any) => product.splash_image !== null
  );

  return product === undefined ? null : product.splash_image;
};

export const useFailedOrders = () => {
  const {queuedOrders} = useQueuedOrders();

  return queuedOrders.filter((order: any) => order.fails > 0).length;
};
