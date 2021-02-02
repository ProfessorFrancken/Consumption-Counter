import React from "react";
import {makeOrder, TYPES} from "actions";
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

type Order = {
  products: Product[];
  member: MemberType;
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

function addProductToOrder(product: any) {
  return (dispatch: any, getState: any) => {
    const {order} = getState();

    if (order.products.length === 0) {
      return dispatch(makeOrder({member: order.member, products: [product]}));
    } else {
      dispatch({type: TYPES.ADD_PRODUCT_TO_ORDER, product});
    }
  };
}

function buyMore(product: any) {
  return {type: TYPES.BUY_MORE, product};
}

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
  makeOrder: () => void;
  buyAll: () => void;
  order: Order;
};

const ProductPurchaseContext = React.createContext<State | undefined>(undefined);

export const ProductPurchaseProvider: React.FC<{}> = ({...props}) => {
  const {push} = useHistory();
  const order = useSelector((state: any) => state.order);
  const products = useSelector((state: any) => state.products);
  const dispatch = useDispatch();
  const hour = new Date().getHours();

  const productsWithHour = useSelector((state: any) =>
    productsWithOrderCountSelector(state, {hour})
  ) as {
    Bier: ProductPropType[];
    Fris: ProductPropType[];
    Eten: ProductPropType[];
  };

  const selectMember = (member: MemberType) => {
    if (didNotRecentlyOrderAProduct(member)) {
      if (!window.confirm(`Are you sure you want to select ${member.fullname}?`)) {
        // Cancel the selection since selecting this member was a mistake
        return;
      }
    }

    push("/products");
    dispatch({type: TYPES.SELECT_MEMBER, member});
  };

  const value = {
    products,
    productsWithHour,
    selectMember,
    makeOrder: () => {},
    addProductToOrder: (product: Product) => dispatch(addProductToOrder(product)),
    toggle: (product: Product) => dispatch(buyMore(product)),
    buyAll: () => dispatch(makeOrder(order)),
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
