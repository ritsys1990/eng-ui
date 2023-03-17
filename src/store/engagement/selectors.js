const selectEngagement = state => state.engagement.get('engagement');
const selectFetchingEngagement = state => state.engagement.get('fetchingEngagement');
const selectMyList = state => state.engagement.get('myList');
const selectFetchingMyList = state => state.engagement.get('fetchingMyList');
const selectUserList = state => state.engagement.get('userList');
const selectFetchingUserList = state => state.engagement.get('fetchingUserList');
const readOnlyfromEng = state => state.engagement.get('readOnlyfromEng');
const selectClientEngagementList = state => state.engagement.get('clientEngagementsList');
const selectIsFetchingClientEngagementList = state => state.engagement.get('isFetchingClientEngagementList');
const selectMatClientEngagements = state => state.engagement.get('matClientEngagements');
const selectMatGlobalClientEngagements = state => state.engagement.get('matGlobalClientEngagements');
const selectIsFetchingMatClientEngagements = state => state.engagement.get('isFetchingMatClientEngagements');
const selectIsAddingEngagement = state => state.engagement.get('isAddingEngagement');
const selectCreateEngagementUserInProgress = state => state.engagement.get('createEngagementUserInProgress');
const selectAddedEngagement = state => state.engagement.get('addedEngagement');
const selectIsReconcilingEngagements = state => state.engagement.get('isReconcilingEngagements');
const selectAreEngagementsReconciled = state => state.engagement.get('areEngagementsReconciled');
const selectIsReconcileEngagementsModalOpen = state => state.engagement.get('isReconcileEngagementsModalOpen');
const selectAreEngagementsSynchedToOmnia = state => state.engagement.get('areEngagementsSynchedToOmnia');
const selectIsProvisioningEngagements = state => state.engagement.get('isProvisioningEngagements');
const selectIsRollforwardInProgress = state => state.engagement.get('isRollforwardInProgress');
const selectIsDeletingEngagement = state => state.engagement.get('isDeletingEngagement');
const selectIsApprovingDataSourceSubscription = state => state.engagement.get('isApprovingDataSourceSubscription');
const selectIsRejectingDataSourceSubscription = state => state.engagement.get('isRejectingDataSourceSubscription');
const selectIsConfiguringDataSourceExtractionScript = state =>
  state.engagement.get('isConfiguringDataSourceExtractionScript');
const selectIsDeletingDataSourceConfig = state => state.engagement.get('isDeletingDataSourceConfig');
const selectIsDeletingConnection = state => state.engagement.get('isDeletingConnection');
const selectEngagementRenameStatus = state => state.engagement.get('engagementRenameStatus');

export const engagementSelectors = {
  selectEngagement,
  selectFetchingEngagement,
  selectMyList,
  selectFetchingMyList,
  selectUserList,
  selectFetchingUserList,
  readOnlyfromEng,
  selectClientEngagementList,
  selectIsFetchingClientEngagementList,
  selectMatClientEngagements,
  selectMatGlobalClientEngagements,
  selectIsFetchingMatClientEngagements,
  selectIsAddingEngagement,
  selectCreateEngagementUserInProgress,
  selectAddedEngagement,
  selectIsReconcilingEngagements,
  selectAreEngagementsReconciled,
  selectIsReconcileEngagementsModalOpen,
  selectAreEngagementsSynchedToOmnia,
  selectIsProvisioningEngagements,
  selectIsRollforwardInProgress,
  selectIsDeletingEngagement,
  selectIsApprovingDataSourceSubscription,
  selectIsRejectingDataSourceSubscription,
  selectIsConfiguringDataSourceExtractionScript,
  selectIsDeletingDataSourceConfig,
  selectIsDeletingConnection,
  selectEngagementRenameStatus,
};
