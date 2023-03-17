import stagingService from '../../../services/staging.service';
import workpaperService from '../../../services/workpaper.service';
import {
  FILE_UPLOAD_TYPE,
  FILE_EXTENSIONS,
  FILE_TYPE,
} from '../../../components/NotebookWPProcess/constants/NotebookWPProcess.const';
import { trackEvent } from '../../../app/appInsights/TelemetryService';
import { eventName, eventAction, eventStatus } from '../../../app/appInsights/appInsights.const';
import { addGlobalError } from '../../errors/actions';
import { NotebookWPStep1ActionTypes } from './actionTypes';

const filterDateFormat = () => {
  let date = new Date().toISOString();
  date = date.replace(/[-:.]/g, '');

  return date;
};

export function fileUpload(workpaperId, file, parentNodeId) {
  return async dispatch => {
    const fileSize = file.size;
    const fileName = `${filterDateFormat()}_${file.name}`;
    const fileType = fileName.split('.').pop();

    try {
      dispatch({ type: NotebookWPStep1ActionTypes.ATTACH });

      trackEvent(
        eventName.FILE_UPLOAD,
        {
          eventAction: eventAction.STARTED,
          workpaperId,
          fileName,
          fileType,
          status: eventStatus.RUNNING,
          eventType: FILE_UPLOAD_TYPE.ATTACH_FILE,
        },
        {
          fileSize,
        }
      );

      const response = await stagingService.fileUpload(
        file,
        FILE_TYPE.CSV,
        FILE_EXTENSIONS.CSV.toUpperCase(),
        parentNodeId,
        fileName
      );
      trackEvent(
        eventName.FILE_UPLOAD,
        {
          eventAction: eventAction.COMPLETED,
          workpaperId,
          fileName,
          fileType,
          status: eventStatus.FINISHED,
          eventType: FILE_UPLOAD_TYPE.ATTACH_FILE,
        },
        {
          fileSize,
        }
      );

      dispatch({
        type: NotebookWPStep1ActionTypes.ATTACH_SUCCESS,
        payload: response,
      });

      return response;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep1ActionTypes.ATTACH_ERROR });

      trackEvent(eventName.FILE_UPLOAD, {
        eventAction: eventAction.COMPLETED,
        workpaperId,
        fileName,
        fileType,
        status: eventStatus.ERROR,
        eventType: FILE_UPLOAD_TYPE.ATTACH_FILE,
      });

      return false;
    }
  };
}

export function saveFileForDataTable(fileSchema, file, fileName, fileDelimiter, dataTableId) {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPStep1ActionTypes.SAVE_FILE_FOR_DATA_TABLE });

      const response = await workpaperService.saveFileForDataTable(
        fileSchema,
        file,
        fileName,
        fileDelimiter,
        dataTableId
      );

      dispatch({
        type: NotebookWPStep1ActionTypes.SAVE_FILE_FOR_DATA_TABLE_SUCCESS,
        payload: response,
      });

      return response;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep1ActionTypes.SAVE_FILE_FOR_DATA_TABLE_ERROR });

      return false;
    }
  };
}

/**
 * Fetches the information of an input associated to a workpaper.
 */
export function getInput(workpaperId, inputId) {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPStep1ActionTypes.GET_INPUT });
      const response = await workpaperService.getInput(workpaperId, inputId);

      dispatch({
        type: NotebookWPStep1ActionTypes.GET_INPUT_SUCCESS,
        payload: response?.[0],
      });

      return response;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep1ActionTypes.GET_INPUT_ERROR });

      return false;
    }
  };
}

/**
 * Updates the information of an input based on the workpaperId and inputId
 *
 * @param {string} inputId
 * @param {object} mappings
 */
export function updateInput(inputId, mappings) {
  return async dispatch => {
    try {
      dispatch({ type: NotebookWPStep1ActionTypes.UPDATE_INPUT });

      const response = await workpaperService.updateInput(inputId, mappings);

      dispatch({
        type: NotebookWPStep1ActionTypes.UPDATE_INPUT_SUCCESS,
        payload: response,
      });

      return response;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: NotebookWPStep1ActionTypes.UPDATE_INPUT_ERROR });

      return false;
    }
  };
}

export const resetInput = () => {
  return dispatch => {
    dispatch({ type: NotebookWPStep1ActionTypes.RESET_INPUT });
  };
};

/**
 * Fetches the file preview based on the Input Id.
 * @param {string} inputId
 */
export function getInputFilePreview(inputId) {
  return async dispatch => {
    try {
      dispatch({
        type: NotebookWPStep1ActionTypes.GET_PREVIEW,
      });

      const response = await workpaperService.getInputFilePreview(inputId);

      const { data, schema } = response;

      dispatch({
        type: NotebookWPStep1ActionTypes.GET_PREVIEW_SUCCESS,
        payload: {
          data,
          schema,
        },
      });
    } catch (error) {
      dispatch(addGlobalError(error));
      dispatch({ type: NotebookWPStep1ActionTypes.GET_PREVIEW_ERROR, error });
    }
  };
}
