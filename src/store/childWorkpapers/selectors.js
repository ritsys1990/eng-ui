const childWorkPapersList = state => state.childWorkpapers.get('childWorkPapersList');
const fetchingChildWorkpapers = state => state.childWorkpapers.get('fetchingChildWorkpapers');
const maxChildWorkPapersLimit = state => state.childWorkpapers.get('maxChildWorkPapersLimit');
const selectSavingChildWorkpaperFilterData = state => state.childWorkpapers.get('savingChildWorkpaperFilterData');
const maxGenerateOutputChildWorkPapersLimit = state =>
  state.childWorkpapers.get('maxGenerateOutputChildWorkPapersLimit');
const selectIsDeletingChildWorkpaper = state => state.childWorkpapers.get('isDeletingChildWorkpaper');
const isGenerateOutputSuccess = state => state.childWorkpapers.get('isGenerateOutputSuccess');
const childWpColumns = state => state.childWorkpapers.get('childWpColumns');
const outputs = workpaperId => state => state.childWorkpapers.get('outputs').get(workpaperId);

export const childWorkpaperSelectors = {
  childWorkPapersList,
  fetchingChildWorkpapers,
  maxChildWorkPapersLimit,
  selectSavingChildWorkpaperFilterData,
  maxGenerateOutputChildWorkPapersLimit,
  selectIsDeletingChildWorkpaper,
  isGenerateOutputSuccess,
  childWpColumns,
  outputs,
};
