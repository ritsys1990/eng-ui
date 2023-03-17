// note: this state can also refer to "Step 1A: Data Model Transformations"
const isLoading = workpaperId => state => state.wpProcess.step2.get('isLoading').get(workpaperId);
const jrStepDetails = workpaperId => state => state.wpProcess.step2.get('jrStepDetails').get(workpaperId);
const workpaperProgress = workpaperId => state => state.wpProcess.step2.get('progress').get(workpaperId);
const overallProgress = state => state.wpProcess.step2.get('progress');
const isFetchingStatus = workpaperId => state => state.wpProcess.step2.get('isFetchingStatus').get(workpaperId);
const importProgress = state => state.wpProcess.step2.get('importProgress');
const flowButtonLoading = state => state.wpProcess.step2.get('flowButtonLoading');
const trifactaParameters = workpaperId => state => state.wpProcess.step2.get('trifactaParameters').get(workpaperId);
const trifactaJRSteps = workpaperId => state => state.wpProcess.step2.get('trifactaJRSteps').get(workpaperId);
const fetchingTrifactaParams = workpaperId => state =>
  state.wpProcess.step2.get('fetchingTrifactaParams').get(workpaperId);
const fetchingTrifactaJRSteps = workpaperId => state =>
  state.wpProcess.step2.get('fetchingTrifactaJRSteps').get(workpaperId);
const importFlowInitiatePolling = state => state.wpProcess.step2.get('importFlowInitiatePolling');
const isDMTStepComplete = state => state.wpProcess.step2.get('isDMTStepComplete');
const isDMTStepPartiallyComplete = state => state.wpProcess.step2.get('isDMTStepPartiallyComplete');
const isDMTStepShown = state => state.wpProcess.step2.get('isDMTStepShown');
const isFetchingAutoRun = state => state.wpProcess.step2.get('isFetchingAutoRun');
const didFinishAutoRun = state => state.wpProcess.step2.get('didFinishAutoRun');

export const WPProcessingSelectors = {
  isLoading,
  jrStepDetails,
  workpaperProgress,
  isFetchingStatus,
  importProgress,
  flowButtonLoading,
  trifactaParameters,
  trifactaJRSteps,
  fetchingTrifactaParams,
  fetchingTrifactaJRSteps,
  importFlowInitiatePolling,
  isDMTStepComplete,
  isDMTStepPartiallyComplete,
  isDMTStepShown,
  overallProgress,
  isFetchingAutoRun,
  didFinishAutoRun,
};
