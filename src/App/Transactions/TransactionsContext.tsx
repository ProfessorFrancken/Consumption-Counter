import React from "react";
import {MemberType} from "App/Members/Members";
import {take, uniqBy} from "lodash";
import {useMembers} from "App/Members/Context";
import {TYPES} from "actions";
import {useSelector} from "react-redux";
import {OrderedOrder} from "App/QueuedOrdersContext";

const RECENT_MEBMERS = 6 * 5;
export function recentBuyers(state = [], action: any) {
  switch (action.type) {
    case TYPES.BUY_ORDER_SUCCESS:
      return take(
        uniqBy([action.order.member.id, ...state], (member: any) => member),
        RECENT_MEBMERS
      );
    default:
      return state;
  }
}

const KEEP_TRACK_OF_N_TRANSCACTIONS = 10;
type RecentBuyerId = number;
export function transactions(state = [], action: any) {
  switch (action.type) {
    case TYPES.BUY_ORDER_SUCCESS:
      return take(
        [{member: action.member, order: action.order}, ...state],
        KEEP_TRACK_OF_N_TRANSCACTIONS
      );
    default:
      return state;
  }
}

type State = {
  transactions: OrderedOrder[];
  recentBuyers: RecentBuyerId;
};
const TransactionsContext = React.createContext<State | undefined>(undefined);
export const TransactionsProvider: React.FC = ({children, ...props}) => {
  const transactions = useSelector((state: any) => state.transactions);
  const recentBuyers = useSelector((state: any) => state.recentBuyers);

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
  const recent = useSelector((state: any) => state.recentBuyers);
  const {members} = useMembers();
  return (
    recent
      .map((recent: number) => members.find((member: MemberType) => member.id === recent))
      // exclude members that couldn't be found (for instance guests)
      .filter((member: MemberType | undefined) => member !== undefined)
  );
}
