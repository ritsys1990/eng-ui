const selectErrors = state => state.errors.get('errors');
const selectAddClientErrors = state => state.errors.get('addClientErrors');
const selectAddWorkpaperErrors = state => state.errors.get('addWorkpaperErrors');
const selectAddPipelineErrors = state => state.errors.get('addPipelineError');
const selectUpdatePipelineErrors = state => state.errors.get('updatePipelineError');
const selectInputFileErrors = state => state.errors.get('inputFileErrors');
const selectInputOptionsErrors = state => state.errors.get('inputFileErrors');
const selectWorkpaperProcessingErrors = workpaperId => state =>
  state.errors.get('workpaperProcessingErrors').get(workpaperId);
const selectImportFlowErrors = state => state.errors.get('importFlowErrors');
const selectReconcileClientErrors = state => state.errors.get('reconcileClientErrors');
const selectDMFieldErrors = state => state.errors.get('dmFieldErrors');
const selectAddEngagementErrors = state => state.errors.get('addEngagementErrors');
const selectGetRunTimeEnvironmentErrors = state => state.errors.get('getRunTimeEnvironmentErrors');
const selectConnectToBundleErrors = state => state.errors.get('connectBundleErrors');
const selectIngestDMTErrors = state => state.errors.get('ingestDMTErrors');

export const errorsSelectors = {
  selectErrors,
  selectAddClientErrors,
  selectAddWorkpaperErrors,
  selectAddPipelineErrors,
  selectUpdatePipelineErrors,
  selectInputFileErrors,
  selectWorkpaperProcessingErrors,
  selectInputOptionsErrors,
  selectImportFlowErrors,
  selectReconcileClientErrors,
  selectDMFieldErrors,
  selectAddEngagementErrors,
  selectGetRunTimeEnvironmentErrors,
  selectConnectToBundleErrors,
  selectIngestDMTErrors,
};
