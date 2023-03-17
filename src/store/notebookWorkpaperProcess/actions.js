import workpaperService from '../../services/workpaper.service';
import sparkJobManagementService from '../../services/spark-job-management.service';
import { NotebookWPActionTypes } from './actionTypes';
import { addGlobalError } from '../errors/actions';

export const getNotebookWorkpapers = () => {
  return async dispatch => {
    dispatch({ type: NotebookWPActionTypes.GET_NOTEBOOK_WORKPAPER_REQUEST });

    return sparkJobManagementService.getNotebookWorkPapers();
  };
};

export const attachNotebooks = (selectedNotebook, workpaperId) => {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPActionTypes.ATTACH_NOTEBOOK_WORKPAPER_REQUEST });

      const result = await workpaperService.attachNotebook(selectedNotebook, workpaperId);
      dispatch({
        type: NotebookWPActionTypes.ATTACH_NOTEBOOK_WORKPAPER_REQUEST_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPActionTypes.ATTACH_NOTEBOOK_WORKPAPER_REQUEST_ERROR });

      return false;
    }
  };
};

export const getParameters = workpaperId => {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPActionTypes.GET_PARAMETERS_WORKPAPER });

      const result = await workpaperService.getDatabrickNotebookParameters(workpaperId);
      dispatch({
        type: NotebookWPActionTypes.GET_PARAMETERS_WORKPAPER_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPActionTypes.GET_PARAMETERS_WORKPAPER_ERROR });

      return false;
    }
  };
};

export const saveParameters = (workpaperId, payload) => {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPActionTypes.SAVE_PARAMETERS_WORKPAPER });

      const status = await workpaperService.saveDatabrickNotebookParameters(workpaperId, payload);
      dispatch({
        type: NotebookWPActionTypes.SAVE_PARAMETERS_WORKPAPER_SUCCESS,
      });

      return status;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPActionTypes.SAVE_PARAMETERS_WORKPAPER_ERROR });

      return false;
    }
  };
};

export const replaceNotebook = (selectedNotebook, workpaperId) => {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPActionTypes.REPLACE_NOTEBOOK_WORKPAPER_REQUEST });

      const result = await workpaperService.replaceNotebook(selectedNotebook, workpaperId);
      dispatch({
        type: NotebookWPActionTypes.REPLACE_NOTEBOOK_WORKPAPER_REQUEST_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPActionTypes.REPLACE_NOTEBOOK_WORKPAPER_REQUEST_ERROR });

      return false;
    }
  };
};

export const executeNotebook = workpaperId => {
  return async dispatch => {
    dispatch({ type: NotebookWPActionTypes.EXECUTE_NOTEBOOK });

    return workpaperService.executeNotebook(workpaperId);
  };
};

export const executeNotebookStatus = workpaperId => {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPActionTypes.EXECUTE_NOTEBOOK_STATUS });

      const status = await workpaperService.getNotebookExecutionStatus(workpaperId);
      dispatch({
        type: NotebookWPActionTypes.EXECUTE_NOTEBOOK_STATUS_SUCCESS,
        payload: { status, workpaperId },
      });

      return status;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPActionTypes.EXECUTE_NOTEBOOK_STATUS_ERROR });

      return false;
    }
  };
};

export const getNotebookWPOutput = workpaperId => {
  return async dispatch => {
    dispatch({ type: NotebookWPActionTypes.EXECUTE_NOTEBOOK });

    return workpaperService.getNotebookWPOutput(workpaperId);
  };
};

export const executionReset = () => {
  return async dispatch => {
    dispatch({ type: NotebookWPActionTypes.RESET_EXECTUTION });

    return true;
  };
};

export const updateNotebookStatus = status => {
  return async dispatch => {
    dispatch({ type: NotebookWPActionTypes.UPDATE_EXECUTION_STATUS, payload: status });

    return true;
  };
};
