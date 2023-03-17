const selectList = state => state.client.get('list');
const selectFetchingList = state => state.client.get('fetchingList');
const selectMyList = state => state.client.get('myList');
const selectFetchingMyList = state => state.client.get('fetchingMyList');
const selectMatSearch = state => state.client.get('matSearch');
const selectFetchingMatSearch = state => state.client.get('fetchingMatSearch');
const selectCreateClientInProgress = state => state.client.get('createClientInProgress');
const selectCreateClientUserInProgress = state => state.client.get('createClientUserInProgress');
const selectRetrieveClientUserInProgress = state => state.client.get('retrieveClientUserInProgress');
const selectCreateStorageInProgress = state => state.client.get('createStorageInProgress');
const selectClient = state => state.client.get('client');
const selectFetchingClient = state => state.client.get('fetchingClient');
const selectFetchingNotices = state => state.client.get('fetchingNotices');
const selectNoticesBlob = state => state.client.get('noticesBlob');
const selectIsDeletingClient = state => state.client.get('isDeletingClient');
const selectMatClient = state => state.client.get('matClient');
const selectIsFetchingMatClient = state => state.client.get('isFetchingMatClient');
const selectMatClientEntities = state => state.client.get('matClientEntities');
const selectIsFetchingMatClientEntities = state => state.client.get('isFetchingMatClientEntities');
const selectIsSavingClient = state => state.client.get('isSavingClient');
const selectClientSetupState = state => state.client.get('clientSetupState');
const selectIsAddingEntity = state => state.client.get('isAddingEntity');
const selectIsEntitySaving = state => state.client.get('isEntitySaving');
const selectIsDeletingEntity = state => state.client.get('isDeletingEntity');
const selectIsGettingOrg = state => state.client.get('isGettingOrg');
const selectOrg = state => state.client.get('org');
const selectisDeletingOrg = state => state.client.get('isDeletingOrg');
const selectIsCreatingOrg = state => state.client.get('isCreatingOrg');
const selectIsLinkingOrg = state => state.client.get('isLinkingOrg');
const selectIsCreatingSubOrg = state => state.client.get('isCreatingSubOrg');
const selectIsDeletingSubOrg = state => state.client.get('isDeletingSubOrg');
const selectIsUpdatingSubOrg = state => state.client.get('isUpdatingSubOrg');
const selectAddingDomain = state => state.client.get('addingDomain');
const selectDeletingDomain = state => state.client.get('deletingDomain');
const selectIsGeneratingToken = state => state.client.get('isGeneratingToken');
const selectSubOrgToken = state => state.client.get('subOrgToken');
const selectIsGettingAgents = state => state.client.get('isGettingAgents');
const selectAgents = state => state.client.get('agents');
const selectIsTestingConnection = state => state.client.get('isTestingConnection');
const selectIsTestResultError = state => state.client.get('isTestResultError');
const selectConnectionList = state => state.client.get('connectionList');

const selectCreateClientLoading = ({ client }) => {
  return (
    client.get('createClientInProgress') ||
    client.get('createClientUserInProgress') ||
    client.get('retrieveClientUserInProgress') ||
    client.get('createStorageInProgress')
  );
};
const selectDataSources = state => state.client.get('dataSources');
const selectIsFetchingDataSources = state => state.client.get('isFetchingDataSources');
const selectDSConnections = state => state.client.get('dSConnections');
const selectIsFetchingDSConnections = state => state.client.get('isFetchingDSConnections');

const selectIsSavingDataSource = state => state.client.get('isSavingDataSource');
const selectIsDeletingDataSource = state => state.client.get('isDeletingDataSource');
const selectSaveDataSourceError = state => state.client.get('saveDataSourceError');

const selectRuntimeDataInProgress = state => state.client.get('fetchingRuntimeData');
const selectRuntimeDataList = state => state.client.get('runtimeEnvironmentList');
const selectConnectionTemplateList = state => state.client.get('connectionTemplateList');
const selectConnectionTemplateInProgress = state => state.client.get('fetchingConnTempDataInProgress');
const selectConnTempInProgress = state => state.client.get('fetchingConnTempData');

const selectIsCreatingDataSourceConnection = state => state.client.get('isCreatingDataSourceConnection');
const selectCreateDataSourceConnectionError = state => state.client.get('createDataSourceConnectionError');

const selectIsSettingConnectionAsDefault = state => state.client.get('isSettingConnectionAsDefault');
const selectIsUpdatingClientUsesSecureAgent = state => state.client.get('isUpdatingClientUsesSecureAgent');

export const clientSelectors = {
  selectList,
  selectFetchingList,
  selectMyList,
  selectFetchingMyList,
  selectMatSearch,
  selectFetchingMatSearch,
  selectCreateClientInProgress,
  selectCreateClientUserInProgress,
  selectRetrieveClientUserInProgress,
  selectCreateStorageInProgress,
  selectClient,
  selectFetchingClient,
  selectFetchingNotices,
  selectNoticesBlob,
  selectIsDeletingClient,
  selectCreateClientLoading,
  selectDataSources,
  selectIsFetchingDataSources,
  selectDSConnections,
  selectIsFetchingDSConnections,
  selectMatClient,
  selectIsFetchingMatClient,
  selectMatClientEntities,
  selectIsFetchingMatClientEntities,
  selectIsSavingClient,
  selectIsGettingOrg,
  selectOrg,
  selectClientSetupState,
  selectisDeletingOrg,
  selectIsCreatingOrg,
  selectIsLinkingOrg,
  selectIsAddingEntity,
  selectIsCreatingSubOrg,
  selectIsDeletingSubOrg,
  selectIsUpdatingSubOrg,
  selectIsSavingDataSource,
  selectSaveDataSourceError,
  selectIsEntitySaving,
  selectIsDeletingEntity,
  selectIsDeletingDataSource,
  selectAddingDomain,
  selectDeletingDomain,
  selectIsGeneratingToken,
  selectSubOrgToken,
  selectRuntimeDataList,
  selectRuntimeDataInProgress,
  selectConnectionTemplateList,
  selectConnectionTemplateInProgress,
  selectIsGettingAgents,
  selectAgents,
  selectConnTempInProgress,
  selectIsCreatingDataSourceConnection,
  selectCreateDataSourceConnectionError,
  selectIsTestingConnection,
  selectIsTestResultError,
  selectConnectionList,
  selectIsSettingConnectionAsDefault,
  selectIsUpdatingClientUsesSecureAgent,
};
