import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep3ActionTypes } from './actionTypes';
import {
  groupOutputsByType,
  sortOutputsByTypeAlphabetically,
} from '../../../pages/WorkPaperProcess/utils/WorkPaperProcess.utils';
import { Intent } from 'cortex-look-book';
import { isEqual } from 'lodash';
import { GenWBStatus, GenWBStep } from 'src/utils/workbooks.const';

export const initialOutputs = {
  dataTable: [],
  dqc: [],
  tableau: [],
  tableau_cloned: false,
};

export const initialState = ImmutableMap({
  loading: false,
  cloning: false,
  cloningState: null,
  ready: false,
  outputs: ImmutableMap({}),
  workbooks: null,
  ungroupedOutputs: ImmutableMap({}),
  output: null,
  outputsDetail: null,
  isFetchingOutput: false,
  isFetchingOutputsDetail: false,
  isSavingCSV: false,
  isSavingToJE: false,
  fetchingWorkbooks: false,
  publishStatus: null,
  syncingOutputs: false,
  isOutputDownloading: false,
  duplicateLabelList: [],
  engagmentLabels: [],
  activeWPLabels: {},
  isLabelUpdating: false,
  labelError: '',
  isLoadingSchema: false,
  schema: [],
  isSavingToSql: false,
  isSavingToDL: false,
  setupTableauError: null,
  isSettingUpTableau: false,
  hasSetupTableau: false,
  isFetchingLabels: false,
  isGeneratingWorksbooks: false,
  generateWorkbooksError: null,
  isDownloadingAllOutputs: false,
  generateWorkbooksState: null,
  addDMToOutputLoader: false,
  isUpdatingWbFlag: false,
  validatingDMState: false,
  validatingDMName: '',
  validatingDMInfo: null,
  isReportGenerated: false,
  isDownloadingReport: false,
});

