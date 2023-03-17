import { v4 as uuidv4 } from 'uuid';
import { ErrorActionTypes } from './actionTypes';
import { getTranslation } from '../../hooks/useTranslation';

const parseError = (error, t = null) => {
  const parsedError = error;
  parsedError.key = parsedError.key || uuidv4();
  if (t && parsedError.serviceName === 'Data Wrangler Service' && parsedError.code >= 502 && parsedError.code <= 504) {
    parsedError.message = t('Pages_Trifacta_DataWrangler_Service_Error_Connection') || parsedError.message;
  } else if (
    t &&
    typeof parsedError.message === 'string' &&
    parsedError.message.includes(t('Pages_Trifacta_DataWrangler_Service_Error_MissingInput_Keyphrase'))
  ) {
    parsedError.message = t('Pages_Trifacta_DataWrangler_Service_Error_MissingInput') || parsedError.message;
  }

  return parsedError;
};

export function addGlobalError(error) {
  return async (dispatch, getState) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    if (error.length) {
      error.forEach(er => {
        const err = { ...er };
        err.type = Number.isNaN(err.type) ? err.type : 'error';
        dispatch({
          type: ErrorActionTypes.ADD_GLOBAL_ERROR,
          payload: parseError(err, t),
        });
      });
    } else {
      dispatch({
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(error, t),
      });
    }
  };
}

export function deleteGlobalError(errorKey) {
  return async dispatch => {
    dispatch({ type: ErrorActionTypes.DELETE_GLOBAL_ERROR, payload: errorKey });
  };
}

export function addAddClientError(error) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.ADD_ADD_CLIENT_ERROR,
      payload: parseError(error),
    });
  };
}

export function deleteAddClientError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_ADD_CLIENT_ERROR,
      payload: errorKey,
    });
  };
}

export function resetAddClientErrors() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_ADD_CLIENT_ERRORS,
    });
  };
}

export function addAddWorkpaperError(error) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.ADD_ADD_WORKPAPER_ERROR,
      payload: parseError(error, t),
    });
  };
}

export function deleteAddWorkpaperError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_ADD_WORKPAPER_ERROR,
      payload: errorKey,
    });
  };
}

export function resetAddWorkpaperErrors() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_ADD_WORKPAPER_ERRORS,
    });
  };
}

export function addPipelineError(error) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.ADD_PIPELINE_ERROR,
      payload: parseError(error, t),
    });
  };
}

export function deleteAddPipelineError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_ADD_PIPELINE_ERROR,
      payload: errorKey,
    });
  };
}

export function resetAddPipelineError() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_ADD_PIPELINE_ERRORS,
    });
  };
}

export function updatePipelineError(error) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.UPDATE_PIPELINE_ERROR,
      payload: parseError(error, t),
    });
  };
}

export function deleteUpdatePipelineError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_UPDATE_PIPELINE_ERROR,
      payload: errorKey,
    });
  };
}

export function resetUpdatePipelineError() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_UPDATE_PIPELINE_ERRORS,
    });
  };
}

export function addInputFileError(error) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.ADD_INPUT_FILE_ERROR,
      payload: parseError(error, t),
    });
  };
}

export function addInputOptionError(error) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.ADD_INPUT_OPTIONS_ERROR,
      payload: parseError(error, t),
    });
  };
}

export function deleteInputFileError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_INPUT_FILE_ERROR,
      payload: errorKey,
    });
  };
}

export function resetInputFileErrors() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_INPUT_FILE_ERRORS,
    });
  };
}

export function addWPProcessingErrors(error, options = {}) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.ADD_WORKPAPER_PROCESSING_ERROR,
      payload: { error: parseError(error, t), workpaperId: options.workpaperId },
    });
  };
}

export function deleteWPProcessingErrors(errorKey, options = {}) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_WORKPAPER_PROCESSING_ERROR,
      payload: { errorKey, workpaperId: options.workpaperId },
    });
  };
}

export function resetWPProcessingErrors(options = {}) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_WORKPAPER_PROCESSING_ERRORS,
      payload: { workpaperId: options.workpaperId },
    });
  };
}

export function addImportFlowError(error) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);
    dispatch({
      type: ErrorActionTypes.ADD_IMPORT_FLOW_ERROR,
      payload: parseError(error, t),
    });
  };
}

export function deleteImportFlowEachError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_IMPORT_FLOW_EACH_ERROR,
      payload: errorKey,
    });
  };
}

export function deleteImportFlowError() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_IMPORT_FLOW_ERROR,
    });
  };
}

export function addReconcileClientError(error) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.ADD_RECONCILE_CLIENT_ERROR,
      payload: parseError(error),
    });
  };
}

export function deleteReconcileClientError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_RECONCILE_CLIENT_ERROR,
      payload: errorKey,
    });
  };
}

export function resetReconcileClientErrors() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_RECONCILE_CLIENT_ERRORS,
    });
  };
}

export function addDMFieldError(error) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.ADD_DM_FIELD_ERROR,
      payload: parseError(error),
    });
  };
}

export function deleteDMFieldError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_DM_FIELD_ERROR,
      payload: errorKey,
    });
  };
}

export function resetDMFieldErrors() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_DM_FILED_ERRORS,
    });
  };
}

export function addIngestDMTError(error) {
  return async dispatch => {
    if (error.length) {
      error.forEach(eachError => {
        const err = { ...eachError };
        err.type = Number.isNaN(err.type) ? err.type : 'error';
        err.message = eachError.message;
        dispatch({
          type: ErrorActionTypes.ADD_INGEST_DMT_ERROR,
          payload: parseError(err),
        });
      });
    } else {
      const err = { ...error };
      err.type = Number.isNaN(error.type) ? error.type : 'error';
      err.message = error.message;
      dispatch({
        type: ErrorActionTypes.ADD_INGEST_DMT_ERROR,
        payload: parseError(error),
      });
    }
  };
}

export function deleteIngestDMTError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_INGEST_DMT_ERROR,
      payload: errorKey,
    });
  };
}

export function resetIngestDMTError() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_DELETE_INGEST_DMT_ERROR,
    });
  };
}

export function addAddEngagementError(error) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.ADD_ADD_ENGAGEMENT_ERROR,
      payload: parseError(error),
    });
  };
}

export function deleteAddEngagementError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_ADD_ENGAGEMENT_ERROR,
      payload: errorKey,
    });
  };
}

export function resetAddEngagementError() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_ADD_ENGAGEMENT_ERROR,
    });
  };
}

export function getRunTimeEvironmentError(error) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.GET_RUNTIME_ENVIRONMENT_ERROR,
      payload: parseError(error),
    });
  };
}

export function connectToBundleError(error) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.ADD_CONNECT_BUNDLE_ERRORS,
      payload: parseError(error),
    });
  };
}

export function deleteconnectToBundleError(errorKey) {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.DELETE_CONNECT_BUNDLE_ERRORS,
      payload: errorKey,
    });
  };
}

export function resetconnectToBundleError() {
  return async dispatch => {
    dispatch({
      type: ErrorActionTypes.RESET_CONNECT_BUNDLE_ERRORS,
    });
  };
}
