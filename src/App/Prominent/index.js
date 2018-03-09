import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectMember } from '../../actions';
import Prominent from './Prominent';
import { groupBy, sortBy, take, first } from 'lodash';

const boardMembersSelector = state => state.boardMembers;
const membersSelector = state => state.members;

// Get member data for all board members
const boardMembersWithMemberSelector = createSelector(
  boardMembersSelector,
  membersSelector,
  (boardMembers, members) =>
    boardMembers
      .map(boardMember => ({
        id: boardMember.member_id,
        year: boardMember.year,
        function: boardMember.function,
        member: members.find(member => member.id === boardMember.member_id)
      }))
      .filter(member => member.member !== undefined)
);

const boardsSelector = createSelector(
  boardMembersWithMemberSelector,
  boardMembers =>
    sortBy(
      // Take the latest SHOW_N_BOARDS
      take(
        sortBy(
          groupBy(boardMembers, boardMember => boardMember.year),
          board => -first(board).year
        ),
        SHOW_N_BOARDS
      ),
      // Make sure that a board member is always placed on the same collumn
      board => -((first(board).year + 1) % SHOW_N_BOARDS)
    )
);

const SHOW_N_BOARDS = 5;
const SHOW_N_PROMINENT = 10;

const prominentSelector = createSelector(
  membersSelector,
  boardsSelector,
  (members, boards) => {
    // Filter out all members who are allready shown in the board collumns
    const boardMembersId = boards.reduce((members, board) => {
      return [...members, ...board.map(member => member.member.id)];
    }, []);

    const prominent = take(
      sortBy(
        members.filter(member => member.prominent !== null),
        member => -member.prominent
      ).filter(member => !boardMembersId.includes(member.id)), // don't include members who are shown as a board member
      SHOW_N_PROMINENT
    );
    return prominent;
  }
);

const mapStateToProps = state => ({
  boards: boardsSelector(state),
  prominent: prominentSelector(state)
});

const mapDispatchToProps = dispatch => ({
  selectMember: member => dispatch(selectMember(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(Prominent);
