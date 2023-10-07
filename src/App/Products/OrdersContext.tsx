import React, {useMemo} from "react";
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

export type AvailableProduct = Product & {
  locked: boolean;
  ordered: number;
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

export type Order = {
  products: Product[];
  member: undefined | MemberType;
};

type OrderAction =
  | {type: "ADD_PRODUCT_TO_ORDER"; product: Product}
  | {type: "RESET_ORDER"};

type InternalOrder = {
  products: Product[];
};
const emptyOrder: InternalOrder & Order = {
  member: undefined,
  products: [],
};

const orderReducer = (state: InternalOrder, action: OrderAction): InternalOrder => {
  switch (action.type) {
    case "ADD_PRODUCT_TO_ORDER":
      return {...state, products: [...state.products, {...action.product}]};
    case "RESET_ORDER":
      return emptyOrder;
  }
};

export const useSelectedMember = () => {
  const [searchParams] = useSearchParams();
  const {members} = useMembers();
  return useMemo(() => {
    const memberId = Number(searchParams.get("memberId"));
    return members.find(({id}) => id === memberId);
  }, [members, searchParams]);
};

const useOrderReducer = (defaultOrder: InternalOrder) => {
  const [orderWithoutMember, dispatch] = React.useReducer(orderReducer, defaultOrder);
  const [searchParams] = useSearchParams();
  const member = useSelectedMember();
  const order = useMemo(() => {
    const memberId = Number(searchParams.get("memberId"));

    return {...orderWithoutMember, memberId, member};
  }, [orderWithoutMember, searchParams]);
  const {makeOrder: queueOrder} = useQueuedOrders();

  const makeOrder = (order: Order) => {
    dispatch({type: "RESET_ORDER"});
    // HERE needs to be with member
    queueOrder(order);
  };

  const buyAll = () => makeOrder(order);

  const addProductToOrder = (product: Product) => {
    dispatch({type: "ADD_PRODUCT_TO_ORDER", product});
  };

  const addProductToOrderOrMakeOrder = (product: any) => {
    if (order.products.length === 0) {
      makeOrder({member: order.member, products: [product]});
    } else {
      addProductToOrder(product);
    }
  };

  return [
    order,
    {
      buyAll,
      addProductToOrder,
      addProductToOrderOrMakeOrder,
    },
  ] as const;
};

export const useSelectMember = () => {
  const navigate = useNavigate();
  return (member: MemberType) => {
    if (didNotRecentlyOrderAProduct(member)) {
      if (!window.confirm(`Are you sure you want to select ${member.fullname}?`)) {
        // Cancel the selection since selecting this member was a mistake
        return;
      }
    }

    navigate({
      pathname: "/products",
      search: createSearchParams({memberId: String(member.id)}).toString(),
    });
  };
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

const isProductLocked = (product: Product, hour: number) => {
  if (product.category === "Bier") {
    if (["Almanak", "Almanac"].includes(product.name)) {
      return false;
    }

    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hour);
  }

  if (product.name === "Goede morgen!") {
    return ![6, 7, 8, 9, 10, 11].includes(hour);
  }

  return false;
};

const useCategorizedProducts = (order: Order, hour: number) => {
  const {products = []} = useProducts();

  return React.useMemo(() => {
    const availableProducts = products
      .filter((product: Product) =>
        memberIsAllowedToPurchaseProduct(product, order.member)
      )
      .map((product: Product): AvailableProduct => {
        return {
          ...product,
          locked: isProductLocked(product, hour),
          ordered: order.products.filter(({id}) => id === product.id).length,
        };
      });

    return groupBy(
      sortBy(availableProducts, (product: AvailableProduct) => product.position),
      (product: AvailableProduct) => product.category
    ) as {
      Bier: AvailableProduct[];
      Fris: AvailableProduct[];
      Eten: AvailableProduct[];
    };
  }, [products, order, hour]);
};

type State = {
  products: {
    Bier: AvailableProduct[];
    Fris: AvailableProduct[];
    Eten: AvailableProduct[];
  };

  addProductToOrder: (product: Product) => void;
  addProductToOrderOrMakeOrder: (product: Product) => void;
  buyAll: () => void;
  order: Order;
};

const OrderContext = React.createContext<State | undefined>(undefined);
export const OrderProvider: React.FC<{
  order?: Order;
  children: React.ReactNode;
}> = ({order: defaultOrder = emptyOrder, ...props}) => {
  const [order, {buyAll, addProductToOrder, addProductToOrderOrMakeOrder}] =
    useOrderReducer({...defaultOrder});
  const hour = new Date().getHours();
  const products = useCategorizedProducts(order, hour);

  return (
    <OrderContext.Provider
      value={{
        products,
        addProductToOrderOrMakeOrder,
        addProductToOrder,
        buyAll,
        order,
      }}
      {...props}
    />
  );
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);

  if (!context) {
    throw new Error(`useOrder must be used within a OrderProvider`);
  }

  return context;
};
