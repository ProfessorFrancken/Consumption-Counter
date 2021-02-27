import React from "react";
import {MemberType} from "App/Members/Members";
import {take, uniqBy} from "lodash";
import {useMembers} from "App/Members/Context";
import {AppEvent, BUY_ORDER_SUCCESS_EVENT} from "actions";
import {OrderedOrder} from "App/QueuedOrdersContext";
import {useBusReducer} from "ts-bus/react";

const RECENT_MEBMERS = 6 * 5;

function recentBuyersReducer(state: number[], event: AppEvent) {
  switch (event.type) {
    case BUY_ORDER_SUCCESS_EVENT.toString():
      return take(
        uniqBy([event.payload.order.member.id, ...state], (member: any) => member),
        RECENT_MEBMERS
      );
    default:
      return state;
  }
}

const KEEP_TRACK_OF_N_TRANSCACTIONS = 10;
type RecentBuyerId = number;
function transactionsReducer(state: OrderedOrder[] = [], event: AppEvent) {
  switch (event.type) {
    case BUY_ORDER_SUCCESS_EVENT.toString():
      return take([event.payload.order, ...state], KEEP_TRACK_OF_N_TRANSCACTIONS);
    default:
      return state;
  }
}

type State = {
  transactions: OrderedOrder[];
  recentBuyers: RecentBuyerId[];
};
const TransactionsContext = React.createContext<State | undefined>(undefined);
export const TransactionsProvider: React.FC = ({children, ...props}) => {
  const transactions = useBusReducer(transactionsReducer, []);
  const recentBuyers = useBusReducer(recentBuyersReducer, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        recentBuyers,
        ...props,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = React.useContext(TransactionsContext);

  if (!context) {
    throw new Error(`useTransactions must be used within a TransactionsContext`);
  }

  return context;
};

export function useRecentBuyers() {
  const {recentBuyers} = useTransactions();
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
