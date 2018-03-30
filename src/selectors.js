import { createSelector } from 'reselect';
import { mapValues, uniqBy, groupBy, sortBy, take, first } from 'lodash';

const membersSelector = state => state.members;
const committeeMembersSelector = state => state.committeeMembers;
const boardMembersSelector = state => state.boardMembers;
const categorySelector = state => state.products;
const orderSelector = state => state.order;
const transactionsSelector = state => state.transactions;

export const rangesSelector = state => state.surnameRanges.ranges;
export const queuedOrderSelector = state => state.queuedOrder;
export const membersInRangeSelector = (state, { page = 0 }) =>
  state.surnameRanges.ranges[page].members;

const activeMembersSelector = state => {
  const year = new Date().getUTCFullYear();

  return state.committeeMembers.filter(member =>
    [year, year - 1].includes(member.year)
  );
};

// From the list of all committee members, select all committees
const committeesSelector = createSelector(
  activeMembersSelector,
  activeMembers =>
    uniqBy(
      activeMembers.reduce(
        (committees, member) => [...committees, member.committee],
        []
      ),
      committee => committee.id
    )
);

// Get member info of all active members and filter out all members who don't streep
const committeeMembersWithMemberSelector = createSelector(
  activeMembersSelector,
  membersSelector,
  (activeMembers, members) =>
    activeMembers
      .map(activeMember => ({
        committee_id: activeMember.committee.id,
        ...members.find(member => member.id === activeMember.member_id)
      }))
      .filter(member => member.id !== undefined)
);

// Select products that the selected member is allowed to buy
const allowedProductsSelector = createSelector(
  categorySelector,
  orderSelector,
  (categories, order) =>
    mapValues(categories, products =>
      products.filter(product => product.age_restriction <= order.member.age)
    )
);

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

const SHOW_N_BOARDS = 5;
const SHOW_N_PROMINENT = 10;

export const recentSelector = createSelector(
  transactionsSelector,
  transactions =>
    take(
      uniqBy(
        transactions.map(transaction => transaction.member),
        member => member.id
      ),
      6 * 6
    )
);

export const backgroundSelector = createSelector(queuedOrderSelector, order => {
  if (order === null) {
    return null;
  }

  const product = order.order.products.find(
    product => product.splash_image !== null
  );

  return product === undefined ? null : product.splash_image;
});

export const committeesWithMembersSelector = createSelector(
  committeesSelector,
  committeeMembersWithMemberSelector,
  (committees, members) =>
    committees.map(committee => ({
      ...committee,
      members: uniqBy(
        members.filter(member => member.committee_id === committee.id),
        member => member.id
      )
    }))
);

export const compucieSelector = createSelector(
  membersSelector,
  committeeMembersSelector,
  (members, committeeMembers) => {
    const committees = groupBy(
      uniqBy(
        committeeMembers
          .filter(member => {
            return ['Compucie', 's[ck]rip(t|t?c)ie'].includes(
              member.committee.name
            );
          })
          .map(member => {
            const m = members.find(m => m.id === member.member_id);
            return m !== undefined
              ? { ...m, name: member.committee.name }
              : undefined;
          })
          .filter(m => m !== undefined),
        member => member.id
      ),
      member => member.name
    );

    return {
      compucie: committees['Compucie'] || [],
      scriptcie: committees['s[ck]rip(t|t?c)ie'] || []
    };
  }
);

export const productsWithOrderCountSelector = createSelector(
  allowedProductsSelector,
  orderSelector,
  (categories, order) =>
    mapValues(
      categories,
      // For each product in the category, count the mount of times it was ordered
      products =>
        products.map(product => ({
          ...product,
          ordered: order.products.filter(p => p.id === product.id).length
        }))
    )
);

export const boardsSelector = createSelector(
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

export const prominentSelector = createSelector(
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

export const membersInCommitteesSelector = createSelector(
  (state, { page }) => page,
  committeeMembersWithMemberSelector,
  (page, members) =>
    uniqBy(
      members.filter(member => member.committee_id === parseInt(page, 10)),
      member => member.id
    )
);

export const goBackText = createSelector(queuedOrderSelector, queue => {
  if (queue !== null) {
    const member = queue.order.member;

    return [member.firstName, member.surname].join(' ');
  }

  return 'Go back';
});
