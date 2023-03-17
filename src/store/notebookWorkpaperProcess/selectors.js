const selectWorkPaper = state => state.notebookWPProcess.notebookWPGeneral.get('workpaper');
const selectWTemplate = state => state.notebookWPProcess.notebookWPGeneral.get('template');
const selectIsLoading = state => state.notebookWPProcess.notebookWPGeneral.get('isLoading');
const selectIsFetchingWP = state => state.notebookWPProcess.notebookWPGeneral.get('isFetchingWorkpaper');
const selectWpStatus = state => state.notebookWPProcess.notebookWPGeneral.get('wpStatus');
const executionStatus = state => state.notebookWPProcess.notebookWPGeneral.get('executionStatus');
const errorOnSaveParameters = state => state.notebookWPProcess.notebookWPGeneral.get('errorOnSaveParameters');
const isNotebookAttached = state => state.notebookWPProcess.notebookWPGeneral.get('isNotebookAttached');
const errorOnLinking = state => state.notebookWPProcess.notebookWPGeneral.get('errorOnLinking');
const resetExecution = state => state.notebookWPProcess.notebookWPGeneral.get('resetExecution');
const workpaperProgress = workpaperId => state =>
  state.notebookWPProcess.notebookWPGeneral.get('progress').get(workpaperId);

export const notebookWPProcessSelectors = {
  selectWorkPaper,
  selectWTemplate,
  selectIsLoading,
  selectIsFetchingWP,
  selectWpStatus,
  executionStatus,
  errorOnSaveParameters,
  isNotebookAttached,
  errorOnLinking,
  resetExecution,
  workpaperProgress,
};
