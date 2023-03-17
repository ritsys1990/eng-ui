const selectInput = state => state.notebookWPProcess.notebookWPStep1.get('input');
const fetchingInput = state => state.notebookWPProcess.notebookWPStep1.get('fetchingInput');
const selectInputs = state => state.notebookWPProcess.notebookWPStep1.get('inputs');
const isAttachingFile = state => state.notebookWPProcess.notebookWPStep1.get('isAttachingFile');
const isMappingScreenLoading = state => {
  return (
    state.notebookWPProcess.notebookWPStep1.get('fetchingInput') ||
    state.wpProcess.general.get('isLoading') ||
    state.notebookWPProcess.notebookWPStep1.get('isFetchingInputData')
  );
};
const isFetchingMappingsreenPreview = state => state.notebookWPProcess.notebookWPStep1.get('isFetchingPreview');
const preview = state => state.notebookWPProcess.notebookWPStep1.get('preview');
const isFileAttached = state => state.notebookWPProcess.notebookWPStep1.get('isFileAttached');

export const notebookWPStep1Selector = {
  selectInputs,
  selectInput,
  isAttachingFile,
  fetchingInput,
  isMappingScreenLoading,
  isFetchingMappingsreenPreview,
  preview,
  isFileAttached,
};
