import { initialState } from './reducer';
import { WPProcessStep1ActionTypes } from './actionTypes';
import {
  getInputs,
  getupdatedInputs,
  getRenamedInputs,
  getInputDetails,
} from '../../../services/mocks/tests/wpStep1.mock';

export const workpaperProcessStep1Mock = {
  initialState,
  createInput: {
    expectedState: initialState.merge({
      isAttachingFile: true,
    }),
    action: { type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT },
  },
  createInputSuccess: {
    expectedState: initialState.merge({
      isAttachingFile: false,
      inputs: getInputs(),
      completed: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT_SUCCESS,
      payload: { hasInputChanged: false, result: getInputs() },
    },
  },
  createInputError: {
    expectedState: initialState.merge({
      isAttachingFile: false,
    }),
    action: { type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT_ERROR },
  },
  updateInputRequired: {
    expectedState: initialState.merge({
      isInputOptionTriggered: true,
    }),
    action: { type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS },
  },
  updateInputRequiredSuccess: {
    inputInitialState: initialState.merge({
      inputs: getInputs(),
    }),
    expectedState: initialState.merge({
      isInputOptionTriggered: false,
      inputs: getupdatedInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_SUCCESS,
      payload: { returnUpdatedStatus: true, inputId: '136483d2-8d2c-45f3-b224-6d68ed475386', isRequired: false },
    },
  },
  updateInputRequiredError: {
    expectedState: initialState.merge({
      isInputOptionTriggered: false,
    }),
    action: { type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_ERROR },
  },
  deleteTrifactaInput: {
    expectedState: initialState.merge({
      isDatasetDeleting: true,
    }),
    action: { type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET },
  },
  deleteTrifactaInputSuccess: {
    deleteInitialState: initialState.merge({
      inputs: getInputs(),
    }),
    expectedState: initialState.merge({
      isDatasetDeleting: false,
      inputs: [],
      hasInputChanged: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_SUCCESS,
      payload: [],
    },
  },
  deleteTrifactaInputError: {
    expectedState: initialState.merge({
      isDatasetDeleting: false,
    }),
    action: { type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_ERROR },
  },
  renameTrifactaInput: {
    expectedState: initialState.merge({
      isTrifactaDatasetRename: true,
    }),
    action: { type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET },
  },
  renameTrifactaInputSuccess: {
    renameInitialState: initialState.merge({
      inputs: getInputs(),
    }),
    expectedState: initialState.merge({
      isTrifactaDatasetRename: false,
      inputs: getRenamedInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_SUCCESS,
      payload: getRenamedInputs(),
    },
  },
  renameTrifactaInputError: {
    expectedState: initialState.merge({
      isTrifactaDatasetRename: false,
    }),
    action: { type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_ERROR },
  },
  clearInput: {
    expectedState: initialState.merge({
      isInputDataClearing: true,
    }),
    action: { type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA },
  },
  clearInputSuccess: {
    expectedState: initialState.merge({
      isInputDataClearing: false,
      inputs: getInputs(),
      hasInputChanged: true,
      completed: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_SUCCESS,
      payload: getInputs(),
    },
  },
  clearInputError: {
    expectedState: initialState.merge({
      isInputDataClearing: false,
    }),
    action: { type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_ERROR },
  },
  createNewDataModelInput: {
    expectedState: initialState.merge({
      isAttachingFile: true,
    }),
    action: { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT },
  },
  createNewDataModelInputSuccess: {
    expectedState: initialState.merge({
      isAttachingFile: false,
      inputs: getInputs(),
      completed: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_SUCCESS,
      payload: getInputs(),
    },
  },
  createNewDataModelInputError: {
    expectedState: initialState.merge({
      isAttachingFile: false,
    }),
    action: { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_ERROR, payload: true },
  },
  uploadZipFile: {
    expectedState: initialState.merge({
      isAttachingFile: true,
    }),
    action: { type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE },
  },
  uploadZipFileSuccess: {
    expectedState: initialState.merge({
      isAttachingFile: false,
      inputs: getInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_SUCCESS,
      payload: getInputs(),
    },
  },
  uploadZipFileError: {
    expectedState: initialState.merge({
      isAttachingFile: false,
    }),
    action: { type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_ERROR, payload: true },
  },
  connectDatasetToFlow: {
    expectedState: initialState.merge({
      isAddingDatasetToFlow: true,
    }),
    action: { type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_REQUEST },
  },
  connectDatasetToFlowSuccess: {
    expectedState: initialState.merge({
      isAddingDatasetToFlow: false,
      inputs: getInputs(),
      completed: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_SUCCESS,
      payload: { allInputs: getInputs() },
    },
  },
  connectDatasetToFlowError: {
    expectedState: initialState.merge({
      isAddingDatasetToFlow: false,
    }),
    action: { type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_ERROR, payload: true },
  },
  retryInputFileCopy: {
    expectedState: initialState.merge({
      isRetryingInputFileCopy: true,
    }),
    action: { type: WPProcessStep1ActionTypes.RETRY_COPY },
  },
  retryInputFileCopySuccess: {
    expectedState: initialState.merge({
      isRetryingInputFileCopy: false,
      inputs: getInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.RETRY_COPY_SUCCESS,
      payload: { allInputs: getInputs() },
    },
  },
  retryInputFileCopyError: {
    expectedState: initialState.merge({
      isRetryingInputFileCopy: false,
    }),
    action: { type: WPProcessStep1ActionTypes.RETRY_COPY_ERROR, payload: true },
  },
  checkZipFile: {
    expectedState: initialState.merge({
      isCheckingZipFile: true,
    }),
    action: { type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE },
  },
  checkZipFileSuccess: {
    expectedState: initialState.merge({
      isCheckingZipFile: false,
      checkZipFileStatus: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE_SUCCESS,
      payload: true,
    },
  },
  checkZipFileError: {
    expectedState: initialState.merge({
      isCheckingZipFile: false,
    }),
    action: { type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE_ERROR, payload: true },
  },
  getInputData: {
    expectedState: initialState.merge({
      isFetchingInputData: true,
    }),
    action: { type: WPProcessStep1ActionTypes.GET_INPUT_DATA },
  },
  getInputDataSuccess: {
    inputInitialState: initialState.merge({
      isFetchingInputData: false,
      inputDetails: {
        data: {},
        schema: {},
      },
    }),
    expectedState: initialState.merge({
      isFetchingInputData: false,
      inputDetails: { data: getInputDetails() },
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_INPUT_DATA_SUCCESS,
      payload: getInputDetails(),
    },
  },
  getInputDataError: {
    expectedState: initialState.merge({
      isFetchingInputData: false,
    }),
    action: { type: WPProcessStep1ActionTypes.GET_INPUT_DATA_ERROR, payload: true },
  },
  refreshCentralizedData: {
    expectedState: initialState.merge({
      updatingCentralizedInputs: true,
    }),
    action: { type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT },
  },
  refreshCentralizedDataInProgress: {
    inputInitialState: initialState.merge({
      updatingCentralizedInputs: true,
      inputs: getInputs(),
    }),
    expectedState: initialState.merge({
      updatingCentralizedInputs: true,
      inputs: getInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_INPROGRESS,
      payload: { allInputs: getInputs() },
    },
  },
  refreshCentralizedDataSuccess: {
    inputInitialState: initialState.merge({
      updatingCentralizedInputs: false,
      inputs: getInputs(),
    }),
    expectedState: initialState.merge({
      updatingCentralizedInputs: false,
      inputs: getInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_SUCCESS,
      payload: { allInputs: getInputs() },
    },
  },
  refreshCentralizedDataError: {
    expectedState: initialState.merge({
      updatingCentralizedInputs: false,
    }),
    action: { type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_ERROR, payload: true },
  },
  triggerDMVs: {
    expectedState: initialState.merge({
      isTriggeringDMVsForZip: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT,
    },
  },
  triggerDMVsSuccess: {
    expectedState: initialState.merge({
      isTriggeringDMVsForZip: false,
      inputs: getInputs(),
    }),
    action: {
      type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_SUCCESS,
      payload: getInputs(),
    },
  },
  triggerDMVsError: {
    expectedState: initialState.merge({
      isTriggeringDMVsForZip: false,
    }),
    action: {
      type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_ERROR,
    },
  },

  getTrifactaBundles: {
    expectedState: initialState.merge({
      isFetchingBundles: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES,
    },
  },

  getTrifactaBundlesSuccess: {
    expectedState: initialState.merge({
      isFetchingBundles: false,
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_SUCCESS,
      payload: {},
    },
  },

  getTrifactaBundlesError: {
    expectedState: initialState.merge({
      isFetchingBundles: false,
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_ERROR,
    },
  },

  getAutoDmtFlag: {
    expectedState: initialState.merge({
      isGettingAutoDmtFlag: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST,
    },
  },

  getAutoDmtFlagSuccess: {
    expectedState: initialState.merge({
      isGettingAutoDmtFlag: false,
      autoDMTFlag: undefined,
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_SUCCESS,
    },
  },

  getAutoDmtFlagError: {
    expectedState: initialState.merge({
      isGettingAutoDmtFlag: false,
    }),
    action: {
      type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_ERROR,
    },
  },

  connectToTrifactaBundles: {
    expectedState: initialState.merge({
      connectTrifactBundles: true,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES,
    },
  },
  connectToTrifactaBundlesSuccess: {
    expectedState: initialState.merge({
      connectTrifactBundles: false,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_SUCCESS,
      payload: { allInputs: [] },
    },
  },

  connectToTrifactaBundlesError: {
    expectedState: initialState.merge({
      connectTrifactBundles: false,
    }),
    action: {
      type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_ERROR,
    },
  },
};
