const isDataModelsFetching = state => state.contentLibraryDMs.get('isDataModelsFetching');
const datamodels = state => state.contentLibraryDMs.get('datamodels');
const publishedDatamodels = state => state.contentLibraryDMs.get('publishedDatamodels');
const datamodel = state => state.contentLibraryDMs.get('datamodel');
const isDMDataLoading = state => state.contentLibraryDMs.get('isDMDataLoading');
const isDMFieldDeleting = state => state.contentLibraryDMs.get('isDMFieldDeleting');
const fieldTypes = state => state.contentLibraryDMs.get('fieldTypes');
const isFetchingFieldTypes = state => state.contentLibraryDMs.get('isFetchingFieldTypes');
const isDMFieldUpdating = state => state.contentLibraryDMs.get('isDMFieldUpdating');
const isDMUpdating = state => state.contentLibraryDMs.get('isDMUpdating');
const guidanceLoader = state => state.contentLibraryDMs.get('guidanceLoader');
const isDMStatusUpdating = state => state.contentLibraryDMs.get('isDMStatusUpdating');
const isDMDeleting = state => state.contentLibraryDMs.get('isDMDeleting');
const isDMValidating = state => state.contentLibraryDMs.get('isDMValidating');
const isUploadExample = state => state.contentLibraryDMs.get('isUploadExample');
const uploadExapmleError = state => state.contentLibraryDMs.get('uploadExapmleError');
const isUploadDM = state => state.contentLibraryDMs.get('isUploadDM');
const uploadDMError = state => state.contentLibraryDMs.get('uploadDMError');
const isCreatingNewDMT = state => state.contentLibraryDMs.get('isCreatingNewDMT');
const isFetchingDMTsFromDM = state => state.contentLibraryDMs.get('isFetchingDMTsFromDM');
const dmtsList = state => state.contentLibraryDMs.get('dmtsList');
const isValidatingDMT = state => state.contentLibraryDMs.get('isValidatingDMT');
const isFetchingDMMap = state => state.contentLibraryDMs.get('isFetchingDMMap');
const dmMapping = state => state.contentLibraryDMs.get('dmMapping');
const dmMappingError = state => state.contentLibraryDMs.get('dmMappingError');
const allEnvironments = state => state.contentLibraryDMs.get('allEnvironments');
const environmentContent = state => state.contentLibraryDMs.get('environmentContent');
const isFetchingEnvironments = state => state.contentLibraryDMs.get('isFetchingEnvironments');
const isFetchingEnvContent = state => state.contentLibraryDMs.get('isFetchingEnvContent');
const isIngestingDataModel = state => state.contentLibraryDMs.get('isIngestingDataModel');
const ingestingModalContent = state => state.contentLibraryDMs.get('ingestingModalContent');
const showRenamePopoup = state => state.contentLibraryDMs.get('showRenamePopoup');
const environmentContentDMT = state => state.contentLibraryDMs.get('environmentContentDMT');
const isIngestingDMT = state => state.contentLibraryDMs.get('isIngestingDMT');
const dmtsListToIngest = state => state.contentLibraryDMs.get('dmtsListToIngest');
const isFetchingDMTsToIngest = state => state.contentLibraryDMs.get('isFetchingDMTsToIngest');
const isDMTIngestQueue = state => state.contentLibraryDMs.get('isDMTIngestQueue');
const isFetchingDMTsIngestStatus = state => state.contentLibraryDMs.get('isFetchingDMTsIngestStatus');
const dmtsIngestionStatus = state => state.contentLibraryDMs.get('dmtsIngestionStatus');
const handleRefreshIcon = state => state.contentLibraryDMs.get('handleRefreshIcon');
const isHistoryLoading = state => state.contentLibraryDMs.get('isHistoryLoading');
const dMHistoryData = state => state.contentLibraryDMs.get('dMHistoryData');

export const contentLibraryDMSelectors = {
  isDataModelsFetching,
  datamodels,
  publishedDatamodels,
  datamodel,
  isDMDataLoading,
  isDMFieldDeleting,
  fieldTypes,
  isFetchingFieldTypes,
  isDMFieldUpdating,
  isDMUpdating,
  guidanceLoader,
  isDMStatusUpdating,
  isDMDeleting,
  isDMValidating,
  isUploadExample,
  uploadExapmleError,
  isUploadDM,
  uploadDMError,
  isCreatingNewDMT,
  isFetchingDMTsFromDM,
  dmtsList,
  isValidatingDMT,
  isFetchingDMMap,
  dmMapping,
  dmMappingError,
  allEnvironments,
  isFetchingEnvironments,
  environmentContent,
  isFetchingEnvContent,
  isIngestingDataModel,
  ingestingModalContent,
  showRenamePopoup,
  isIngestingDMT,
  environmentContentDMT,
  dmtsListToIngest,
  isFetchingDMTsToIngest,
  isDMTIngestQueue,
  isFetchingDMTsIngestStatus,
  dmtsIngestionStatus,
  handleRefreshIcon,
  isHistoryLoading,
  dMHistoryData,
};
