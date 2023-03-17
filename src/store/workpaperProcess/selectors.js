const selectWorkPaper = state => state.wpProcess.general.get('workpaper');
const selectWTemplate = state => state.wpProcess.general.get('template');
const selectLatestTemplate = state => state.wpProcess.general.get('latestTemplate');
const selectIsLoading = state => state.wpProcess.general.get('isLoading');
const selectIsFetchingWP = state => state.wpProcess.general.get('isFetchingWorkpaper');
const selectWpStatus = state => state.wpProcess.general.get('wpStatus');
const selectIsFetchingDMTs = state => state.wpProcess.general.get('isFetchingDMTs');
const selectDMTs = state => state.wpProcess.general.get('dmts');
const selectDMT = dmtId => state => state.wpProcess.general.get('dmts').find(dmt => dmt.id === dmtId);
const buttonLoading = state => state.wpProcess.general.get('buttonLoading');
const readOnlyfromWP = state => state.wpProcess.general.get('readOnlyfromWP');
const isCentralizedDSUpdated = state => state.wpProcess.general.get('isCentralizedDSUpdated');
const isChildWorkpapersStatusCompleted = state => state.wpProcess.general.get('isChildWorkpapersStatusCompleted');
const overallCloningBundle = state => state.wpProcess.general.get('isCloningBundle');
const isCloningBundle = state => {
  const cloningBundle = state.wpProcess.general.get('isCloningBundle');
  const [...values] = cloningBundle.values();

  return values.some(x => !!x);
};
const isOutputDownloading = state => state.wpProcess.general.get('isOutputDownloading');
const isDownloadingAllOutputs = state => state.wpProcess.general.get('isDownloadingAllOutputs');

export const wpProcessSelectors = {
  selectWorkPaper,
  selectWTemplate,
  selectIsLoading,
  selectIsFetchingWP,
  selectWpStatus,
  buttonLoading,
  readOnlyfromWP,
  isCentralizedDSUpdated,
  selectLatestTemplate,
  selectIsFetchingDMTs,
  selectDMTs,
  selectDMT,
  isChildWorkpapersStatusCompleted,
  isCloningBundle,
  overallCloningBundle,
  isOutputDownloading,
  isDownloadingAllOutputs,
};
