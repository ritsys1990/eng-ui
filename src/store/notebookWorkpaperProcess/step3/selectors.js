const selectLoading = state => state.notebookWPProcess.notebookWPStep3.get('loading');
const selectOutputs = workpaperId => state => state.notebookWPProcess.notebookWPStep3.get('outputs').get(workpaperId);
const selectOutput = state => state.notebookWPProcess.notebookWPStep3.get('output');
const selectWorkbooks = state => state.notebookWPProcess.notebookWPStep3.get('workbooks');
const selectPublishStatus = state => state.notebookWPProcess.notebookWPStep3.get('publishStatus');
const selectGenerateWorkbooksState = state => state.notebookWPProcess.notebookWPStep3.get('generateWorkbooksState');
const selectIsFetchingOutput = state => state.wpProcess.step3.get('isFetchingOutput');
const selectIsWorkpaperOutputLoading = state =>
  state.notebookWPProcess.notebookWPStep3.get('isFetchingOutput') || state.wpProcess.general.get('isLoading');
const selectIsFetchingWorkbooks = state => state.notebookWPProcess.notebookWPStep3.get('fetchingWorkbooks');

export const notebookWPStep3Selector = {
  selectLoading,
  selectOutputs,
  selectOutput,
  selectWorkbooks,
  selectPublishStatus,
  selectGenerateWorkbooksState,
  selectIsFetchingOutput,
  selectIsWorkpaperOutputLoading,
  selectIsFetchingWorkbooks,
};
