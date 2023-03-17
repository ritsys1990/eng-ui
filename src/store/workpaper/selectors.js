const selectAddWorkpaperSelected = state => state.workpaper.get('addWorkpaperSelected');
const selectAddWorkpaperLoading = state => state.workpaper.get('addNewWorkpaperLoading');
const selectCreatingWorkpaper = state => state.workpaper.get('creatingWorkpaper');
const selectFetchingLabelConflicts = state => state.workpaper.get('fetchingLabelConflicts');
const selectList = state => state.workpaper.get('list');
const selectLinkList = state => state.workpaper.get('linkList');
const selectFetchingLinkList = state => state.workpaper.get('fetchingLinkList');
const selectTags = state => state.workpaper.get('tags');
const selectTagsLoading = state => state.workpaper.get('tagsLoading');
const selectAddWorkpaperList = state => state.workpaper.get('addWorkpaperList');
const selectFetchingList = state => state.workpaper.get('fetchingList');
const selectFetchingAddWorkpaperList = state => state.workpaper.get('fetchingAddWorkpaperList');
const selectIsCopyingWorkpaper = state => state.workpaper.get('isCopyingWorkpaper');
const selectIsDeletingWorkpaper = state => state.workpaper.get('isDeletingWorkpaper');
const selectIsLoadingChooseWorkpaper = state =>
  state.workpaper.get('fetchingAddWorkpaperList') ||
  state.workpaper.get('fetchingLinkList') ||
  state.bundles.get('fetchingTagsPublishedList');
const selectIsFetchingWorkpaperList = state => state.workpaper.get('fetchingList') || state.bundles.get('fetchingTags');
const selectIsConfiguringBundle = state => state.workpaper.get('isConfiguringBundle');
const selectIsCreatingDataRequest = state => state.workpaper.get('isCreatingDataRequest');
const selectDataRequestInfo = state => state.workpaper.get('dataRequestInfo');
const selectIsWorkpaperRefreshNeeded = state => state.workpaper.get('isWorkpaperRefreshNeeded');

export const workpaperSelectors = {
  selectAddWorkpaperSelected,
  selectCreatingWorkpaper,
  selectFetchingLabelConflicts,
  selectList,
  selectLinkList,
  selectTags,
  selectTagsLoading,
  selectAddWorkpaperLoading,
  selectFetchingLinkList,
  selectAddWorkpaperList,
  selectFetchingList,
  selectFetchingAddWorkpaperList,
  selectIsCopyingWorkpaper,
  selectIsDeletingWorkpaper,
  selectIsLoadingChooseWorkpaper,
  selectIsFetchingWorkpaperList,
  selectIsConfiguringBundle,
  selectIsCreatingDataRequest,
  selectDataRequestInfo,
  selectIsWorkpaperRefreshNeeded,
};
