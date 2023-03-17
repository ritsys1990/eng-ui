const selectLoading = state => state.wpProcess.step3.get('loading');
const selectCloning = state => state.wpProcess.step3.get('cloning');
const selectCloningState = state => state.wpProcess.step3.get('cloningState');
const selectReady = state => state.wpProcess.step3.get('ready');
const selectOutputs = workpaperId => state => state.wpProcess.step3.get('outputs').get(workpaperId);
const selectOutput = state => state.wpProcess.step3.get('output');
const selectOutputsDetail = state => state.wpProcess.step3.get('outputsDetail');
const selectIsFetchingOutputsDetail = state => state.wpProcess.step3.get('isFetchingOutputsDetail');
const selectIsFetchingOutput = state => state.wpProcess.step3.get('isFetchingOutput');
const selectIsSavingCSV = state => state.wpProcess.step3.get('isSavingCSV');
const selectIsSavingToJE = state => state.wpProcess.step3.get('isSavingToJE');
const selectIsSyncingOutputs = state => state.wpProcess.step3.get('syncingOutputs');
const selectUngroupedOutputs = workpaperId => state => state.wpProcess.step3.get('ungroupedOutputs').get(workpaperId);
const selectIsWorkpaperOutputLoading = state =>
  state.wpProcess.step3.get('isFetchingOutput') || state.wpProcess.general.get('isLoading');
const selectWorkbooks = state => state.wpProcess.step3.get('workbooks');
const selectIsFetchingWorkbooks = state => state.wpProcess.step3.get('fetchingWorkbooks');
const selectPublishStatus = state => state.wpProcess.step3.get('publishStatus');
const isOutputDownloading = state => state.wpProcess.step3.get('isOutputDownloading');
const selectLabelsAdded = state => state.wpProcess.step3.get('listOfLabelsAdded');
const duplicateLabelList = state => state.wpProcess.step3.get('duplicateLabelList');
const engagmentLabels = state => state.wpProcess.step3.get('engagmentLabels');
const isLabelUpdating = state => state.wpProcess.step3.get('isLabelUpdating');
const labelError = state => state.wpProcess.step3.get('labelError');
const selectIsSavingToSql = state => state.wpProcess.step3.get('isSavingToSql');
const selectIsLoadingSchema = state => state.wpProcess.step3.get('isLoadingSchema');
const selectOutputSchema = state => state.wpProcess.step3.get('schema');
const selectSetupTableauError = state => state.wpProcess.step3.get('setupTableauError');
const selectIsSettingUpTableau = state => state.wpProcess.step3.get('isSettingUpTableau');
const selectHasSetupTableau = state => state.wpProcess.step3.get('hasSetupTableau');
const isFetchingLabels = state => state.wpProcess.step3.get('isFetchingLabels');
const selectIsSavingToDL = state => state.wpProcess.step3.get('isSavingToDL');
const activeWPLabels = state => state.wpProcess.step3.get('activeWPLabels');
const selectIsGeneratingWorksbooks = state => state.wpProcess.step3.get('isGeneratingWorksbooks');
const selectGenerateWorkbooksError = state => state.wpProcess.step3.get('generateWorkbooksError');
const selectIsDownloadingAllOutputs = state => state.wpProcess.step3.get('isDownloadingAllOutputs');
const selectGenerateWorkbooksState = state => state.wpProcess.step3.get('generateWorkbooksState');
const addDMToOutputLoader = state => state.wpProcess.step3.get('addDMToOutputLoader');
const addTableauTailoring = state => state.wpProcess.step3.get('addTableauTailoring');
const isUpdatingWbFlag = state => state.wpProcess.step3.get('isUpdatingWbFlag');
const validatingDMState = state => state.wpProcess.step3.get('validatingDMstate');
const validatingDMInfo = state => state.wpProcess.step3.get('validatingDMInfo');
const selectIsReportGenerated = state => state.wpProcess.step3.get('isReportGenerated');
const selectIsDownloadingReport = state => state.wpProcess.step3.get('isDownloadingReport');

export const wpStep3Selectors = {
  selectLoading,
  selectCloning,
  selectCloningState,
  selectReady,
  selectOutputs,
  selectOutput,
  selectOutputsDetail,
  selectIsFetchingOutputsDetail,
  selectIsFetchingOutput,
  selectIsSavingCSV,
  selectIsSavingToJE,
  selectIsSyncingOutputs,
  selectUngroupedOutputs,
  selectIsWorkpaperOutputLoading,
  selectWorkbooks,
  selectPublishStatus,
  selectIsFetchingWorkbooks,
  isOutputDownloading,
  selectLabelsAdded,
  duplicateLabelList,
  engagmentLabels,
  isLabelUpdating,
  labelError,
  selectIsSavingToSql,
  selectIsLoadingSchema,
  selectOutputSchema,
  selectSetupTableauError,
  selectIsSettingUpTableau,
  selectHasSetupTableau,
  isFetchingLabels,
  selectIsSavingToDL,
  activeWPLabels,
  selectIsGeneratingWorksbooks,
  selectGenerateWorkbooksError,
  selectIsDownloadingAllOutputs,
  selectGenerateWorkbooksState,
  addDMToOutputLoader,
  addTableauTailoring,
  isUpdatingWbFlag,
  validatingDMState,
  validatingDMInfo,
  selectIsReportGenerated,
  selectIsDownloadingReport,
};
