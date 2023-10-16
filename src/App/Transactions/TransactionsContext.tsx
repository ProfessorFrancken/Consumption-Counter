import {useMemo} from "react";
import {MemberType} from "App/Members/Members";
import {take, uniq} from "lodash";
import {useMembers} from "App/Members/Context";
import {OrderedOrder} from "App/QueuedOrdersContext";
import {useQuery} from "@tanstack/react-query";
import api from "./../../api";
import {useProducts} from "App/Products/ProductsContext";

export type OrderTransaction = {
  id: number;
  member_id: number;
  product_id: number;
  amount: number;
  ordered_at: string; // datetime string
  price: number;
};

const useOrdersQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return (await api.get<{orders: OrderTransaction[]}>("/orders")).orders;
    },
    staleTime: Infinity,
  });
};

export const useTransactions = () => {
  const {members} = useMembers();
  const orders = useOrdersQuery();

  const {productsQuery} = useProducts();
  const products = productsQuery.data;

  return useMemo(() => {
    if (!orders.data) {
      return [];
    }

    return orders.data
      .map((order): OrderedOrder | undefined => {
        const member = members.find((member) => member.id === order.member_id)!;
        const product = products?.find((product) => product.id === order.product_id)!;

        if (member === undefined || product === undefined) {
          return undefined;
        }

        return {
          ordered_at: new Date(order.ordered_at).getTime(),
          products: [product],
          member,
        };
      })
      .filter((order): order is OrderedOrder => order !== undefined);
  }, [orders.data, members, products]);
};

const RECENT_MEBMERS = 6 * 5;
export function useRecentBuyers() {
  const orders = useOrdersQuery();

  const recentBuyers = useMemo(() => {
    if (!orders.data) {
      return [];
    }

    return take(uniq(orders.data.map((order) => order.member_id)), RECENT_MEBMERS);
  }, [orders.data]);

  const {members} = useMembers();
  return (
    recentBuyers
      .map((recent: number) => members.find((member: MemberType) => member.id === recent))
      // exclude members that couldn't be found (for instance guests)
      .filter(
        (member: MemberType | undefined): member is MemberType => member !== undefined
      )
  );
}
