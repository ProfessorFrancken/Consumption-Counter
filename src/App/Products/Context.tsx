import React from "react";
import {makeOrder as makeOrderAction, TYPES} from "actions";
import {MemberType} from "App/Members/Members";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {ProductPropType} from "./Products";
import {productsWithOrderCountSelector} from "./selectors";

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
  | {type: "TOGGLE_BUY_MORE_PRODUCTS"; product: Product}
  | {type: "SELECT_MEMBER"; member: MemberType}
  | {type: "ADD_PRODUCT_TO_ORDER"; product: Product}
  | {type: "QUEUE_ORDER"};

const emptyOrder: Order = {
  member: undefined,
  products: [],
};

type State = {
  products: Product[];
  productsWithHour: {
    Bier: ProductPropType[];
    Fris: ProductPropType[];
    Eten: ProductPropType[];
  };
  selectMember: (member: MemberType) => void;
  addProductToOrder: (product: Product) => void;
  toggle: (product: Product) => void;
  buyAll: () => void;
  order: Order;
};

const orderReducer = (state: Order, action: OrderAction) => {
  switch (action.type) {
    case "TOGGLE_BUY_MORE_PRODUCTS":
      return {
        ...state,
        products: state.products.length === 0 ? [action.product] : [],
      };
    case "SELECT_MEMBER":
      return {...emptyOrder, member: action.member};
    case "ADD_PRODUCT_TO_ORDER":
      return {...state, products: [...state.products, {...action.product}]};
    case "QUEUE_ORDER":
      return emptyOrder;
  }
};

const ProductPurchaseContext = React.createContext<State | undefined>(undefined);

export const ProductPurchaseProvider: React.FC<{order?: Order}> = ({
  order: defaultOrder = emptyOrder,
  ...props
}) => {
  const dispatch = useDispatch();
  const [order, orderDispatch] = React.useReducer(orderReducer, defaultOrder);

  const {push} = useHistory();

  const products = useSelector((state: any) => state.products);
  const hour = new Date().getHours();

  const productsWithHour = useSelector((state: any) =>
    productsWithOrderCountSelector(state, {hour})
  ) as {
    Bier: ProductPropType[];
    Fris: ProductPropType[];
    Eten: ProductPropType[];
  };

  const makeOrder = (order: Order) => {
    orderDispatch({type: "QUEUE_ORDER"});
    dispatch(makeOrderAction(order));
  };

  const addProductToOrder = (product: any) => {
    if (order.products.length === 0) {
      return makeOrder({member: order.member, products: [product]});
    } else {
      orderDispatch({type: "ADD_PRODUCT_TO_ORDER", product});
      dispatch({type: TYPES.ADD_PRODUCT_TO_ORDER, product});
    }
  };

  const selectMember = (member: MemberType) => {
    if (didNotRecentlyOrderAProduct(member)) {
      if (!window.confirm(`Are you sure you want to select ${member.fullname}?`)) {
        // Cancel the selection since selecting this member was a mistake
        return;
      }
    }

    push("/products");
    orderDispatch({type: "SELECT_MEMBER", member});
    dispatch({type: TYPES.SELECT_MEMBER, member});
  };

  const toggle = (product: Product) => {
    orderDispatch({type: "TOGGLE_BUY_MORE_PRODUCTS", product});
    dispatch({type: TYPES.BUY_MORE, product});
  };

  const value = {
    products,
    productsWithHour,
    selectMember,
    addProductToOrder: (product: Product) => addProductToOrder(product),
    toggle: toggle,
    buyAll: () => makeOrder(order),
    order,
  };

  return <ProductPurchaseContext.Provider value={value} {...props} />;
};

export const useProductPurchase = () => {
  const context = React.useContext(ProductPurchaseContext);

  if (!context) {
    throw new Error(`useProductPurchase must be used within a ProductPurchaseProvider`);
  }

  return context;
};
