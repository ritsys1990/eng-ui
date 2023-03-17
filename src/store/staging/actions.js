import stagingService from '../../services/staging.service';
import { downloadFileFromStream } from '../../utils/fileHelper';
import { addGlobalError, addInputFileError } from '../errors/actions';
import { StagingActionTypes } from './actionTypes';

export function getStagingFileDL(filePath, type = 'application/pdf') {
  return async dispatch => {
    try {
      const buffer = await stagingService.stagingGetFileDL(filePath);

      return new Blob([buffer], { type });
    } catch (e) {
      dispatch(addGlobalError(e));

      return false;
    }
  };
}

export function getEngagementFolders(clientId, engagementId) {
  return async dispatch => {
    try {
      dispatch({ type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS });
      const result = await stagingService.getEngagementFolders(clientId, engagementId);
      dispatch({ type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS_SUCCESS, payload: result });

      return result;
    } catch (e) {
      dispatch({ type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS_ERROR });
      dispatch(addGlobalError(e));

      return false;
    }
  };
}

export function validateZipFile(file) {
  return async dispatch => {
    try {
      dispatch({ type: StagingActionTypes.VALIDATE_ZIP_FILE });
      const result = await stagingService.validateZipFile(file);
      dispatch({ type: StagingActionTypes.VALIDATE_ZIP_FILE_SUCCESS, payload: result });

      return result;
    } catch (e) {
      dispatch({ type: StagingActionTypes.VALIDATE_ZIP_FILE_ERROR });
      dispatch(addInputFileError(e));

      return false;
    }
  };
}

export function downloadFile(filePath, fileName, fileExtension, fileType) {
  return async dispatch => {
    try {
      dispatch({ type: StagingActionTypes.DOWNLOAD_FILE });
      const stream = await stagingService.stagingGetFileDL(filePath);
      downloadFileFromStream(stream, fileName, fileExtension, fileType);
      dispatch({ type: StagingActionTypes.DOWNLOAD_FILE_SUCCESS });
    } catch (e) {
      dispatch(addGlobalError(e));
      dispatch({ type: StagingActionTypes.DOWNLOAD_FILE_ERROR });
    }
  };
}
