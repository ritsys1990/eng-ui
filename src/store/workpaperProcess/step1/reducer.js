import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep1ActionTypes } from './actionTypes';
import { isEqual } from 'lodash';
import { isStep1Completed } from '../../../pages/WorkPaperProcess/utils/WorkPaperProcess.utils';

export const initialState = ImmutableMap({
  data: null,
  inputs: [],
  template: null,
  isLoading: true,
  complete: false,
  input: null,
  fetchingInput: false,
  preview: {
    data: {},
    schema: {},
  },
  isFetchingPreview: false,
  inputDetails: {
    data: {},
    schema: {},
  },
  isFetchingInputData: false,
  isUpdatingInput: false,
  isAttachingFile: false,
  completed: false,
  lastRefresh: null,
  isFetchingExistingMappings: false,
  existingMappings: null,
  outdatedDatamodels: [],
  isgettingUpdatedInput: false,
  isSettingStatus: false,
  isInputOptionTriggered: false,
  isTrifactaDatasetRename: false,
  isInputDataClearing: false,
  isDatasetDeleting: false,
  isAddingDatasetToFlow: false,
  isRetryingInputFileCopy: false,
  isCheckingZipFile: false,
  checkZipFileStatus: null,
  isUpdatingTheInput: false,
  hasInputChanged: false,
  updatingCentralizedInputs: false,
  datasetTypes: [],
  isTriggeringDMVsForZip: false,
  isDownloadingExampleFile: false,
  isFetchingBundles: false,
  connectTrifactBundles: false,
  allTrifactaBundles: {},
  isDecouplingDataRequest: false,
  isSettingAutoDmtFlag: false,
  isGettingAutoDmtFlag: false,
  decoupleDataRequestResult: null,
  inputRelationship: [],
  shouldAutoDMT: false,
  isReplacingDMLoader: false,
  isDataModelReplaced: false,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case WPProcessStep1ActionTypes.GET_INPUT:
      return state.merge({
        fetchingInput: true,
      });

    case WPProcessStep1ActionTypes.GET_INPUT_SUCCESS:
      return state.merge({
        fetchingInput: false,
        input: action.payload,
      });

    case WPProcessStep1ActionTypes.GET_INPUT_ERROR:
      return state.merge({
        input: null,
        fetchingInput: false,
      });

    case WPProcessStep1ActionTypes.RESET_INPUT:
      return state.merge({
        input: null,
      });

    case WPProcessStep1ActionTypes.GET_PREVIEW:
      return state.merge({
        isFetchingPreview: true,
        preview: {
          data: {},
          schema: {},
        },
      });

    case WPProcessStep1ActionTypes.GET_PREVIEW_SUCCESS:
      const { data, schema } = action.payload;

      const header = schema.map(item => item.name);
      const columns = data.map(item => header.map(h => item[h]));

      return state.merge({
        isFetchingPreview: false,
        preview: {
          type: action.payload.fileType,
          data: [header, ...columns],
        },
      });

    case WPProcessStep1ActionTypes.GET_PREVIEW_ERROR:
      return state.merge({
        isFetchingPreview: false,
        preview: {
          data: {},
          schema: {},
        },
      });

    case WPProcessStep1ActionTypes.GET_DATA:
      return state.merge({
        isLoading: true,
      });

    case WPProcessStep1ActionTypes.GET_DATA_SUCCESS:
      if (isEqual(action.payload.inputs, state.get('inputs')) && !action.payload.outdatedDatamodels) {
        return state.merge({
          isLoading: false,
        });
      }

      return state.merge({
        isLoading: false,
        inputs: action.payload.inputs,
        outdatedDatamodels: action.payload.outdatedDatamodels || state.get('outdatedDatamodels'),
        completed: isStep1Completed(action.payload.inputs),
      });

    case WPProcessStep1ActionTypes.GET_DATA_ERROR:
      return state.merge({
        isLoading: false,
        data: null,
      });

    case WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS:
      return state.merge({
        isFetchingExistingMappings: true,
        existingMappings: null,
      });

    case WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS_SUCCESS:
      return state.merge({
        isFetchingExistingMappings: false,
        existingMappings: action.payload,
      });

    case WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS_ERROR:
      return state.merge({
        isFetchingExistingMappings: false,
      });

    case WPProcessStep1ActionTypes.RESET:
      return state.merge({
        data: null,
        isLoading: true,
      });

    case WPProcessStep1ActionTypes.UPDATE_INPUT:
      return state.merge({
        isUpdatingInput: true,
      });

    case WPProcessStep1ActionTypes.UPDATE_INPUT_SUCCESS:
      return state.merge({
        isUpdatingInput: false,
        input: action.payload,
      });

    case WPProcessStep1ActionTypes.UPDATE_INPUT_ERROR:
      return state.merge({
        isUpdatingInput: false,
      });

    case WPProcessStep1ActionTypes.ATTACH:
    case WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT:
    case WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE:
      return state.merge({
        isAttachingFile: true,
      });

    case WPProcessStep1ActionTypes.ATTACH_SUCCESS:
    case WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isAttachingFile: false,
      });

    case WPProcessStep1ActionTypes.ATTACH_ERROR:
    case WPProcessStep1ActionTypes.CREATE_NEW_INPUT_ERROR:
    case WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_ERROR:
    case WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_ERROR:
      return state.merge({
        isAttachingFile: false,
      });

    case WPProcessStep1ActionTypes.CREATE_NEW_INPUT:
      return state.merge({
        isAttachingFile: true,
        hasInputChanged: false,
      });

    case WPProcessStep1ActionTypes.CREATE_NEW_INPUT_SUCCESS:
      return state.merge({
        inputs: action.payload.result,
        isAttachingFile: false,
        hasInputChanged: action.payload.hasInputChanged,
        completed: isStep1Completed(action.payload.result),
      });

    case WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS:
      return state.merge({
        isInputOptionTriggered: true,
      });

    case WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_SUCCESS:
      return state.merge({
        isInputOptionTriggered: false,
        inputs: action.payload.returnUpdatedStatus
          ? state.get('inputs').map(element => {
              const newElement = element;
              if (newElement.id === action.payload.inputId) {
                newElement.required = action.payload.isRequired;
              }

              return newElement;
            })
          : state.get('inputs'),
      });

    case WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_ERROR:
      return state.merge({
        isInputOptionTriggered: false,
      });

    case WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET:
      return state.merge({
        isDatasetDeleting: true,
        hasInputChanged: false,
      });

    case WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_SUCCESS:
      return state.merge({
        inputs: action.payload,
        completed: isStep1Completed(action.payload),
        isDatasetDeleting: false,
        hasInputChanged: true,
      });

    case WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_ERROR:
      return state.merge({
        isDatasetDeleting: false,
      });

    case WPProcessStep1ActionTypes.MARK_INPUT_CENTRALIZED:
      return state.merge({
        isUpdatingTheInput: true,
      });

    case WPProcessStep1ActionTypes.MARK_INPUT_CENTRALIZED_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isUpdatingTheInput: false,
      });

    case WPProcessStep1ActionTypes.MARK_INPUT_CENTRALIZED_ERROR:
      return state.merge({
        isUpdatingTheInput: false,
      });

    case WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET:
      return state.merge({
        isTrifactaDatasetRename: true,
      });

    case WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isTrifactaDatasetRename: false,
      });

    case WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_ERROR:
      return state.merge({
        isTrifactaDatasetRename: false,
      });
    case WPProcessStep1ActionTypes.CLEAR_INPUT_DATA:
      return state.merge({
        isInputDataClearing: true,
        hasInputChanged: false,
      });
    case WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_SUCCESS:
      return state.merge({
        isInputDataClearing: false,
        inputs: action.payload,
        completed: isStep1Completed(action.payload),
        hasInputChanged: true,
      });
    case WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_ERROR:
      return state.merge({
        isInputDataClearing: false,
      });

    case WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isAttachingFile: false,
        completed: isStep1Completed(action.payload),
      });

    case WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_REQUEST:
      return state.merge({
        isAddingDatasetToFlow: true,
      });

    case WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_SUCCESS:
      return state.merge({
        inputs: action.payload.allInputs ? action.payload.allInputs : state.get('inputs'),
        isAddingDatasetToFlow: false,
        completed: isStep1Completed(action.payload.allInputs ? action.payload.allInputs : state.get('inputs')),
      });

    case WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_ERROR:
      return state.merge({
        isAddingDatasetToFlow: false,
      });
    case WPProcessStep1ActionTypes.RETRY_COPY:
      return state.merge({
        isRetryingInputFileCopy: true,
      });

    case WPProcessStep1ActionTypes.RETRY_COPY_SUCCESS:
      return state.merge({
        inputs: action.payload.allInputs ? action.payload.allInputs : state.get('inputs'),
        isRetryingInputFileCopy: false,
      });

    case WPProcessStep1ActionTypes.RETRY_COPY_ERROR:
      return state.merge({
        isRetryingInputFileCopy: false,
      });

    case WPProcessStep1ActionTypes.CHECK_ZIP_FILE:
      return state.merge({
        isCheckingZipFile: true,
      });

    case WPProcessStep1ActionTypes.CHECK_ZIP_FILE_SUCCESS:
      return state.merge({
        checkZipFileStatus: action.payload,
        isCheckingZipFile: false,
      });

    case WPProcessStep1ActionTypes.CHECK_ZIP_FILE_ERROR:
      return state.merge({
        isCheckingZipFile: false,
      });

    case WPProcessStep1ActionTypes.GET_WORKPAPER_DATASET_TYPES_SUCCESS:
      return state.merge({
        datasetTypes: action.payload,
      });

    case WPProcessStep1ActionTypes.GET_INPUT_DATA:
      return state.merge({
        isFetchingInputData: true,
      });

    case WPProcessStep1ActionTypes.GET_INPUT_DATA_SUCCESS: {
      return state.merge({
        isFetchingInputData: false,
        inputDetails: {
          data: action.payload,
        },
      });
    }

    case WPProcessStep1ActionTypes.GET_INPUT_DATA_ERROR:
      return state.merge({
        isFetchingInputData: false,
      });

    case WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT:
      return state.merge({
        updatingCentralizedInputs: true,
      });

    case WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_INPROGRESS:
      return state.merge({
        inputs: action.payload.allInputs ? action.payload.allInputs : state.get('inputs'),
        updatingCentralizedInputs: true,
      });

    case WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_SUCCESS:
      return state.merge({
        inputs: action.payload.allInputs ? action.payload.allInputs : state.get('inputs'),
        updatingCentralizedInputs: false,
      });

    case WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_ERROR:
      return state.merge({
        updatingCentralizedInputs: false,
      });

    case WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT:
      return state.merge({
        isTriggeringDMVsForZip: true,
      });

    case WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isTriggeringDMVsForZip: false,
      });

    case WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_ERROR:
      return state.merge({
        isTriggeringDMVsForZip: false,
      });

    case WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE:
      return state.merge({
        isDownloadingExampleFile: true,
      });

    case WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE_SUCCESS:
    case WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE_ERROR:
      return state.merge({
        isDownloadingExampleFile: false,
      });

    case WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES:
      return state.merge({
        isFetchingBundles: true,
      });

    case WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_SUCCESS:
      return state.merge({
        allTrifactaBundles: action.payload,
        isFetchingBundles: false,
      });

    case WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_ERROR:
      return state.merge({
        isFetchingBundles: false,
      });

    case WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES:
      return state.merge({
        connectTrifactBundles: true,
      });

    case WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_SUCCESS:
      return state.merge({
        inputs: action.payload.allInputs ? action.payload.allInputs : state.get('inputs'),
        connectTrifactBundles: false,
      });

    case WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_ERROR:
      return state.merge({
        connectTrifactBundles: false,
      });

    case WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST:
      return state.merge({
        isDecouplingDataRequest: true,
      });

    case WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST_SUCCESS:
      return state.merge({
        isDecouplingDataRequest: false,
        decoupleDataRequestResult: action.payload,
      });

    case WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST_ERROR:
      return state.merge({
        isDecouplingDataRequest: false,
        decoupleDataRequestResult: false,
      });

    case WPProcessStep1ActionTypes.GET_INPUT_RELATIONSHIP_SUCCESS:
      return state.merge({
        inputRelationship: action.payload,
      });

    case WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST:
      return state.merge({
        isSettingAutoDmtFlag: true,
      });

    case WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST_SUCCESS:
      return state.merge({
        isSettingAutoDmtFlag: false,
        autoDMTFlag: action.payload,
      });

    case WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST_ERROR:
      return state.merge({
        isSettingAutoDmtFlag: false,
      });

    case WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST:
      return state.merge({
        isGettingAutoDmtFlag: true,
      });

    case WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_SUCCESS:
      return state.merge({
        isGettingAutoDmtFlag: false,
        autoDMTFlag: action.payload,
      });

    case WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_ERROR:
      return state.merge({
        isGettingAutoDmtFlag: false,
      });

    case WPProcessStep1ActionTypes.REPLACE_DATAMODEL_INPUT:
      return state.merge({
        isReplacingDMLoader: true,
      });

    case WPProcessStep1ActionTypes.REPLACE_DATAMODEL_INPUT_SUCCESS:
      return state.merge({
        isReplacingDMLoader: false,
        inputs: action.payload,
        completed: isStep1Completed(action.payload),
        hasInputChanged: true,
        isDataModelReplaced: true,
      });

    case WPProcessStep1ActionTypes.REPLACE_DATAMODEL_INPUT_ERROR:
      return state.merge({
        isReplacingDMLoader: false,
        isDataModelReplaced: false,
      });

    default:
      return state;
  }
}
