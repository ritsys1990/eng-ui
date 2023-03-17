import { AttachFilesActions } from './actionTypes';
import stagingService from '../../../services/staging.service';
import analyticService from '../../../services/analytics-ui.service';
import bundlesService from '../../../services/bundles.service';
import { addInputFileError } from '../../errors/actions';
import {
  formatSheetData,
  sanitizeColumnName,
} from '../../../components/InputUploaderModal/ExistingUploader/utils/ExistingUploader.utils';
import path from 'path';

const EMPTY_ENGAGEMENT_ID = '0000-engagement';

const getDecryptedFilePath = (filePath, fileName, engagementId, nodeId) => {
  const subStrRegex = /^[\s\S]*\/Engagement\//gi;

  return `${filePath.match(subStrRegex)}${engagementId}/decryptedfiles/${nodeId}_${fileName.replace('.enc', '')}`;
};

export function getRootFolder(engagementId, clientId) {
  return async dispatch => {
    try {
      dispatch({ type: AttachFilesActions.GET_ROOT_FOLDER });

      const rootFolder = await stagingService.getRootFolder(engagementId, clientId);

      const childFolders = await stagingService.getChildrenFolder(engagementId, rootFolder[0].id);

      dispatch({
        type: AttachFilesActions.GET_ROOT_FOLDER_SUCCESS,
        payload: {
          id: rootFolder[0].id,
          nodes: [...childFolders],
        },
      });
    } catch (error) {
      dispatch(addInputFileError(error));
      dispatch({ type: AttachFilesActions.GET_ROOT_FOLDER_ERROR });
    }
  };
}

export function getChildrenFolder(engagementId, folderId, folderPath) {
  return async dispatch => {
    try {
      dispatch({ type: AttachFilesActions.GET_CHILDREN_FOLDER });

      let childNodes = await stagingService.getChildrenFolder(engagementId, folderId);
      childNodes = (childNodes || []).filter(item => !item.isMarkedForValidation);

      dispatch({
        type: AttachFilesActions.GET_CHILDREN_FOLDER_SUCCESS,
        payload: {
          id: folderId,
          nodes: childNodes,
          path: folderPath,
        },
      });
    } catch (error) {
      dispatch(addInputFileError(error));
      dispatch({ type: AttachFilesActions.GET_CHILDREN_FOLDER_ERROR });
    }
  };
}

export function previewFile(t, id, fileName, delimiter = '', workpaperId, engagementId, trifactaFlowId) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return async (dispatch, getState) => {
    if (!getState().dialogs.attachFilesDialog.get('isFilePreviewLoading')) {
      try {
        dispatch({
          type: AttachFilesActions.PREVIEW,
        });

        let { item: filePath } = await stagingService.getFilePath(id);

        // If a file is encrypted remove .enc
        const fileExt = path.extname(filePath.replace('.enc', ''))?.toLowerCase();
        const isExcel = fileExt === '.xlsx';
        const isEngagementWp = engagementId && engagementId !== EMPTY_ENGAGEMENT_ID;
        const isTrifactaWP = !!trifactaFlowId;

        let sheetData;
        let sheetSchema;
        let isEncryptedFile = false;

        const { data, schema } = await (async () => {
          switch (fileExt) {
            case '.xlsx':
              if (filePath.endsWith('.enc')) {
                const decryptedPath = getDecryptedFilePath(filePath, fileName, engagementId, id);
                await analyticService.decryptFiles([filePath], [decryptedPath], engagementId, 'DecryptBlob', true);

                isEncryptedFile = true;
                filePath = decryptedPath;
              }
              sheetData = await analyticService.getSheets(filePath, id, isEncryptedFile);
              sheetSchema = await analyticService.getXLSXSheetSchema(id, filePath, isEncryptedFile);
              const { name, sheet, sheetInfo } = (sheetData && sheetData[0]) || {};

              return analyticService.getPreviewXLSX(
                filePath,
                id,
                delimiter,
                name,
                sheet,
                sheetInfo,
                isEngagementWp,
                isTrifactaWP,
                isEncryptedFile
              );
            case '.parquet':
              return analyticService.getTableData(filePath, id, delimiter, workpaperId, isEngagementWp, isTrifactaWP);
            case '.pqt':
              return analyticService.getTableData(filePath, id, null, workpaperId, isEngagementWp, isTrifactaWP);
            default:
              if (filePath.endsWith('.xls.enc')) {
                const decryptedPath = getDecryptedFilePath(filePath, fileName, engagementId, id);
                await analyticService.decryptFiles([filePath], [decryptedPath], engagementId, 'DecryptBlob', true);

                isEncryptedFile = true;
                filePath = decryptedPath;
              }
              // for csv.enc isEncryptedFile falg is of no use

              return analyticService.getPreviewCSV(
                filePath,
                id,
                delimiter,
                isEngagementWp,
                isTrifactaWP,
                isEncryptedFile
              );
          }
        })();

        dispatch({
          type: AttachFilesActions.PREVIEW_SUCCESS,
          payload: {
            fileType: isExcel ? 'sheet' : 'csv',
            data,
            schema,
            nodeId: id,
            sheetData: formatSheetData(sheetData, sheetSchema) || [],
          },
        });
      } catch (error) {
        dispatch(addInputFileError(error));
        dispatch({ type: AttachFilesActions.PREVIEW_FAILURE, error });
      }
    }
  };
}

