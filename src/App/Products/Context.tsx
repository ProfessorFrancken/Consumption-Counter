import React from "react";
import {makeOrder as makeOrderAction} from "actions";
import {MemberType} from "App/Members/Members";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {mapValues} from "lodash";

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

type Order = {
  products: Product[];
  member: undefined | MemberType;
};

type OrderAction =
  | {type: "SELECT_MEMBER"; member: MemberType}
  | {type: "ADD_PRODUCT_TO_ORDER"; product: Product}
  | {type: "RESET_ORDER"};

const emptyOrder: Order = {
  member: undefined,
  products: [],
};

const orderReducer = (state: Order, action: OrderAction) => {
  switch (action.type) {
    case "SELECT_MEMBER":
      return {...emptyOrder, member: action.member};
    case "ADD_PRODUCT_TO_ORDER":
      return {...state, products: [...state.products, {...action.product}]};
    case "RESET_ORDER":
      return emptyOrder;
  }
};

const useOrderReducer = (defaultOrder: Order) => {
  const globalDispatch = useDispatch();
  const {push} = useHistory();
  const [order, dispatch] = React.useReducer(orderReducer, defaultOrder);

  const makeOrder = (order: Order) => {
    dispatch({type: "RESET_ORDER"});
    globalDispatch(makeOrderAction(order));
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

  const selectMember = (member: MemberType) => {
    if (didNotRecentlyOrderAProduct(member)) {
      if (!window.confirm(`Are you sure you want to select ${member.fullname}?`)) {
        // Cancel the selection since selecting this member was a mistake
        return;
      }
    }

    dispatch({type: "SELECT_MEMBER", member});
    push("/products");
  };

  return [
    order,
    {
      buyAll,
      selectMember,
      addProductToOrder,
      addProductToOrderOrMakeOrder,
    },
  ] as const;
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

const useProducts = (order: Order, hour: number) => {
  const products = useSelector((state: any) => state.products) as {
    Bier: Product[];
    Fris: Product[];
    Eten: Product[];
  };

  return React.useMemo(() => {
    return mapValues(products, (products: Product[]) => {
      return products
        .filter((product: Product) =>
          memberIsAllowedToPurchaseProduct(product, order.member)
        )
        .map((product: Product) => {
          return {
            ...product,
            locked: isProductLocked(product, hour),
            ordered: order.products.filter(({id}) => id === product.id).length,
          };
        });
    });
  }, [order, products, hour]);
};

type State = {
  products: {
    Bier: Product[];
    Fris: Product[];
    Eten: Product[];
  };
  selectMember: (member: MemberType) => void;
  addProductToOrder: (product: Product) => void;
  addProductToOrderOrMakeOrder: (product: Product) => void;
  buyAll: () => void;
  order: Order;
};

const ProductPurchaseContext = React.createContext<State | undefined>(undefined);
export const ProductPurchaseProvider: React.FC<{order?: Order}> = ({
  order: defaultOrder = emptyOrder,
  ...props
}) => {
  const [
    order,
    {buyAll, addProductToOrder, addProductToOrderOrMakeOrder, selectMember},
  ] = useOrderReducer(defaultOrder);
  const hour = new Date().getHours();
  const products = useProducts(order, hour);

  return (
    <ProductPurchaseContext.Provider
      value={{
        products,
        selectMember,
        addProductToOrderOrMakeOrder,
        addProductToOrder,
        buyAll,
        order,
      }}
      {...props}
    />
  );
};

export const useProductPurchase = () => {
  const context = React.useContext(ProductPurchaseContext);

  if (!context) {
    throw new Error(`useProductPurchase must be used within a ProductPurchaseProvider`);
  }

  return context;
};
