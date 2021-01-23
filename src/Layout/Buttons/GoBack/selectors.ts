import {createSelector} from "reselect";
import {queuedOrderSelector} from "selectors";

export const goBackText = createSelector(queuedOrderSelector, (queue) => {
  if (queue !== null) {
    const member = queue.order.member;

    return [member.firstName, member.surname].join(" ");
  }

  return "Go back";
});