export function previewXLSXSheet(id, fileName, engagementId, trifactaFlowId, sheetData = {}) {
  return async dispatch => {
    try {
      let isEncryptedFile = false;
      dispatch({
        type: AttachFilesActions.PREVIEW_SHEET,
      });

      let { item: filePath } = await stagingService.getFilePath(id);
      if (filePath.endsWith('.enc')) {
        isEncryptedFile = true;
        const subStrRegex = /^[\s\S]*\/Engagement\//gi;
        filePath = `${filePath.match(subStrRegex)}${engagementId}/decryptedfiles/${id}_${fileName.replace('.enc', '')}`;
      }

      const { name, sheet, sheetInfo } = sheetData;

      const { data, schema } = await analyticService.getPreviewXLSX(
        filePath,
        id,
        null,
        name,
        sheet,
        sheetInfo,
        engagementId && engagementId !== EMPTY_ENGAGEMENT_ID,
        !!trifactaFlowId,
        isEncryptedFile
      );

      dispatch({
        type: AttachFilesActions.PREVIEW_SHEET_SUCCESS,
        payload: {
          data,
          schema,
        },
      });
    } catch (error) {
      dispatch(addInputFileError(error));
      dispatch({ type: AttachFilesActions.PREVIEW_SHEET_FAILURE, payload: error });
    }
  };
}

export function getDatamodelFields(id) {
  return async dispatch => {
    try {
      dispatch({ type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_REQUEST });
      const headers = await bundlesService.getDatamodelFields(id);
      const fields = [];
      headers.items.map(field => {
        fields.push({ ...field, nameTech: sanitizeColumnName(field.nameTech) });

        return field;
      });
      dispatch({
        type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_SUCCESS,
        payload: { fields, fileType: 'csv', id },
      });
    } catch (err) {
      dispatch(addInputFileError(err));
      dispatch({ type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_ERROR, payload: { err } });
    }
  };
}

export function getDatamodelList() {
  return async dispatch => {
    try {
      dispatch({ type: AttachFilesActions.GET_ALL_DATAMODELS_REQUEST });
      const dmList = await bundlesService.getPublishedDatamodelList();
      const dmListTree = {};
      dmList.items.forEach(eachDM => {
        dmListTree[`${eachDM.id}`] = { ...eachDM, typeOfNode: 0, level: 1, name: eachDM.nameTech };
      });

      dispatch({ type: AttachFilesActions.GET_ALL_DATAMODELS_SUCCESS, payload: dmListTree });
    } catch (err) {
      dispatch(addInputFileError(err));
      dispatch({ type: AttachFilesActions.GET_ALL_DATAMODELS_ERROR });
    }
  };
}
