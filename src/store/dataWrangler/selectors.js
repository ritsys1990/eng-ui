const isDatasetUpdating = state => state.dataWrangler.get('isDatasetUpdating');
const isFlowModified = workpaperId => state => state.dataWrangler.get('isFlowModified').get(workpaperId);
const isFetchingModified = workpaperId => state => state.dataWrangler.get('isFetchingModified').get(workpaperId);
const isFetchingFlowDetails = workpaperId => state => state.dataWrangler.get('isFetchingFlowDetails').get(workpaperId);
const flowDetails = workpaperId => state => state.dataWrangler.get('flowDetails').get(workpaperId);
const isRunningSpecificDataFlows = workpaperId => state =>
  state.dataWrangler.get('isRunningSpecificDataFlows').get(workpaperId);
const selectIsValidatingFlow = workpaperId => state => state.dataWrangler.get('isValidatingFlow').get(workpaperId);

export const datawranglerSelectors = {
  isDatasetUpdating,
  isFlowModified,
  isFetchingModified,
  isFetchingFlowDetails,
  flowDetails,
  isRunningSpecificDataFlows,
  selectIsValidatingFlow,
};
