import React from "react";
import {QueryObserverResult, useQuery} from "react-query";
import api from "api";
import {MemberType} from "App/Members/Members";
import {useSelector} from "react-redux";
import {groupBy, sortBy, take} from "lodash";

const SHOW_N_PROMINENT = 10;
const SHOW_N_BOARDS = 5;

export type BoardMember = {
  member_id: number;
  year: number;
  function: string;
  member?: MemberType;
};

const useFetchBoardMembers = (boardMembers?: BoardMember[]) => {
  return useQuery<BoardMember[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      const mapBoard = (boardMember: any): BoardMember => {
        return {
          member_id: parseInt(boardMember.lid_id, 10),
          year: boardMember.jaar,
          function: boardMember.functie,
        };
      };

      const response = await api.get("/boards");
      return response.boardMembers.map(mapBoard);
    },
    enabled: boardMembers === undefined,
  });
};

type State = {
  boardsQuery: QueryObserverResult<BoardMember[]>;
  boardMembers: BoardMember[];
};
const BoardsContext = React.createContext<State | undefined>(undefined);
export const BoardsProvider: React.FC<{boardMembers?: BoardMember[]}> = ({
  boardMembers: defaultBoardMembers,
  children,
  ...props
}) => {
  const boardsQuery = useFetchBoardMembers(defaultBoardMembers);

  // TODO: extract this (and the same code for committees) to a useWithMembers(memberCollection) hook
  const members = useSelector((state: any) => state.members);
  const boardMembers: BoardMember[] = (defaultBoardMembers ?? boardsQuery.data ?? [])
    .map((member) => {
      return {
        ...member,
        member: members.find(({id}: MemberType) => id === member.member_id),
      };
    })
    .filter(({member}) => member !== undefined);

  return (
    <BoardsContext.Provider
      value={{
        boardsQuery,
        boardMembers,
        ...props,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};

export const useBoards = () => {
  const context = React.useContext(BoardsContext);

  if (!context) {
    throw new Error(`useBoards must be used within a BoardsContext`);
  }

  return context;
};

export const useMostRecentBoards = () => {
  const {boardMembers} = useBoards();
  return sortBy(
    take(
      sortBy(
        groupBy(boardMembers, (boardMember: BoardMember) => boardMember.year),
        (board: BoardMember[]) => -board[0].year
      ),
      SHOW_N_BOARDS
    ),
    // Make sure that a board member is always placed on the same collumn
    (board: BoardMember[]) => -((board[0].year + 1) % SHOW_N_BOARDS)
  );
};

function recentlyPurchasedAProduct(member: MemberType) {
  const latest_purchase_at =
    typeof member.latest_purchase_at === "string"
      ? new Date(member.latest_purchase_at)
      : member.latest_purchase_at;

  if (latest_purchase_at === null) {
    return false;
  }

  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - latest_purchase_at.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays <= 90;
}

export const useActiveBoardMembers = () => {
  const {boardMembers} = useBoards();
  const recentBoards = useMostRecentBoards();

  // Filter out all members who are allready shown in the board collumns
  const recentBoardMembersId = recentBoards.reduce((members: any, board: any) => {
    return [...members, ...board.map((member: any) => member.member.id)];
  }, []);

  // Show all members that aren't shown in the boards grid and
  // who have recently purchased something
  return take(
    sortBy(
      boardMembers
        .map((boardMember: any) => boardMember.member)
        .filter(recentlyPurchasedAProduct),
      (member: any) => -member.prominent
    ).filter((member: any) => !recentBoardMembersId.includes(member.id)), // don't include members who are shown as a board member
    SHOW_N_PROMINENT
  );
};
