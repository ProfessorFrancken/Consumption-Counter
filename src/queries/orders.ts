import {useMemo} from "react";
import {MemberType} from "./members";
import take from "lodash/take";
import uniq from "lodash/uniq";
import {useMembers} from "./members";
import {OrderedOrder} from "../components/orders/queued-orders-context";
import {queryOptions, useQuery} from "@tanstack/react-query";
import api from "../api";
import {useProductsQuery} from "./products";

export type ApiOrdersResponse = {orders: OrderTransaction[]};
export type OrderTransaction = {
  id: number;
  member_id: number;
  product_id: number;
  amount: number;
  ordered_at: string; // datetime string
  price: number;
};

export const ordersQueryOptions = () => {
  return queryOptions({
    queryKey: ["orders"],
    queryFn: async () => {
      return (await api.get<ApiOrdersResponse>("/orders")).orders ?? [];
    },
    staleTime: Infinity,
  });
};

const useOrdersQuery = () => {
  return useQuery(ordersQueryOptions());
};

export const useTransactions = () => {
  const {members} = useMembers();
  const orders = useOrdersQuery();

  const productsQuery = useProductsQuery();
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
  const {members} = useMembers();

  return useMemo((): MemberType[] => {
    if (!orders.data) {
      return [];
    }

    const recentBuyersIds = take(
      uniq(orders.data.map((order) => order.member_id)),
      RECENT_MEBMERS
    );

    const recentBuyers = recentBuyersIds
      .map((recent: number): MemberType | undefined =>
        members.find((member: MemberType) => member.id === recent)
      )
      // exclude members that couldn't be found (for instance guests)
      .filter(
        (member: MemberType | undefined): member is MemberType => member !== undefined
      );

    return recentBuyers;
  }, [orders.data, members]);
}