export default function reduce(state = initialState, action = {}) {
  let workpaperTrifactaOutputs;
  let workpaperTrifactaUngroupedOutputs;
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case WPProcessStep3ActionTypes.SAVE_AS_CSV:
      return state.merge({
        isSavingCSV: true,
      });

    case WPProcessStep3ActionTypes.SAVE_AS_CSV_SUCCESS:
    case WPProcessStep3ActionTypes.SAVE_AS_CSV_ERROR:
      return state.merge({
        isSavingCSV: false,
      });

    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE:
      return state.merge({
        isSavingToJE: true,
      });

    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_SUCCESS:
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR:
      return state.merge({
        isSavingToJE: false,
      });

    case WPProcessStep3ActionTypes.GET_OUTPUT:
      return state.merge({
        isFetchingOutput: true,
      });

    case WPProcessStep3ActionTypes.GET_OUTPUT_SUCCESS:
      return state.merge({
        isFetchingOutput: false,
        output: action.payload,
      });

    case WPProcessStep3ActionTypes.GET_OUTPUT_ERROR:
      return state.merge({
        isFetchingOutput: false,
      });

    case WPProcessStep3ActionTypes.GET_ALL_OUTPUTS_DETAIL:
      return state.merge({
        isFetchingOutputsDetail: true,
      });

    case WPProcessStep3ActionTypes.GET_ALL_OUTPUTS_DETAIL_SUCCESS:
      return state.merge({
        isFetchingOutputsDetail: false,
        outputsDetail: action.payload,
      });

    case WPProcessStep3ActionTypes.GET_DATA:
    case WPProcessStep3ActionTypes.GET_DATA_ERROR:
      return state.merge({
        loading: WPProcessStep3ActionTypes.GET_DATA === action.type,
      });

    case WPProcessStep3ActionTypes.CLONE_WORKBOOKS:
      return state.merge({
        cloningState: null,
        cloning: true,
      });

    case WPProcessStep3ActionTypes.CLONE_WORKBOOKS_ERROR:
      return state.merge({
        cloningState: Intent.ERROR,
        cloning: false,
      });

    case WPProcessStep3ActionTypes.GET_DATA_SUCCESS:
      const { outputs, ...other } = action.payload;

      const outputsList = {
        ...initialOutputs,
        ...groupOutputsByType(outputs.outputs),
        ...other,
        tableau: outputs.tableau,
        tableau_cloned: outputs.tableau_cloned,
      };

      workpaperTrifactaOutputs = {};
      workpaperTrifactaOutputs[action.payload.workpaperId] = { ...sortOutputsByTypeAlphabetically(outputsList) };

      workpaperTrifactaUngroupedOutputs = {};
      workpaperTrifactaUngroupedOutputs[action.payload.workpaperId] = outputs;

      return state.merge({
        loading: false,
        ready: true,
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperTrifactaUngroupedOutputs),
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
        cloningState: action.payload.tableau_cloned ? Intent.SUCCESS : Intent.ERROR,
      });

    case WPProcessStep3ActionTypes.UPDATE_OUTPUTS:
      const { outputId, omniaEngagementFileId } = action.payload;
      const currentOutputs = state.get('outputs').get(action.payload.workpaperId) || {};
      const omniaOutputs = currentOutputs.dataTable.map(x => (x.id === outputId ? { ...x, omniaEngagementFileId } : x));
      const tempOutputs = {
        [action.payload.workpaperId]: {
          ...currentOutputs,
          dataTable: omniaOutputs,
        },
      };

      return state.merge({
        outputs: state.get('outputs').merge(tempOutputs),
      });

    case WPProcessStep3ActionTypes.CLONE_WORKBOOKS_SUCCESS:
      const currentClonedOutputs = state.get('outputs').get(action.payload.workpaperId) || {};
      currentClonedOutputs['tableau_cloned'] = true;

      const tempClonedOutputs = {
        [action.payload.workpaperId]: currentClonedOutputs,
      };

      return state
        .merge({
          cloning: false,
          cloningState: Intent.SUCCESS,
          outputs: state.get('outputs').merge(tempClonedOutputs),
        })
        .merge({
          workbooks: action.payload.workbooks,
        });

    case WPProcessStep3ActionTypes.RESET:
      return state.merge(initialState);

    case WPProcessStep3ActionTypes.GET_FLOW_OUTPUT:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaOutputs[action.payload.workpaperId] = { ...initialOutputs };

      return state.merge({
        loading: true,
        syncingOutputs: action.payload.workpaperId,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
      });

    case WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_SUCCESS:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaUngroupedOutputs = {};
      Object.keys(action.payload).forEach(key => {
        workpaperTrifactaOutputs[key] = {
          tableau: [],
          tableau_cloned: false,
          ...groupOutputsByType(action.payload[key]),
        };
      });

      workpaperTrifactaUngroupedOutputs[action.payload.workpaperId] = action.payload.outputs;

      return state.merge({
        loading: false,
        syncingOutputs: false,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperTrifactaUngroupedOutputs),
      });

    case WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_ERROR:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaOutputs[action.payload.workpaperId] = {
        dataTable: [],
        dqc: [],
        tableau: [],
        tableau_cloned: false,
      };

      workpaperTrifactaUngroupedOutputs = {};
      workpaperTrifactaUngroupedOutputs[action.payload.workpaperId] = action.payload.outputs;

      return state.merge({
        loading: false,
        syncingOutputs: false,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperTrifactaUngroupedOutputs),
      });
    case WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA:
      return state.merge({
        isLoadingSchema: true,
      });
    case WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_SUCCESS:
      return state.merge({
        isLoadingSchema: false,
        schema: action.payload,
      });
    case WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_ERROR:
      return state.merge({
        isLoadingSchema: false,
      });
    case WPProcessStep3ActionTypes.CLEAR_OUTPUT_SCHEMA:
      return state.merge({
        isLoadingSchema: false,
        schema: [],
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL:
      return state.merge({
        isSavingToSql: true,
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL_SUCCESS:
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL_ERROR:
      return state.merge({
        isSavingToSql: false,
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL:
      return state.merge({
        isSavingToDL: true,
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL_SUCCESS:
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL_ERROR:
      return state.merge({
        isSavingToDL: false,
      });
    case WPProcessStep3ActionTypes.GET_WORKBOOKS:
      return state.merge({
        fetchingWorkbooks: true,
      });
    case WPProcessStep3ActionTypes.GET_WORKBOOKS_SUCCESS:
      return state.merge({
        fetchingWorkbooks: false,
        workbooks: action.payload,
        publishStatus: null,
      });
    case WPProcessStep3ActionTypes.GET_WORKBOOKS_ERROR:
      return state.merge({
        fetchingWorkbooks: false,
        workbooks: null,
      });

    case WPProcessStep3ActionTypes.GENERATE_WORKBOOKS:
      return state.merge({
        generateWorkbooksState: { status: GenWBStatus.Progress, step: GenWBStep.Queueing },
      });
    case WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_STATE:
      if (isEqual(action.payload, state.get('generateWorkbooksState'))) {
        return state;
      }

      return state.merge({
        generateWorkbooksState: action.payload,
      });
    case WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_ERROR:
      return state.merge({
        generateWorkbooksState: {
          ...state.get('generateWorkbooksState'),
          status: GenWBStatus.Error,
          details: action.payload,
        },
      });
    case WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_FETCH_ERROR:
      return state.merge({
        generateWorkbooksState: {
          ...state.get('generateWorkbooksState'),
          fetchError: (state.get('generateWorkbooksState')?.fetchError || 0) + 1,
          details: action.payload,
        },
      });

    case WPProcessStep3ActionTypes.UPDATE_WORKBOOKS:
    case WPProcessStep3ActionTypes.UPDATE_WORKBOOKS_SUCCESS:
    case WPProcessStep3ActionTypes.UPDATE_WORKBOOKS_ERROR:
    case WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS:
    case WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_PROGRESS:
    case WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_SUCCESS:
    case WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_TABLEMISMATCH_ERROR:
    case WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_ERROR:
      return state.merge({
        publishStatus: action.payload,
      });
    case WPProcessStep3ActionTypes.GET_OUTPUT_LABEL:
      return state.merge({
        isFetchingLabels: true,
      });
    case WPProcessStep3ActionTypes.GET_OUTPUT_LABEL_SUCCESS:
      return state.merge({
        duplicateLabelList: action.payload.dupCheckExcludeLabelsList,
        engagmentLabels: action.payload.engagementLabels,
        activeWPLabels: action.payload.wpLabels,
        isFetchingLabels: false,
      });
    case WPProcessStep3ActionTypes.GET_WP_OUTPUT_LABEL_SUCCESS:
      return state.merge({
        duplicateLabelList: action.payload.dupCheckExcludeLabelsList,
        activeWPLabels: action.payload.wpLabels,
        isFetchingLabels: false,
      });
    case WPProcessStep3ActionTypes.GET_OUTPUT_LABEL_ERROR:
      return state.merge({
        isFetchingLabels: false,
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL:
      return state.merge({
        isLabelUpdating: true,
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL_SUCCESS:
      return state.merge({
        isLabelUpdating: false,
      });
    case WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL_ERROR:
      return state.merge({
        isLabelUpdating: false,
        labelError: action.payload,
      });
    case WPProcessStep3ActionTypes.DELETE_LABEL_ERROR:
      return state.merge({
        labelError: '',
      });
    case WPProcessStep3ActionTypes.REMOVE_WORKBOOKS:
    case WPProcessStep3ActionTypes.CHECK_FILE_SIZE_LOADER:
      return state.merge({
        loading: true,
      });
    case WPProcessStep3ActionTypes.REMOVE_WORKBOOKS_SUCCESS:
      return state.merge({
        loading: false,
        workbooks: [],
      });
    case WPProcessStep3ActionTypes.REMOVE_WORKBOOKS_ERROR:
    case WPProcessStep3ActionTypes.CHECK_FILE_SIZE_SUCCESS:
      return state.merge({
        loading: false,
      });

    case WPProcessStep3ActionTypes.SETUP_TABLEAU:
      return state.merge({
        isSettingUpTableau: true,
        setupTableauError: null,
        hasSetupTableau: false,
      });
    case WPProcessStep3ActionTypes.SETUP_TABLEAU_SUCCESS:
      return state.merge({
        isSettingUpTableau: false,
        hasSetupTableau: true,
      });
    case WPProcessStep3ActionTypes.SETUP_TABLEAU_ERROR:
      return state.merge({
        isSettingUpTableau: false,
        setupTableauError: action.payload,
      });

    case WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV:
      return state.merge({
        isOutputDownloading: true,
      });
    case WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_SUCCESS:
    case WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_ERROR:
      return state.merge({
        isOutputDownloading: false,
      });

    case WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS:
      return state.merge({
        isDownloadingAllOutputs: true,
      });

    case WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_SUCCESS:
    case WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_ERROR:
      return state.merge({
        isDownloadingAllOutputs: false,
      });

    case WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_REQUEST:
      return state.merge({
        addDMToOutputLoader: true,
      });

    case WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_SUCCESS:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaOutputs[action.payload.workpaperId] = {
        ...groupOutputsByType(action.payload.outputs),
      };

      workpaperTrifactaUngroupedOutputs = {};
      workpaperTrifactaUngroupedOutputs[action.payload.workpaperId] = action.payload.outputs;

      return state.merge({
        addDMToOutputLoader: false,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperTrifactaUngroupedOutputs),
      });

    case WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_ERROR:
      return state.merge({
        addDMToOutputLoader: false,
      });

    case WPProcessStep3ActionTypes.TABLEAU_TAILORING_OUTPUT_REQUEST:
      return state.merge({
        addTableauTailoring: true,
      });

    case WPProcessStep3ActionTypes.TABLEAU_TAILORING_OUTPUT_SUCCESS:
    case WPProcessStep3ActionTypes.TABLEAU_TAILORING_OUTPUT_ERROR:
      return state.merge({
        addTableauTailoring: false,
      });

    case WPProcessStep3ActionTypes.WORKBOOK_REFRESH_FLAG:
      return state.merge({
        isUpdatingWbFlag: true,
      });

    case WPProcessStep3ActionTypes.WORKBOOK_REFRESH_FLAG_SUCCESS:
    case WPProcessStep3ActionTypes.WORKBOOK_REFRESH_FLAG_ERROR:
      return state.merge({
        isUpdatingWbFlag: false,
      });

    case WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE:
      return state.merge({
        validatingDMState: true,
      });

    case WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_SUCCESS:
      return state.merge({
        validatingDMState: false,
        validatingDMInfo: action.payload,
      });

    case WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_ERROR:
      return state.merge({
        validatingDMState: false,
      });

    case WPProcessStep3ActionTypes.CLEAR_CONNECTED_DM_STATE:
      return state.merge({
        validatingDMInfo: null,
      });

    case WPProcessStep3ActionTypes.EXECUTE_JE_RECONCILIATION_REPORT:
      return state.merge({
        isDownloadingReport: true,
      });

    case WPProcessStep3ActionTypes.EXECUTE_JE_RECONCILIATION_REPORT_ERROR:
      return state.merge({
        isDownloadingReport: false,
      });

    case WPProcessStep3ActionTypes.GENERATE_JE_RECONCILIATION_REPORT:
      return state.merge({
        isReportGenerated: false,
        isDownloadingReport: true,
      });

    case WPProcessStep3ActionTypes.GENERATE_JE_RECONCILIATION_REPORT_SUCCESS:
    case WPProcessStep3ActionTypes.GENERATE_JE_RECONCILIATION_REPORT_ERROR:
      return state.merge({
        isReportGenerated: true,
        isDownloadingReport: false,
      });

    default:
      return state;
  }
}
