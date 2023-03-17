const isFetchingCDMs = state => state.commonDatamodels.get('isFetchingCDMs');
const commonDatamodels = state => state.commonDatamodels.get('commonDatamodels');
const isUpdatingCDM = state => state.commonDatamodels.get('isUpdatingCDM');
const isDeletingCDM = state => state.commonDatamodels.get('isDeletingCDM');
const isFetchingMappedDMs = state => state.commonDatamodels.get('isFetchingMappedDMs');
const mappedDMs = state => state.commonDatamodels.get('mappedDMs');
const cdmsMap = state => state.commonDatamodels.get('cdmsMap');

export const commonDatamodelSelectors = {
  isFetchingCDMs,
  commonDatamodels,
  isUpdatingCDM,
  isDeletingCDM,
  isFetchingMappedDMs,
  mappedDMs,
  cdmsMap,
};
