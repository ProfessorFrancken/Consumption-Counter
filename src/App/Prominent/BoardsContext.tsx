import {useQuery} from "@tanstack/react-query";
import api from "api";
import {MemberType} from "App/Members/Members";
import {groupBy, sortBy, take} from "lodash";
import {useMembers} from "App/Members/Context";

const SHOW_N_PROMINENT = 10;
const SHOW_N_BOARDS = 5;

export type BoardMember = {
  member_id: number;
  year: number;
  function: string;
  member?: MemberType;
};

const useBoardMembersQuery = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await api.get<{
        boardMembers: Array<{lid_id: number; jaar: number; functie: string}>;
      }>("/boards");

      return response.boardMembers.map((boardMember): BoardMember => {
        return {
          member_id: parseInt(boardMember.lid_id as unknown as string, 10),
          year: boardMember.jaar,
          function: boardMember.functie,
        };
      });
    },
    staleTime: Infinity,
  });
};

export const useBoards = () => {
  const boardsQuery = useBoardMembersQuery();

  // TODO: extract this (and the same code for committees) to a useWithMembers(memberCollection) hook
  const {members} = useMembers();
  const boardMembers: BoardMember[] = (boardsQuery.data ?? [])
    .map((member) => {
      return {
        ...member,
        member: members.find(({id}: MemberType) => id === member.member_id),
      };
    })
    .filter(({member}) => member !== undefined);

  return {boardsQuery, boardMembers};
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
