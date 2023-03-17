import { Map as ImmutableMap } from 'immutable';
import { DataWranglerActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  isFetchingModified: ImmutableMap({}),
  isDatasetUpdating: false,
  isFlowModified: ImmutableMap({}),
  isFetchingFlowDetails: ImmutableMap({}),
  flowDetails: ImmutableMap({}),
  isRunningSpecificDataFlows: ImmutableMap({}),
  isValidatingFlow: ImmutableMap({}),
  isEditHistory: false,
});

export default function reduce(state = initialState, action = {}) {
  let dwIsFlowModified;
  let dwIsFetchingModified;
  let dwIsFetchingFlowDetails;
  let dwFlowDetails;
  let dwIsRunningSpecificDataFlows;
  let dwIsValidatingFlow;

  switch (action.type) {
    case DataWranglerActionTypes.ADD_DATASET_TO_FLOW:
    case DataWranglerActionTypes.UPDATE_DATASET_FILEPATH:
      return state.merge({
        isDatasetUpdating: true,
      });

    case DataWranglerActionTypes.ADD_DATASET_TO_FLOW_SUCCESS:
    case DataWranglerActionTypes.ADD_DATASET_TO_FLOW_ERROR:
    case DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_SUCCESS:
    case DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_ERROR:
      return state.merge({
        isDatasetUpdating: false,
      });

    case DataWranglerActionTypes.GET_FLOW_MODIFIED:
      dwIsFlowModified = {};
      dwIsFlowModified[action.payload.workpaperId] = false;
      dwIsFetchingModified = {};
      dwIsFetchingModified[action.payload.workpaperId] = true;

      return state.merge({
        isFlowModified: state.get('isFlowModified').merge(dwIsFlowModified),
        isFetchingModified: state.get('isFetchingModified').merge(dwIsFetchingModified),
      });

    case DataWranglerActionTypes.GET_FLOW_MODIFIED_SUCCESS:
      dwIsFlowModified = {};
      dwIsFlowModified[action.payload.workpaperId] = action.payload.isFlowModified;
      dwIsFetchingModified = {};
      dwIsFetchingModified[action.payload.workpaperId] = false;

      return state.merge({
        isFlowModified: state.get('isFlowModified').merge(dwIsFlowModified),
        isFetchingModified: state.get('isFetchingModified').merge(dwIsFetchingModified),
      });

    case DataWranglerActionTypes.GET_FLOW_MODIFIED_ERROR:
      dwIsFlowModified = {};
      dwIsFlowModified[action.payload.workpaperId] = false;
      dwIsFetchingModified = {};
      dwIsFetchingModified[action.payload.workpaperId] = false;

      return state.merge({
        isFlowModified: state.get('isFlowModified').merge(dwIsFlowModified),
        isFetchingModified: state.get('isFetchingModified').merge(dwIsFetchingModified),
      });

    case DataWranglerActionTypes.GET_FLOW_DETAILS:
      dwIsFetchingFlowDetails = {};
      dwIsFetchingFlowDetails[action.payload.workpaperId] = true;
      dwFlowDetails = {};
      dwFlowDetails[action.payload.workpaperId] = null;

      return state.merge({
        isFetchingFlowDetails: state.get('isFetchingFlowDetails').merge(dwIsFetchingFlowDetails),
        flowDetails: state.get('flowDetails').merge(dwFlowDetails),
      });

    case DataWranglerActionTypes.GET_FLOW_DETAILS_SUCCESS:
      dwIsFetchingFlowDetails = {};
      dwIsFetchingFlowDetails[action.payload.workpaperId] = false;
      dwFlowDetails = {};
      dwFlowDetails[action.payload.workpaperId] = action.payload.flowDetails;

      return state.merge({
        isFetchingFlowDetails: state.get('isFetchingFlowDetails').merge(dwIsFetchingFlowDetails),
        flowDetails: state.get('flowDetails').merge(dwFlowDetails),
      });

    case DataWranglerActionTypes.GET_FLOW_DETAILS_ERROR:
      dwIsFetchingFlowDetails = {};
      dwIsFetchingFlowDetails[action.payload.workpaperId] = false;

      return state.merge({
        isFetchingFlowDetails: state.get('isFetchingFlowDetails').merge(dwIsFetchingFlowDetails),
      });

    case DataWranglerActionTypes.RUN_SPECIFIC_DATA_FLOWS:
      dwIsRunningSpecificDataFlows = {};
      dwIsRunningSpecificDataFlows[action.payload.workpaperId] = true;

      return state.merge({
        isRunningSpecificDataFlows: state.get('isRunningSpecificDataFlows').merge(dwIsRunningSpecificDataFlows),
      });

    case DataWranglerActionTypes.RUN_SPECIFIC_DATA_FLOWS_ERROR:
    case DataWranglerActionTypes.RUN_SPECIFIC_DATA_FLOWS_SUCCESS:
      dwIsRunningSpecificDataFlows = {};
      dwIsRunningSpecificDataFlows[action.payload.workpaperId] = false;

      return state.merge({
        isRunningSpecificDataFlows: state.get('isRunningSpecificDataFlows').merge(dwIsRunningSpecificDataFlows),
      });

    case DataWranglerActionTypes.VALIDATE_FLOW_RECIPES:
      dwIsValidatingFlow = {};
      dwIsValidatingFlow[action.payload.workpaperId] = true;

      return state.merge({
        isValidatingFlow: state.get('isValidatingFlow').merge(dwIsValidatingFlow),
      });

    case DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_SUCCESS:
    case DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_ERROR:
      dwIsValidatingFlow = {};
      dwIsValidatingFlow[action.payload.workpaperId] = false;

      return state.merge({
        isValidatingFlow: state.get('isValidatingFlow').merge(dwIsValidatingFlow),
      });

    case DataWranglerActionTypes.GET_EDIT_RECIPES_HISTORY:
      return state.merge({
        isEditHistory: true,
      });

    case DataWranglerActionTypes.GET_EDIT_RECIPES_HISTORY_SUCCESS:
    case DataWranglerActionTypes.GET_EDIT_RECIPES_HISTORY_ERROR:
      return state.merge({
        isEditHistory: false,
      });

    default:
      return state;
  }
}
