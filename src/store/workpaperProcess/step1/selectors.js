const selectIsStep1Completed = state => state.wpProcess.step1.get('completed');
const selectInputs = state => state.wpProcess.step1.get('inputs');
const selectInput = state => state.wpProcess.step1.get('input');
const selectIsLoading = state => state.wpProcess.step1.get('isLoading');
const selectOutdatedDatamodels = state => state.wpProcess.step1.get('outdatedDatamodels');
const isAttachingFile = state => state.wpProcess.step1.get('isAttachingFile');
const lastRefresh = state => state.wpProcess.step1.get('lastRefresh');
const existingMappings = state => state.wpProcess.step1.get('existingMappings');
const isFetchingExistingMappings = state => state.wpProcess.step1.get('isFetchingExistingMappings');
const fetchingInput = state => state.wpProcess.step1.get('fetchingInput');
const isUpdatingInput = state => state.wpProcess.step1.get('isUpdatingInput');
const preview = state => state.wpProcess.step1.get('preview');
const selectUpdatedInput = state => state.wpProcess.step1.get('isgettingUpdatedInput');
const isSettingStatus = state => state.wpProcess.step1.get('isSettingStatus');
const isInputOptionTriggered = state => state.wpProcess.step1.get('isInputOptionTriggered');
const isTrifactaDatasetRename = state => state.wpProcess.step1.get('isTrifactaDatasetRename');
const isInputDataClearing = state => state.wpProcess.step1.get('isInputDataClearing');
const isDatasetDeleting = state => state.wpProcess.step1.get('isDatasetDeleting');
const isAddingDatasetToFlow = state => state.wpProcess.step1.get('isAddingDatasetToFlow');
const isRetryingInputFileCopy = state => state.wpProcess.step1.get('isRetryingInputFileCopy');
const isCheckingZipFile = state => state.wpProcess.step1.get('isCheckingZipFile');
const checkZipFileStatus = state => state.wpProcess.step1.get('checkZipFileStatus');
const isUpdatingTheInput = state => state.wpProcess.step1.get('isUpdatingTheInput');
const hasInputChanged = state => state.wpProcess.step1.get('hasInputChanged');
const datasetTypes = state => state.wpProcess.step1.get('datasetTypes');
const inputDetails = state => state.wpProcess.step1.get('inputDetails');
const updatingCentralizedInputs = state => state.wpProcess.step1.get('updatingCentralizedInputs');
const isTriggeringDMVsForZip = state => state.wpProcess.step1.get('isTriggeringDMVsForZip');
const isDownloadingExampleFile = state => state.wpProcess.step1.get('isDownloadingExampleFile');
const inputRelationship = state => state.wpProcess.step1.get('inputRelationship');
const isSettingAutoDmtFlag = state => state.wpProcess.step1.get('isSettingAutoDmtFlag');
const isGettingAutoDmtFlag = state => state.wpProcess.step1.get('isGettingAutoDmtFlag');
const autoDMTFlag = state => state.wpProcess.step1.get('autoDMTFlag');
const isReplacingDMLoader = state => state.wpProcess.step1.get('isReplacingDMLoader');
const isDataModelReplaced = state => state.wpProcess.step1.get('isDataModelReplaced');
const isFetchingMappingsreenPreview = state => state.wpProcess.step1.get('isFetchingPreview');

const isMappingScreenLoading = state => {
  return (
    state.wpProcess.step1.get('fetchingInput') ||
    state.wpProcess.general.get('isLoading') ||
    state.wpProcess.step1.get('isFetchingExistingMappings') ||
    state.wpProcess.step1.get('isFetchingInputData')
  );
};
const isInputDetailsLoading = state => {
  return state.wpProcess.general.get('isLoading') || state.wpProcess.step1.get('isFetchingInputData');
};

const isFetchingBundles = state => state.wpProcess.step1.get('isFetchingBundles');
const allTrifactaBundles = state => state.wpProcess.step1.get('allTrifactaBundles');
const connectTrifactBundles = state => state.wpProcess.step1.get('connectTrifactBundles');

export const wpStep1Selectors = {
  selectIsStep1Completed,
  selectInputs,
  preview,
  isAttachingFile,
  lastRefresh,
  existingMappings,
  selectInput,
  isFetchingExistingMappings,
  isUpdatingInput,
  fetchingInput,
  isMappingScreenLoading,
  selectIsLoading,
  selectOutdatedDatamodels,
  selectUpdatedInput,
  isSettingStatus,
  isInputOptionTriggered,
  isTrifactaDatasetRename,
  isInputDataClearing,
  isDatasetDeleting,
  isAddingDatasetToFlow,
  isRetryingInputFileCopy,
  isCheckingZipFile,
  checkZipFileStatus,
  isUpdatingTheInput,
  hasInputChanged,
  datasetTypes,
  inputDetails,
  isInputDetailsLoading,
  updatingCentralizedInputs,
  isTriggeringDMVsForZip,
  isDownloadingExampleFile,
  isFetchingBundles,
  allTrifactaBundles,
  connectTrifactBundles,
  inputRelationship,
  isSettingAutoDmtFlag,
  isGettingAutoDmtFlag,
  autoDMTFlag,
  isReplacingDMLoader,
  isDataModelReplaced,
  isFetchingMappingsreenPreview,
};
