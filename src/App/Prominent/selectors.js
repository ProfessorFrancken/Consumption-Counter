import {createSelector} from "reselect";
import {membersSelector} from "selectors";
import {groupBy, sortBy, take, first} from "lodash";

const SHOW_N_PROMINENT = 10;
const SHOW_N_BOARDS = 5;

const boardMembersSelector = (state) => state.boardMembers;

// Get member data for all board members
const boardMembersWithMemberSelector = createSelector(
  boardMembersSelector,
  membersSelector,
  (boardMembers, members) =>
    boardMembers
      .map((boardMember) => ({
        id: boardMember.member_id,
        year: boardMember.year,
        function: boardMember.function,
        member: members.find((member) => member.id === boardMember.member_id),
      }))
      .filter((member) => member.member !== undefined)
);

export const boardsSelector = createSelector(
  boardMembersWithMemberSelector,
  (boardMembers) =>
    sortBy(
      // Take the latest SHOW_N_BOARDS
      take(
        sortBy(
          groupBy(boardMembers, (boardMember) => boardMember.year),
          (board) => -first(board).year
        ),
        SHOW_N_BOARDS
      ),
      // Make sure that a board member is always placed on the same collumn
      (board) => -((first(board).year + 1) % SHOW_N_BOARDS)
    )
);

export const prominentSelector = createSelector(
  boardMembersWithMemberSelector,
  boardsSelector,
  (boardMembers, boards) => {
    function recentlyPurchasedAProduct(member) {
      const latest_purchase_at =
        typeof member.latest_purchase_at === "string"
          ? new Date(member.latest_purchase_at)
          : member.latest_purchase_at;

      if (latest_purchase_at === null) {
        return true;
      }

      const today = new Date();
      const timeDiff = Math.abs(today.getTime() - latest_purchase_at.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays <= 90;
    }

    // Filter out all members who are allready shown in the board collumns
    const boardMembersId = boards.reduce((members, board) => {
      return [...members, ...board.map((member) => member.member.id)];
    }, []);

    // Show all members that aren't shown in the boards grid and
    // who have recently purchased something
    const prominent = take(
      sortBy(
        boardMembers
          .map((boardMember) => boardMember.member)
          .filter(recentlyPurchasedAProduct),
        (member) => -member.prominent
      ).filter((member) => !boardMembersId.includes(member.id)), // don't include members who are shown as a board member
      SHOW_N_PROMINENT
    );
    return prominent;
  }
);
