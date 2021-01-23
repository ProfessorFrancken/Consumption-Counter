export const membersSelector = (state: any) => state.members;
export const orderSelector = (state: any) => state.order;
export const rangesSelector = (state: any) => state.surnameRanges.ranges;
export const queuedOrderSelector = (state: any) => state.queuedOrder;
export const queuedOrdersSelector = (state: any) => state.queuedOrders;
export const membersInRangeSelector = (state: any, {page = 0}) =>
  state.surnameRanges.ranges[page].members;
