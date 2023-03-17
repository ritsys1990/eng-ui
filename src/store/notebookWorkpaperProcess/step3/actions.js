import workpaperService from '../../../services/workpaper.service';
import { WB_PROCESS_TYPE } from '../../../utils/workbooks.const';
import { addGlobalError } from '../../errors/actions';
import { NotebookWPStep3ActionTypes } from './actionTypes';

export function getNotebookWPOutputs(workpaperId) {
  return async (dispatch, getState) => {
    if (getState().notebookWPProcess.notebookWPStep3.get('syncingOutputs') !== workpaperId) {
      try {
        dispatch({ type: NotebookWPStep3ActionTypes.GET_OUTPUTS, payload: { workpaperId } });

        const outputs = await workpaperService.getNotebookWPOutputs(workpaperId);
        dispatch({
          type: NotebookWPStep3ActionTypes.GET_OUTPUTS_SUCCESS,
          payload: { [workpaperId]: outputs },
        });
      } catch (err) {
        dispatch(addGlobalError(err));
        dispatch({ type: NotebookWPStep3ActionTypes.GET_OUTPUTS_ERROR, payload: { workpaperId, outputs: [] } });
      }
    }
  };
}

export function getOutputPreview(outputId) {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPStep3ActionTypes.GET_OUTPUT_PREVIEW });
      const output = await workpaperService.getOutputPreview(outputId);
      dispatch({
        type: NotebookWPStep3ActionTypes.GET_OUTPUT_PREVIEW_SUCCESS,
        payload: output,
      });

      return output;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep3ActionTypes.GET_OUTPUT_PREVIEW_ERROR });

      return false;
    }
  };
}

export function getWorkbooks(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPStep3ActionTypes.GET_WORKBOOKS });
      const workbooks = await workpaperService.getWorkbooks(workpaperId);
      dispatch({
        type: NotebookWPStep3ActionTypes.GET_WORKBOOKS_SUCCESS,
        payload: workbooks ? new Array(workbooks) : [],
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep3ActionTypes.GET_WORKBOOKS_ERROR });
    }
  };
}

export function publishWorkbook(workpaperId, name, file) {
  return async dispatch => {
    try {
      dispatch({
        type: NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS,
        payload: { status: WB_PROCESS_TYPE.UPLOADING },
      });

      await workpaperService.publishWorkbook(workpaperId, name, file, chunk => {
        dispatch({
          type: NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_PROGRESS,
          payload: chunk,
        });
      });

      dispatch({
        type: NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_SUCCESS,
        payload: { status: WB_PROCESS_TYPE.DONE },
      });

      // Wait two secs before pulling new workbooks, cause it looks cool.
      await new Promise(resolve => setTimeout(() => resolve(), 2000));
      dispatch(getWorkbooks(workpaperId));
    } catch (err) {
      if (err.message === WB_PROCESS_TYPE.TABLEMISMATCH) {
        dispatch({
          type: NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_TABLEMISMATCH_ERROR,
          payload: { status: WB_PROCESS_TYPE.TABLEMISMATCH, message: err.message },
        });
      } else {
        dispatch({
          type: NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_ERROR,
          payload: { status: WB_PROCESS_TYPE.ERROR, message: err.message },
        });
      }
    }
  };
}

export function removeWorkbooks(workpaperId, forceDelete) {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPStep3ActionTypes.REMOVE_WORKBOOKS });
      await workpaperService.removeWorkbooks(workpaperId, forceDelete);
      dispatch({
        type: NotebookWPStep3ActionTypes.REMOVE_WORKBOOKS_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep3ActionTypes.REMOVE_WORKBOOKS_ERROR });
    }
  };
}
