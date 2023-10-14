import React, {useMemo, useRef, useState} from "react";
import {MemberType} from "App/Members/Members";
import {useProducts} from "./ProductsContext";
import {sortBy, groupBy} from "lodash";
import {TIME_TO_CANCEL, useQueuedOrders} from "App/QueuedOrdersContext";
import {useNavigate} from "react-router";
import {createSearchParams, useSearchParams} from "react-router-dom";
import {useMembers} from "App/Members/Context";
import {useMutation, UseMutationResult, useQueryClient} from "@tanstack/react-query";

export type Product = {
  id: number;
  name: string;
  price: number;
  position: number;
  category: "Bier" | "Fris" | "Eten";
  image: string;
  splash_image: string;
  age_restriction: number | null;
};

export const useSelectedMember = () => {
  const [searchParams] = useSearchParams();
  const {members} = useMembers();
  return useMemo(() => {
    const memberId = Number(searchParams.get("memberId"));
    return members.find(({id}) => id === memberId);
  }, [members, searchParams]);
};

function didNotRecentlyOrderAProduct(member: MemberType) {
  const latest_purchase_at =
    typeof member.latest_purchase_at === "string"
      ? new Date(member.latest_purchase_at)
      : member.latest_purchase_at;

  if (latest_purchase_at === null) {
    return true;
  }

  const today = new Date();
  const timeDiff = today.getTime() - latest_purchase_at.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays > 90;
}

export const useSelectMember = () => {
  const navigate = useNavigate();
  const {reset} = useOrder();
  return (member: MemberType) => {
    if (didNotRecentlyOrderAProduct(member)) {
      if (!window.confirm(`Are you sure you want to select ${member.fullname}?`)) {
        // Cancel the selection since selecting this member was a mistake
        return;
      }
    }

    reset();

    navigate({
      pathname: "/products",
      search: createSearchParams({memberId: String(member.id)}).toString(),
    });
  };
};

export type Order = {
  products: Product[];
};

const emptyOrder: Order = {
  products: [],
};

type State = {
  addProductToOrder: (product: Product) => void;
  reset: () => void;
  order: Order;
  makeOrderMutation: UseMutationResult<void, unknown, Order & {member: MemberType}>;
  cancelOrder: () => void;
};

const useMakeOrder = (reset: () => void) => {
  const member = useSelectedMember();
  const {
    makeOrder: queueOrder,
    buyOrder,
    cancelOrder: cancelQueuedOrder,
  } = useQueuedOrders();
  const navigate = useNavigate();

  const cancelOrderRef = useRef<() => void>();
  const cancelOrder = () => {
    if (cancelOrderRef.current) {
      cancelOrderRef.current();
    }
  };

  const queryClient = useQueryClient();

  // TODO
  const makeOrderMutation = useMutation({
    mutationFn: async (order: Order & {member: MemberType}) => {
      const member = order.member;

      if (member === undefined) {
        throw new Error("Can't make an order without a member");
      }

      const date = new Date();

      // TODO: rename to prepare order?
      const queuedOrder = {
        member,
        products: order.products,
        ordered_at: date.getTime(),
      };
      queueOrder(queuedOrder);

      //console.log("navigating before buying");
      navigate("/");

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, TIME_TO_CANCEL);
        cancelOrderRef.current = () => {
          //console.log("cancelling");
          cancelQueuedOrder(queuedOrder);
          clearTimeout(timeout);
          reject();
        };
      });

      const newOrder = {
        member,
        products: order.products,
        ordered_at: date.getTime(),
      };
      await buyOrder(newOrder);

      reset();
      return newOrder;
    },
    onMutate: () => {
      //console.log("mutate");
    },
    onSuccess: (order) => {
      //console.log("success");

      const [date, time] = new Date(order.ordered_at).toISOString().split("T");

      const hourMinutesSeconds = time.split(".").at(0);

      const orderedAt = `${date} ${hourMinutesSeconds}`;

      const newOrders = order.products.map((product, idx) => {
        return {
          // Create a random id based on time and idx, making sure we don't
          // create duplicates ones in our tests that mock date
          id: new Date().getTime() + idx,
          member_id: order.member.id,
          product_id: product.id,
          amount: 1,
          ordered_at: orderedAt,
          price: product.price,
        };
      });

      type OrderTransaction = {
        id: number;
        member_id: number;
        product_id: number;
        amount: number;
        ordered_at: string; // datetime string
        price: number;
      };
      queryClient.setQueryData<OrderTransaction[]>(["orders"], (orders) => {
        return orders === undefined ? newOrders : [...orders, ...newOrders];
      });
    },
    onError: () => {
      //console.log("error");
    },
    meta: {
      member,
    },
  });

  return {cancelOrder, makeOrderMutation};
};

export const OrderContext = React.createContext<State | undefined>(undefined);
export const OrderProvider: React.FC<{
  order?: Order;
  children: React.ReactNode;
}> = ({order: defaultOrder = emptyOrder, ...props}) => {
  const member = useSelectedMember();
  const [orderedProducts, setOrderedProducts] = useState(defaultOrder.products);

  const reset = () => {
    setOrderedProducts([]);
  };

  const {makeOrderMutation, cancelOrder} = useMakeOrder(reset);
  const addProductToOrder = (product: Product) => {
    setOrderedProducts((products) => [...products, product]);
  };

  const order = useMemo(() => {
    return {products: orderedProducts, member};
  }, [orderedProducts, member]);

  return (
    <OrderContext.Provider
      value={{
        addProductToOrder,
        reset,
        order,
        makeOrderMutation,
        cancelOrder,
      }}
      {...props}
    />
  );
};

const memberIsAllowedToPurchaseProduct = (product: Product, member?: MemberType) => {
  if (member === undefined) {
    return false;
  }

  if (product.age_restriction === null) {
    return true;
  }

  return product.age_restriction <= member.age;
};

export const useOrderableProducts = () => {
  const {order} = useOrder();
  const {products = []} = useProducts();
  const member = useSelectedMember();

  return React.useMemo(() => {
    const availableProducts = products.filter((product: Product) =>
      memberIsAllowedToPurchaseProduct(product, member)
    );

    return groupBy(
      sortBy(availableProducts, (product: Product) => product.position),
      (product: Product) => product.category
    ) as {
      Bier: Product[];
      Fris: Product[];
      Eten: Product[];
    };
  }, [products, order, member]);
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);

  if (!context) {
    throw new Error(`useOrder must be used within a OrderProvider`);
  }

  return context;
};
