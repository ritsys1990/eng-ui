import { Map as ImmutableMap } from 'immutable';
import { ErrorActionTypes } from './actionTypes';
import { isEmpty } from 'lodash';

export const initialState = ImmutableMap({
  errors: [],
  addClientErrors: [],
  addWorkpaperErrors: [],
  addPipelineError: [],
  updatePipelineError: [],
  inputFileErrors: [],
  workpaperProcessingErrors: ImmutableMap({}),
  importFlowErrors: [],
  reconcileClientErrors: [],
  dmFieldErrors: [],
  addEngagementErrors: [],
  getRunTimeEnvErrors: [],
  connectBundleErrors: [],
  ingestDMTErrors: [],
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function reduce(state = initialState, action = {}) {
  let currentErrors = [];
  let currentWorkpaperProcessingErrors;

  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case ErrorActionTypes.ADD_GLOBAL_ERROR:
      currentErrors = [...state.get('errors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        errors: [...currentErrors],
      });

    case ErrorActionTypes.DELETE_GLOBAL_ERROR:
      currentErrors = state.get('errors').filter(alert => alert.key !== action.payload);

      return state.merge({
        errors: currentErrors,
      });

    case ErrorActionTypes.ADD_ADD_CLIENT_ERROR:
      currentErrors = [...state.get('addClientErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        addClientErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_ADD_CLIENT_ERROR:
      currentErrors = state.get('addClientErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        addClientErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_ADD_CLIENT_ERRORS:
      return state.merge({
        addClientErrors: [],
      });

    case ErrorActionTypes.ADD_ADD_WORKPAPER_ERROR:
      currentErrors = [...state.get('addWorkpaperErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        addWorkpaperErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_ADD_WORKPAPER_ERROR:
      currentErrors = state.get('addWorkpaperErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        addWorkpaperErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_ADD_WORKPAPER_ERRORS:
      return state.merge({
        addWorkpaperErrors: [],
      });

    case ErrorActionTypes.DELETE_ADD_PIPELINE_ERROR:
      currentErrors = state.get('addPipelineError').filter(alert => alert.key !== action.payload);

      return state.merge({
        addPipelineError: currentErrors,
      });

    case ErrorActionTypes.ADD_PIPELINE_ERROR:
      currentErrors = [...state.get('addPipelineError')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        addPipelineError: currentErrors,
      });

    case ErrorActionTypes.RESET_ADD_PIPELINE_ERRORS:
      return state.merge({
        addPipelineError: [],
      });

    case ErrorActionTypes.UPDATE_PIPELINE_ERROR:
      currentErrors = [...state.get('updatePipelineError')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        updatePipelineError: currentErrors,
      });

    case ErrorActionTypes.DELETE_UPDATE_PIPELINE_ERROR:
      currentErrors = state.get('updatePipelineError').filter(alert => alert.key !== action.payload);

      return state.merge({
        updatePipelineError: currentErrors,
      });

    case ErrorActionTypes.RESET_UPDATE_PIPELINE_ERRORS:
      return state.merge({
        updatePipelineError: [],
      });

    case ErrorActionTypes.ADD_INPUT_FILE_ERROR:
    case ErrorActionTypes.ADD_INPUT_OPTION_ERROR:
      currentErrors = [...state.get('inputFileErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        inputFileErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_INPUT_FILE_ERROR:
      currentErrors = state.get('inputFileErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        inputFileErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_INPUT_FILE_ERRORS:
      return state.merge({
        inputFileErrors: [],
      });

    case ErrorActionTypes.ADD_WORKPAPER_PROCESSING_ERROR:
      currentWorkpaperProcessingErrors = {};
      currentErrors = [...(state.get('workpaperProcessingErrors').get(action.payload.workpaperId) || [])];

      if (!isEmpty(action.payload?.error?.message)) {
        currentErrors.unshift(action.payload.error);
      }

      if (currentErrors.length > 3) {
        currentErrors = currentErrors.slice(0, 3);
      }

      currentWorkpaperProcessingErrors[action.payload.workpaperId] = currentErrors;

      return state.merge({
        workpaperProcessingErrors: state.get('workpaperProcessingErrors').merge(currentWorkpaperProcessingErrors),
      });

    case ErrorActionTypes.DELETE_WORKPAPER_PROCESSING_ERROR:
      currentWorkpaperProcessingErrors = {};
      currentErrors = (state.get('workpaperProcessingErrors').get(action.payload.workpaperId) || []).filter(
        alert => alert.key !== action.payload.errorKey
      );
      currentWorkpaperProcessingErrors[action.payload.workpaperId] = currentErrors;

      return state.merge({
        workpaperProcessingErrors: state.get('workpaperProcessingErrors').merge(currentWorkpaperProcessingErrors),
      });

    case ErrorActionTypes.RESET_WORKPAPER_PROCESSING_ERRORS:
      currentWorkpaperProcessingErrors = {};
      currentWorkpaperProcessingErrors[action.payload.workpaperId] = [];

      return state.merge({
        workpaperProcessingErrors: state.get('workpaperProcessingErrors').merge(currentWorkpaperProcessingErrors),
      });

    case ErrorActionTypes.ADD_IMPORT_FLOW_ERROR:
      currentErrors = [...state.get('importFlowErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        importFlowErrors: [...currentErrors],
      });

    case ErrorActionTypes.DELETE_IMPORT_FLOW_EACH_ERROR:
      currentErrors = state.get('importFlowErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        importFlowErrors: [...currentErrors],
      });

    case ErrorActionTypes.DELETE_IMPORT_FLOW_ERROR:
      return state.merge({
        importFlowErrors: [],
      });

    case ErrorActionTypes.ADD_RECONCILE_CLIENT_ERROR:
      currentErrors = [...state.get('reconcileClientErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        reconcileClientErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_RECONCILE_CLIENT_ERROR:
      currentErrors = state.get('reconcileClientErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        reconcileClientErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_RECONCILE_CLIENT_ERRORS:
      return state.merge({
        reconcileClientErrors: [],
      });

    case ErrorActionTypes.ADD_DM_FIELD_ERROR:
      currentErrors = [...state.get('dmFieldErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        dmFieldErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_DM_FIELD_ERROR:
      currentErrors = state.get('dmFieldErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        dmFieldErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_DM_FILED_ERRORS:
      return state.merge({
        dmFieldErrors: [],
      });

    case ErrorActionTypes.ADD_ADD_ENGAGEMENT_ERROR:
      currentErrors = [...state.get('addEngagementErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        addEngagementErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_ADD_ENGAGEMENT_ERROR:
      currentErrors = state.get('addEngagementErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        addEngagementErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_ADD_ENGAGEMENT_ERROR:
      return state.merge({
        addEngagementErrors: [],
      });

    case ErrorActionTypes.GET_RUNTIME_ENVIRONMENT_ERROR:
      currentErrors = [...state.get('getRunTimeEnvironmentErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        getRunTimeEnvErrors: currentErrors,
      });

    case ErrorActionTypes.ADD_INGEST_DMT_ERROR:
      currentErrors = [...state.get('ingestDMTErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        ingestDMTErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_INGEST_DMT_ERROR:
      currentErrors = [...state.get('ingestDMTErrors')].filter(alert => alert.key !== action.payload);

      return state.merge({
        ingestDMTErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_DELETE_INGEST_DMT_ERROR:
      return state.merge({
        ingestDMTErrors: [],
      });

    case ErrorActionTypes.ADD_CONNECT_BUNDLE_ERRORS:
      currentErrors = [...state.get('connectBundleErrors')];
      if (!isEmpty(action.payload?.message)) {
        currentErrors.unshift(action.payload);
      }

      return state.merge({
        connectBundleErrors: currentErrors,
      });

    case ErrorActionTypes.DELETE_CONNECT_BUNDLE_ERRORS:
      currentErrors = state.get('connectBundleErrors').filter(alert => alert.key !== action.payload);

      return state.merge({
        connectBundleErrors: currentErrors,
      });

    case ErrorActionTypes.RESET_CONNECT_BUNDLE_ERRORS:
      return state.merge({
        connectBundleErrors: [],
      });

    default:
      return state;
  }
}
