import React, {useMemo, useState} from "react";
import {MemberType} from "App/Members/Members";
import {useProducts} from "./ProductsContext";
import {sortBy, groupBy} from "lodash";
import {useQueuedOrders} from "App/QueuedOrdersContext";
import {useNavigate} from "react-router";
import {createSearchParams, useSearchParams} from "react-router-dom";
import {useMembers} from "App/Members/Context";

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
  makeOrder: (order: Order) => void;
};

const useMakeOrder = (reset: () => void) => {
  const member = useSelectedMember();
  const {makeOrder: queueOrder} = useQueuedOrders();

  const makeOrder = (order: Order) => {
    if (member === undefined) {
      throw new Error("Can't make an order without a member");
    }

    // HERE needs to be with member
    const date = new Date();

    queueOrder({
      member,
      products: order.products,
      ordered_at: date.getTime(),
    });

    reset();
  };

  return makeOrder;
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

  const makeOrder = useMakeOrder(reset);
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
        makeOrder,
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
