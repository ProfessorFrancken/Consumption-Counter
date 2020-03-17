import { TYPES } from 'actions';

const member_images = [];

export function members(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      // Refrehs images
      member_images.splice(0, member_images);
      action.members.forEach(member => {
        let img = new Image();
        if (member.cosmetics && member.cosmetics.image) {
          img.src = member.cosmetics.image;
          member_images.push(img);
        }
      });
      return action.members;
    case TYPES.BUY_ORDER_SUCCESS:
      return state.map(member => ({
        ...member,
        latest_purchase_at:
          member.id === action.order.member.id
            ? new Date(action.order.ordered_at)
            : member.latest_purchase_at
      }));
    default:
      return state;
  }
}
