const isLoading = state => state.wpHistory.get('isLoading');
const data = state => state.wpHistory.get('data');

export const wpHistorySelectors = {
  isLoading,
  data,
};
