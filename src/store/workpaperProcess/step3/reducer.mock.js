import { initialState } from './reducer';
import { WPProcessStep3ActionTypes } from './actionTypes';
import { getOutputSchema, getOutputLabelError, getOutputsLabelsList } from '../../../services/mocks/tests/wpStep3.mock';
import { GenWBStatus, GenWBStep } from 'src/utils/workbooks.const';
import { Map as ImmutableMap } from 'immutable';

const mockWorkpaperId = '1234-5678-9012-3456';

export const workpaperProcessStep3Mock = {
  initialState,
  CLEAR_OUTPUT_SCHEMA: {
    expectedState: initialState.merge({
      isLoadingSchema: false,
      schema: [],
    }),
    action: { type: WPProcessStep3ActionTypes.CLEAR_OUTPUT_SCHEMA },
  },
  GET_OUTPUT_SCHEMA: {
    expectedState: initialState.merge({
      isLoadingSchema: true,
    }),
    action: { type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA },
  },
  GET_OUTPUT_SCHEMA_SUCCESS: {
    expectedState: initialState.merge({
      isLoadingSchema: false,
      schema: getOutputSchema(),
    }),
    action: { type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_SUCCESS, payload: getOutputSchema() },
  },
  GET_OUTPUT_SCHEMA_ERROR: {
    expectedState: initialState.merge({
      isLoadingSchema: false,
      schema: [],
    }),
    action: { type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_ERROR },
  },
  DELETE_LABEL_ERROR: {
    expectedState: initialState.merge({
      labelError: '',
    }),
    action: { type: WPProcessStep3ActionTypes.DELETE_LABEL_ERROR },
  },
  SAVE_OUTPUT_LABEL: {
    expectedState: initialState.merge({
      isLabelUpdating: true,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL },
  },
  SAVE_OUTPUT_LABEL_SUCCESS: {
    expectedState: initialState.merge({
      isLabelUpdating: false,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL_SUCCESS },
  },
  SAVE_OUTPUT_LABEL_ERROR: {
    expectedState: initialState.merge({
      isLabelUpdating: false,
      labelError: getOutputLabelError().message,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL_ERROR, payload: getOutputLabelError().message },
  },
  SAVE_OUTPUT_TO_DL: {
    expectedState: initialState.merge({
      isSavingToDL: true,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL },
  },
  SAVE_OUTPUT_TO_DL_SUCCESS: {
    expectedState: initialState.merge({
      isSavingToDL: false,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL_SUCCESS },
  },
  SAVE_OUTPUT_TO_DL_ERROR: {
    expectedState: initialState.merge({
      isSavingToDL: false,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL_ERROR },
  },
  SAVE_OUTPUT_TO_SQL: {
    expectedState: initialState.merge({
      isSavingToSql: true,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL },
  },
  SAVE_OUTPUT_TO_SQL_SUCCESS: {
    expectedState: initialState.merge({
      isSavingToSql: false,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL_SUCCESS },
  },
  SAVE_OUTPUT_TO_SQL_ERROR: {
    expectedState: initialState.merge({
      isSavingToSql: false,
    }),
    action: { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL_ERROR },
  },
  GET_OUTPUT_LABEL: {
    expectedState: initialState.merge({
      isFetchingLabels: true,
    }),
    action: { type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL },
  },
  GET_OUTPUT_LABEL_SUCCESS: {
    expectedState: initialState.merge({
      duplicateLabelList: getOutputsLabelsList(),
      engagmentLabels: getOutputsLabelsList(),
      activeWPLabels: getOutputsLabelsList(),
      isFetchingLabels: false,
    }),
    action: {
      type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL_SUCCESS,
      payload: {
        dupCheckExcludeLabelsList: getOutputsLabelsList(),
        engagementLabels: getOutputsLabelsList(),
        wpLabels: getOutputsLabelsList(),
      },
    },
  },
  GET_OUTPUT_LABEL_ERROR: {
    expectedState: initialState.merge({
      isFetchingLabels: false,
    }),
    action: { type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL_ERROR },
  },
  GET_WP_OUTPUT_LABEL_SUCCESS: {
    expectedState: initialState.merge({
      duplicateLabelList: getOutputsLabelsList(),
      activeWPLabels: getOutputsLabelsList(),
      isFetchingLabels: false,
    }),
    action: {
      type: WPProcessStep3ActionTypes.GET_WP_OUTPUT_LABEL_SUCCESS,
      payload: {
        dupCheckExcludeLabelsList: getOutputsLabelsList(),
        wpLabels: getOutputsLabelsList(),
      },
    },
  },
  DOWNLOAD_OUTPUT_CSV: {
    expectedState: initialState.merge({
      isOutputDownloading: true,
    }),
    action: { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV },
  },
  DOWNLOAD_OUTPUT_CSV_SUCCESS: {
    expectedState: initialState.merge({
      isOutputDownloading: false,
    }),
    action: { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_SUCCESS },
  },
  DOWNLOAD_OUTPUT_CSV_ERROR: {
    expectedState: initialState.merge({
      isOutputDownloading: false,
    }),
    action: { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_ERROR },
  },

  GENERATE_WORKBOOKS: {
    expectedState: initialState.merge({
      generateWorkbooksState: { status: GenWBStatus.Progress, step: GenWBStep.Queueing },
    }),
    action: { type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS },
  },

  GENERATE_WORKBOOKS_STATE: {
    expectedState: initialState.merge({
      generateWorkbooksState: { status: GenWBStatus.Progress, step: GenWBStep.Cloning },
    }),
    action: {
      type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_STATE,
      payload: { status: GenWBStatus.Progress, step: GenWBStep.Cloning },
    },
  },

  GENERATE_WORKBOOKS_FETCH_ERROR: {
    expectedState: initialState.merge({
      generateWorkbooksState: { fetchError: 1 },
    }),
    action: {
      type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_FETCH_ERROR,
    },
  },
  GENERATE_WORKBOOKS_ERROR: {
    expectedState: initialState.merge({
      generateWorkbooksState: { status: GenWBStatus.Error, details: 'some error' },
    }),
    action: {
      type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_ERROR,
      payload: 'some error',
    },
  },

  ADD_DATAMODEL_OUTPUT_REQUEST: {
    expectedState: initialState.merge({
      addDMToOutputLoader: true,
    }),
    action: { type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_REQUEST },
  },

  ADD_DATAMODEL_OUTPUT_SUCCESS: {
    expectedState: initialState.merge({
      addDMToOutputLoader: false,
      ungroupedOutputs: ImmutableMap({ [mockWorkpaperId]: [] }),
      outputs: ImmutableMap({ [mockWorkpaperId]: { dataTable: [], dqc: [] } }),
    }),
    action: {
      type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_SUCCESS,
      payload: { workpaperId: mockWorkpaperId, outputs: [] },
    },
  },

  ADD_DATAMODEL_OUTPUT_ERROR: {
    expectedState: initialState.merge({
      addDMToOutputLoader: false,
    }),
    action: { type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_ERROR },
  },

  VALIDATE_CONNECTED_DM_STATE: {
    expectedState: initialState.merge({
      validatingDMState: true,
    }),
    action: { type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE },
  },

  VALIDATE_CONNECTED_DM_STATE_SUCCESS: {
    expectedState: initialState.merge({
      validatingDMState: false,
      validatingDMInfo: { nameTech: 'test', isLatest: true },
    }),
    action: {
      type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_SUCCESS,
      payload: { nameTech: 'test', isLatest: true },
    },
  },

  VALIDATE_CONNECTED_DM_STATE_ERROR: {
    expectedState: initialState.merge({
      validatingDMState: false,
    }),
    action: { type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_ERROR },
  },

  CLEAR_CONNECTED_DM_STATE: {
    expectedState: initialState.merge({
      validatingDMInfo: null,
    }),
    action: { type: WPProcessStep3ActionTypes.CLEAR_CONNECTED_DM_STATE },
  },
};
