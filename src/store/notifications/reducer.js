import { Map as ImmutableMap } from 'immutable';
import { NotificationsActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  allHeaderList: {
    totalCount: 0,
    items: [],
  },
  allHeaderFetched: false,
  fetchingAllHeader: false,
  lastUnreadRefresh: null,
  isFetchingUnreadCount: false,
  unreadCount: 0,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case NotificationsActionTypes.GET_ALL_HEADER_REQUEST:
      return state.merge({
        fetchingAllHeader: true,
      });

    case NotificationsActionTypes.GET_ALL_HEADER_SUCCESS:
      return state.merge({
        fetchingAllHeader: false,
        allHeaderList: action.payload.all,
        allHeaderFetched: true,
      });

    case NotificationsActionTypes.GET_ALL_HEADER_ERROR:
      return state.merge({
        fetchingAllHeader: false,
        allHeaderFetched: true,
      });

    case NotificationsActionTypes.GET_UNREAD_COUNT_REQUEST:
      return state.merge({
        isFetchingUnreadCount: true,
      });

    case NotificationsActionTypes.GET_UNREAD_COUNT_SUCCESS:
      return state.merge({
        isFetchingUnreadCount: false,
        lastUnreadRefresh: Date.now(),
        unreadCount: action.payload,
      });

    case NotificationsActionTypes.GET_UNREAD_COUNT_ERROR:
      return state.merge({
        isFetchingUnreadCount: false,
      });

    default:
      return state;
  }
}
