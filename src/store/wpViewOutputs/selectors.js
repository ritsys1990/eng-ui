const selectIsLoading = state => state.wpViewOutputs.get('isLoading');
const selectData = state => state.wpViewOutputs.get('data');
const selectError = state => state.wpViewOutputs.get('error');

export const wpViewOutputsSelectors = {
  selectIsLoading,
  selectData,
  selectError,
};
