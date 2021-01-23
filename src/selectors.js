export const membersSelector = (state) => state.members;
export const orderSelector = (state) => state.order;
export const rangesSelector = (state) => state.surnameRanges.ranges;
export const queuedOrderSelector = (state) => state.queuedOrder;
export const queuedOrdersSelector = (state) => state.queuedOrders;
export const membersInRangeSelector = (state, {page = 0}) =>
  state.surnameRanges.ranges[page].members;
