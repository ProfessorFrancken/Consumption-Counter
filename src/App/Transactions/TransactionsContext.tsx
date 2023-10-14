import React, {useEffect, useMemo} from "react";
import {MemberType} from "App/Members/Members";
import {take, uniq} from "lodash";
import {useMembers} from "App/Members/Context";
import {AppEvent, BUY_ORDER_SUCCESS_EVENT} from "actions";
import {OrderedOrder} from "App/QueuedOrdersContext";
import {useBus} from "ts-bus/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import api from "./../../api";
import {useProducts} from "App/Products/ProductsContext";

export const TransactionsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const bus = useBus();
  useEffect(() => {
    const unsubscribe = bus.subscribe(BUY_ORDER_SUCCESS_EVENT, (event: AppEvent) => {
      if (event.type !== BUY_ORDER_SUCCESS_EVENT.toString()) {
        return;
      }

      const [date, time] = new Date(event.payload.order.ordered_at)
        .toISOString()
        .split("T");

      const hourMinutesSeconds = time.split(".").at(0);

      const orderedAt = `${date} ${hourMinutesSeconds}`;

      const newOrders = event.payload.order.products.map((product, idx) => {
        return {
          // Create a random id based on time and idx, making sure we don't
          // create duplicates ones in our tests that mock date
          id: new Date().getTime() + idx,
          member_id: event.payload.order.member.id,
          product_id: product.id,
          amount: 1,
          ordered_at: orderedAt,
          price: product.price,
        };
      });

      queryClient.setQueryData<TransactionFromOrder[]>(["orders"], (orders) => {
        return orders === undefined ? newOrders : [...orders, ...newOrders];
      });
    });

    return () => unsubscribe();
  }, [bus, queryClient]);

  return <>{children}</>;
};

type TransactionFromOrder = {
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
      return (await api.get<{orders: TransactionFromOrder[]}>("/orders")).orders;
    },
  });
};

export const useTransactions = () => {
  const {members} = useMembers();
  const {products} = useProducts();
  const orders = useOrdersQuery();

  const transactions = useMemo(() => {
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

  return {transactions};
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
