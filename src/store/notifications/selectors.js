const selectUnreadCounts = state => state.notifications.get('unreadCount');
const selectAllHeaderList = state => state.notifications.get('allHeaderList');
const selectFetchingAllHeader = state => state.notifications.get('fetchingAllHeader');
const selectAllHeaderFetched = state => state.notifications.get('allHeaderFetched');
const selectIsFetchingUnreadCount = state => state.notifications.get('isFetchingUnreadCount');

export const notificationSelectors = {
  selectUnreadCounts,
  selectAllHeaderList,
  selectFetchingAllHeader,
  selectAllHeaderFetched,
  selectIsFetchingUnreadCount,
};
