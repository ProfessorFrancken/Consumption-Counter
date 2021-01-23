import {TYPES} from "actions";

const defaultMenuItems = [
  {icon: "home", url: "/", loading: false},
  {icon: "clock", url: "/recent"},
];
export function menuItems(state = defaultMenuItems, action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_REQUEST:
      return defaultMenuItems;
    case TYPES.FETCH_MEMBERS_SUCCESS:
      // If at least one person has a buixieval property, then we should show the
      // buixieval menu item
      const buixievalIsEnabled =
        action.members.filter((member) => member.buixieval !== undefined).length !== 0;

      if (buixievalIsEnabled) {
        return [...state, {icon: ["fab", "bitcoin"], url: "/buixieval"}];
      }
      return state;
    case TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST:
      return [...state, {icon: "users", url: "/committees", loading: true}];
    case TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS:
      return state.map((item) => ({
        ...item,
        ...(item.url === "/committees" ? {loading: false} : {}),
      }));

    case TYPES.FETCH_STATISTICS_REQUEST:
      return [...state, {icon: "chart-bar", url: "/statistics", loading: true}];
    case TYPES.FETCH_STATISTICS_SUCCESS:
      return state.map((item) => ({
        ...item,
        ...(item.url === "/statistics" ? {loading: false} : {}),
      }));

    case TYPES.FETCH_BOARD_MEMBERS_REQUEST:
      return [{icon: "chess-queen", url: "/prominent", loading: true}, ...state];
    case TYPES.FETCH_BOARD_MEMBERS_SUCCESS:
      return state.map((item) => ({
        ...item,
        ...(item.url === "/prominent" ? {loading: false} : {}),
      }));
    default:
      return state;
  }
}
