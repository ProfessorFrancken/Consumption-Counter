import {TYPES} from "actions";

const defaultMenuItems = [
  {icon: "home", url: "/", loading: false, label: "Home"},
  {icon: "clock", url: "/recent", label: "Recent"},
];
export function menuItems(state = defaultMenuItems, action: any) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_REQUEST:
      return defaultMenuItems;
    case TYPES.FETCH_STATISTICS_REQUEST:
      return [
        ...state,
        {icon: "chart-bar", url: "/statistics", loading: true, label: "Statistics"},
      ];
    case TYPES.FETCH_STATISTICS_SUCCESS:
      return state.map((item) => ({
        ...item,
        ...(item.url === "/statistics" ? {loading: false} : {}),
      }));

    default:
      return state;
  }
}
