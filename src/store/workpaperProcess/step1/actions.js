import { isEqual } from 'lodash';
import analyticsUIService from '../../../services/analytics-ui.service';
import pipelineService from '../../../services/pipeline.service';
import stagingService from '../../../services/staging.service';
import WorkpaperService from '../../../services/workpaper.service';
import DataWranglerService from '../../../services/data-wrangler.service';
import { WPProcessStep1ActionTypes } from './actionTypes';
import { addGlobalError, addInputOptionError, addWPProcessingErrors, connectToBundleError } from '../../errors/actions';
import { generateUnconfirmJRStepsPayload } from '../../../components/WorkPaperProcess/utils/WorkPaperProcess.utils';
import { getTrifactaJRSteps } from '../step2/actions';
import {
  WP_PROCESS_INPUT_STATUS,
  FILE_UPLOAD_TYPE,
} from '../../../components/WorkPaperProcess/constants/WorkPaperProcess.const';
import { WORKPAPER_TYPES, WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';
import bundlesService from '../../../services/bundles.service';
import { trackEvent } from '../../../app/appInsights/TelemetryService';
import { eventName, eventAction, eventStatus } from '../../../app/appInsights/appInsights.const';

const INTERNAL_COLS = ['ordering_col_for_spark_internal'];
const EMPTY_ENGAGEMENT_ID = '0000-engagement';

export function getWPStep1Details(workPaperId, checkOutdatedDMV = false, workpaperType = null, trifactaFlowId = null) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.GET_DATA });

      let inputs;
      if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
        if (getState().wpProcess.general.get('workpaper')?.notebook !== null) {
          inputs = await WorkpaperService.getWorkPaperInputs(workPaperId);
        }
      } else {
        inputs = await analyticsUIService.getWorkPaperInputs(workPaperId);
      }
      let outdatedDatamodels = null;

      if (inputs && checkOutdatedDMV) {
        outdatedDatamodels = [];
        for (let i = 0; i < inputs.length; ++i) {
          if (inputs[i]?.datamodelId) {
            const dataModel = await bundlesService.getDatamodelFromId(inputs[i].datamodelId);
            if (dataModel && !dataModel.isLatest) {
              outdatedDatamodels.push(inputs[i].datamodelId);
            }
          }
        }
      }

      if (workpaperType === WORKPAPER_TYPES.TRIFACTA && trifactaFlowId) {
        const trifactaJRSteps = getState().wpProcess.step2.get('trifactaJRSteps').get(workPaperId);
        if (trifactaFlowId === trifactaJRSteps?.flowId && trifactaJRSteps?.trifactaJRSteps?.length > 0) {
          const oldInputData = getState().wpProcess.step1.get('inputs');
          const areAllInputsDone = inputs.every(item => item.status === WP_PROCESS_INPUT_STATUS.DONE);
          if (oldInputData.length > 0 && areAllInputsDone && !isEqual(inputs, oldInputData)) {
            dispatch(getTrifactaJRSteps(trifactaFlowId));
          }
        }
      }

      dispatch({
        type: WPProcessStep1ActionTypes.GET_DATA_SUCCESS,
        payload: { inputs, outdatedDatamodels },
      });

      return inputs;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.GET_DATA_ERROR });

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
      dispatch({ type: WPProcessStep1ActionTypes.GET_INPUT });

      const input = await analyticsUIService.getInputDetails(workpaperId, inputId);

      dispatch({
        type: WPProcessStep1ActionTypes.GET_INPUT_SUCCESS,
        payload: input,
      });

      return input;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.GET_INPUT_ERROR });

      return false;
    }
  };
}

/**
 * Fetches the file preview based on the Node Id.
 * @param {string} nodeId
 */
export function getInputFilePreview(nodeId, delimiter = null, workpaperId = null, engagementId, trifactaFlowId) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep1ActionTypes.GET_PREVIEW,
      });

      const { item: filePath } = await stagingService.getFilePath(nodeId);

      let returnedData;
      let fileType = null;
      const fileExtension = filePath.replace('.enc', '').split('.').pop().toLowerCase();

      const isEngagementWp = engagementId && engagementId !== EMPTY_ENGAGEMENT_ID;
      const isTrifactaWP = !!trifactaFlowId;

      switch (fileExtension) {
        case 'xslx':
          fileType = 'sheet';
          // if this line is executed for encrypted xlsx file, few additional params needs to passed
          returnedData = await analyticsUIService.getPreviewXLSX(filePath, nodeId);
          break;

        case 'parquet':
          fileType = 'parquet';
          returnedData = await analyticsUIService.getTableData(
            filePath,
            nodeId,
            null,
            workpaperId,
            isEngagementWp,
            isTrifactaWP
          );
          break;
        case 'pqt':
          fileType = 'pqt';
          returnedData = await analyticsUIService.getTableData(
            filePath,
            nodeId,
            null,
            workpaperId,
            isEngagementWp,
            isTrifactaWP
          );
          break;
        case 'csv':
        default:
          fileType = 'csv';
          returnedData = await analyticsUIService.getPreviewCSV(
            filePath,
            nodeId,
            delimiter,
            isEngagementWp,
            isTrifactaWP
          );
          break;
      }

      const { data, schema } = returnedData;

      dispatch({
        type: WPProcessStep1ActionTypes.GET_PREVIEW_SUCCESS,
        payload: {
          fileType,
          data,
          schema: schema.filter(x => !INTERNAL_COLS.includes(x.name)),
        },
      });
    } catch (error) {
      dispatch(addGlobalError(error));
      dispatch({ type: WPProcessStep1ActionTypes.GET_PREVIEW_ERROR, error });
    }
  };
}

/**
 * Updates the information of an input based on the workpaperId and inputId
 *
 * @param {string} workpaperId
 * @param {string} inputId
 * @param {object} data
 */
export function updateInput(workpaperId, inputId, mappings, existingMapping = null, completed = false, trifactaFlowId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.UPDATE_INPUT });

      const input = await analyticsUIService.updateInput(
        workpaperId,
        inputId,
        mappings,
        existingMapping,
        completed,
        trifactaFlowId
      );

      dispatch({
        type: WPProcessStep1ActionTypes.UPDATE_INPUT_SUCCESS,
        payload: input,
      });

      return input;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.UPDATE_INPUT_ERROR });

      return false;
    }
  };
}

export function attachExistingNode(
  workpaperId,
  inputId,
  nodeId,
  fileSchema,
  shouldClean,
  delimiter = null,
  sheetList = [],
  workpaperType = null,
  trifactaFlowId = null,
  ensureHeader = true
) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.ATTACH });

      const trifactaProps = {};
      const trifactaParams = getState().wpProcess.step2.get('trifactaJRSteps').get(workpaperId);
      const inputData = getState().wpProcess.step1.get('inputs') || [];
      const currentInput = inputData.filter(input => input.id === inputId)?.[0];

      if (
        workpaperType === WORKPAPER_TYPES.TRIFACTA &&
        trifactaFlowId === trifactaParams?.flowId &&
        trifactaParams?.trifactaJRSteps.length > 0 &&
        (shouldClean || currentInput?.fileHistory?.length > 0)
      ) {
        trifactaProps.flowId = trifactaFlowId;
        trifactaProps.jrStepsPayload = generateUnconfirmJRStepsPayload(trifactaParams.trifactaJRSteps);
      }

      // We need to only pass TrifactaFlowID if its a Trifacta Workpaper. Currently its being passed for all workpaper types.

      const result = await analyticsUIService.attachNodeToInput(
        workpaperId,
        inputId,
        nodeId,
        fileSchema,
        shouldClean,
        delimiter,
        sheetList,
        trifactaProps,
        trifactaFlowId,
        ensureHeader
      );
      dispatch({
        type: WPProcessStep1ActionTypes.ATTACH_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.ATTACH_ERROR });

      return false;
    }
  };
}

export function attachNewFile(
  workpaperId,
  inputId,
  shouldClean,
  file,
  fileSchema,
  sheetList = [],
  delimiter = null,
  workpaperType = null,
  trifactaFlowId = null,
  blankHeaders = false,
  ensureHeader = true,
  engagementId = '',
  shouldSendMessage
) {
  return async (dispatch, getState) => {
    const fileSize = file.size;
    const fileName = file.name;
    const fileType = fileName.split('.').pop();
    try {
      dispatch({ type: WPProcessStep1ActionTypes.ATTACH });

      const trifactaProps = {};
      const trifactaParams = getState().wpProcess.step2.get('trifactaJRSteps').get(workpaperId);
      const inputData = getState().wpProcess.step1.get('inputs') || [];
      const currentInput = inputData.filter(input => input.id === inputId)?.[0];

      if (
        workpaperType === WORKPAPER_TYPES.TRIFACTA &&
        trifactaFlowId === trifactaParams?.flowId &&
        trifactaParams?.trifactaJRSteps.length > 0 &&
        (shouldClean ||
          currentInput?.fileHistory?.length > 0 ||
          (currentInput?.datamodelId && !currentInput?.fileHistory?.length > 0))
      ) {
        trifactaProps.flowId = trifactaFlowId;
        trifactaProps.jrStepsPayload = generateUnconfirmJRStepsPayload(trifactaParams.trifactaJRSteps);
      }

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

      const result = await analyticsUIService.attachNewFile(
        workpaperId,
        inputId,
        shouldClean,
        file,
        fileSchema,
        sheetList.map(sheet => ({ sheet: sheet.text, row: 0, col: 0 })),
        delimiter,
        trifactaFlowId,
        trifactaProps,
        blankHeaders,
        ensureHeader
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
        type: WPProcessStep1ActionTypes.ATTACH_SUCCESS,
        payload: result,
      });

      const inputsData = getState().wpProcess.step1.get('inputs') || [];
      const newInput = inputsData.find(input => input.id === inputId);
      if (shouldSendMessage && newInput) {
        const messageBody = {
          engagementId,
          workpaperId,
          inputId,
          inputFile: newInput.file.url,
          action: 'Added',
          targetEventName: 'InputModified',
        };
        await analyticsUIService.sendWorkpaperMessage(messageBody);
      }

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.ATTACH_ERROR });

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

export function uploadNewInput(
  workpaperId,
  shouldClean,
  file,
  fileSchema,
  sheetList = [],
  delimiter = null,
  folderName = '',
  dataTableName = '',
  nodeId = '',
  trifactaFlowId,
  inputId = '',
  datamodelId = '',
  blankHeaders = false,
  ensureHeader = true,
  engagementId,
  shouldSendMessage
) {
  let { fileName, fileType } = '';

  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT });
      let result;
      if (nodeId && nodeId !== '') {
        result = await analyticsUIService.uploadExistingInput(
          workpaperId,
          shouldClean,
          fileSchema,
          delimiter,
          dataTableName.trim(),
          nodeId,
          inputId,
          trifactaFlowId,
          datamodelId,
          sheetList,
          ensureHeader
        );
      } else {
        fileName = file.name;
        fileType = fileName.split('.').pop();
        const fileSize = file.size;
        trackEvent(
          eventName.FILE_UPLOAD,
          {
            eventAction: eventAction.STARTED,
            workpaperId,
            fileName,
            fileType,
            status: eventStatus.RUNNING,
            eventType: FILE_UPLOAD_TYPE.NEW_INPUT,
          },
          {
            fileSize,
          }
        );

        result = await analyticsUIService.uploadNewInput(
          trifactaFlowId,
          workpaperId,
          shouldClean,
          file,
          fileSchema,
          sheetList.map(sheet => ({ sheet: sheet.text, row: 0, col: 0 })),
          delimiter,
          folderName,
          dataTableName.trim(),
          inputId,
          datamodelId,
          blankHeaders,
          ensureHeader
        );

        trackEvent(
          eventName.FILE_UPLOAD,
          {
            eventAction: eventAction.COMPLETED,
            workpaperId,
            fileName,
            fileType,
            status: eventStatus.FINISHED,
            eventType: FILE_UPLOAD_TYPE.NEW_INPUT,
          },
          {
            fileSize,
          }
        );
      }

      const inputData = getState().wpProcess.step1.get('inputs') || [];
      let hasInputChanged = false;
      if (inputData.length > 0) {
        hasInputChanged = true;
      }
      dispatch({
        type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT_SUCCESS,
        payload: { result, hasInputChanged },
      });

      const inputsData = getState().wpProcess.step1.get('inputs') || [];
      let newInput;
      if (inputId) {
        newInput = inputsData.find(input => input.id === inputId);
      } else {
        newInput = inputsData.find(input => !inputData.find(currentInput => currentInput.id === input.id));
      }
      if (shouldSendMessage && newInput) {
        const messageBody = {
          engagementId,
          workpaperId,
          inputId: newInput.id,
          inputFile: newInput.file.url,
          action: 'Added',
          targetEventName: 'InputModified',
        };
        await analyticsUIService.sendWorkpaperMessage(messageBody);
      }

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT_ERROR });

      if (fileName) {
        trackEvent(eventName.FILE_UPLOAD, {
          eventAction: eventAction.COMPLETED,
          workpaperId,
          fileName,
          fileType,
          status: eventStatus.ERROR,
          eventType: FILE_UPLOAD_TYPE.NEW_INPUT,
        });
      }

      return false;
    }
  };
}

export function uploadNewDataModel(
  workpaperId,
  headersSchema,
  delimiter,
  datamodelId,
  filename,
  fileContent,
  trifactaFlowId,
  isDMT,
  isSource,
  isPriorPeriod,
  priorPeriodYear
) {
  return async (dispatch, getState) => {
    try {
      let uploadDM = true;
      let result = getState().wpProcess.step1.get('inputs') || [];
      dispatch({ type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT });

      if (isDMT && !!trifactaFlowId) {
        uploadDM = await WorkpaperService.addDMTSourceOutput(datamodelId, workpaperId, isSource);
      }
      if (uploadDM) {
        result = await analyticsUIService.uploadDataModel(
          workpaperId,
          headersSchema,
          delimiter,
          datamodelId,
          filename,
          fileContent,
          trifactaFlowId,
          isDMT,
          isPriorPeriod,
          priorPeriodYear
        );
      }
      dispatch({
        type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_ERROR });

      return false;
    }
  };
}

export function updateRequiredStatus(inputId, isRequired) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS });

      const returnUpdatedStatus = await analyticsUIService.updateInputRequiredOptional(inputId, isRequired);

      dispatch({
        type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_SUCCESS,
        payload: {
          inputId,
          isRequired,
          returnUpdatedStatus,
        },
      });

      return returnUpdatedStatus;
    } catch (err) {
      dispatch(addInputOptionError(err));
      dispatch({ type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_ERROR });

      return false;
    }
  };
}

export function deleteTrifactaDataset(
  inputId,
  workpaperId,
  engagementId,
  canvasType = '',
  datamodelId = '',
  shouldSendMessage
) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET });
      if (canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS && datamodelId) {
        const sourceObj = {
          isSource: true,
          datamodelId,
          datamodelTransformationId: workpaperId,
        };
        await WorkpaperService.removeDMTSourceOutput(sourceObj);
      }
      const inputsData = getState().wpProcess.step1.get('inputs') || [];
      const newInput = inputsData.find(input => input.id === inputId);
      const inputs = await analyticsUIService.deleteTrifactaInput(inputId, workpaperId, engagementId);
      dispatch({ type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_SUCCESS, payload: inputs });
      if (shouldSendMessage && newInput) {
        const messageBody = {
          engagementId: engagementId || '0000-engagement',
          workpaperId,
          inputId,
          inputFile: newInput.file.url,
          action: 'Deleted',
          targetEventName: 'InputModified',
        };
        await analyticsUIService.sendWorkpaperMessage(messageBody);
      }

      return true;
    } catch (err) {
      dispatch(addInputOptionError(err));
      dispatch({ type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_ERROR });

      return false;
    }
  };
}

export function updateInputCentralizedData(inputId, datasetType, unmark = false) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.MARK_INPUT_CENTRALIZED });
      const inputs = await analyticsUIService.updateInputCentralizedData(inputId, datasetType, unmark);
      dispatch({ type: WPProcessStep1ActionTypes.MARK_INPUT_CENTRALIZED_SUCCESS, payload: inputs });

      return true;
    } catch (err) {
      dispatch(addInputOptionError(err));
      dispatch({ type: WPProcessStep1ActionTypes.MARK_INPUT_CENTRALIZED_ERROR });

      return false;
    }
  };
}

export function renameTrifactaDataset(inputId, name) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET });
      const inputs = await analyticsUIService.renameTrifactaInput(inputId, name);
      dispatch({ type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_SUCCESS, payload: inputs });

      return true;
    } catch (err) {
      dispatch(addInputOptionError(err));
      dispatch({ type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_ERROR });

      return false;
    }
  };
}

export function getExistingMappings(engagementId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS });

      const existingMappings = await analyticsUIService.getExistingMappings(engagementId);

      dispatch({
        type: WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS_SUCCESS,
        payload: existingMappings,
      });

      return existingMappings;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS_ERROR });

      return false;
    }
  };
}

export const resetInput = () => {
  return dispatch => {
    dispatch({ type: WPProcessStep1ActionTypes.RESET_INPUT });
  };
};

export function clearInputData(workpaperId, inputId, trifactaFlowId, engagementId, shouldSendMessage) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA });

      const response = await analyticsUIService.clearInputData(workpaperId, inputId, trifactaFlowId);
      const inputsData = getState().wpProcess.step1.get('inputs') || [];
      const newInput = inputsData.find(input => input.id === inputId);
      if (shouldSendMessage && newInput) {
        const messageBody = {
          engagementId,
          workpaperId,
          inputId,
          inputFile: newInput?.file?.url,
          action: 'Cleared',
          targetEventName: 'InputModified',
        };
        await analyticsUIService.sendWorkpaperMessage(messageBody);
      }

      dispatch({
        type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_SUCCESS,
        payload: response,
      });

      return response;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_ERROR });

      return false;
    }
  };
}

export function uploadZipFile(
  workpaperId,
  file,
  zipFolders,
  zipFileStructure,
  isAppend,
  workpaperType = null,
  trifactaFlowId = null
) {
  const fileSize = file.size;
  const fileName = file.name;
  const fileType = fileName.split('.').pop();

  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE });

      const trifactaProps = {};
      const trifactaParams = getState().wpProcess.step2.get('trifactaJRSteps').get(workpaperId);
      const inputData = getState().wpProcess.step1.get('inputs') || [];

      if (
        workpaperType === WORKPAPER_TYPES.TRIFACTA &&
        trifactaFlowId === trifactaParams?.flowId &&
        trifactaParams?.trifactaJRSteps.length > 0 &&
        inputData.length > 0
      ) {
        trifactaProps.flowId = trifactaFlowId;
        trifactaProps.jrStepsPayload = generateUnconfirmJRStepsPayload(trifactaParams.trifactaJRSteps);
      }

      trackEvent(
        eventName.FILE_UPLOAD,
        {
          eventAction: eventAction.STARTED,
          workpaperId,
          fileName,
          fileType,
          status: eventStatus.RUNNING,
          eventType: isAppend ? FILE_UPLOAD_TYPE.ZIP_APPEND : FILE_UPLOAD_TYPE.ZIP_OVERWRITE,
        },
        {
          fileSize,
        }
      );

      const result = await analyticsUIService.uploadZipFile(
        workpaperId,
        file,
        zipFolders,
        zipFileStructure,
        isAppend,
        trifactaProps
      );
      dispatch({
        type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_ERROR });

      trackEvent(eventName.FILE_UPLOAD, {
        eventAction: eventAction.COMPLETED,
        workpaperId,
        fileName,
        fileType,
        status: eventStatus.ERROR,
        eventType: isAppend ? FILE_UPLOAD_TYPE.ZIP_APPEND : FILE_UPLOAD_TYPE.ZIP_OVERWRITE,
      });

      return false;
    }
  };
}

export function checkforZipfile(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE });
      const result = await analyticsUIService.checkforZipfile(workpaperId);
      dispatch({
        type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE_ERROR });

      return false;
    }
  };
}

export function retryInputFileCopy(workpaperId, inputId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.RETRY_COPY });
      const result = await analyticsUIService.retryInputFileCopy(workpaperId, inputId);
      if (result) {
        const allInputs = await analyticsUIService.getWorkPaperInputs(workpaperId);
        dispatch({
          type: WPProcessStep1ActionTypes.RETRY_COPY_SUCCESS,
          payload: { allInputs },
        });
      }
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.RETRY_COPY_ERROR });
    }
  };
}

export function connectDataSetToFlow(workpaperId, trifactaFlowId, filePath, inputId, inputName) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_REQUEST });
      const result = await analyticsUIService.connectDataSetToFlow(
        workpaperId,
        trifactaFlowId,
        filePath,
        inputId,
        inputName
      );
      if (result) {
        const allInputs = await analyticsUIService.getWorkPaperInputs(workpaperId);
        dispatch({
          type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_SUCCESS,
          payload: { allInputs },
        });
      }
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_ERROR });
    }
  };
}

export function getWorkpaperDatasetTypes() {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep1ActionTypes.GET_WORKPAPER_DATASET_TYPES,
      });

      const configKey = 'CENTRALIZEDDATASETS';
      const datasetTypes = await WorkpaperService.getWorkPaperConfigByKey(configKey);
      const datasetTypeOptions = [];
      (datasetTypes || []).forEach(type => {
        datasetTypeOptions.push({ name: type, value: type });
      });

      dispatch({
        type: WPProcessStep1ActionTypes.GET_WORKPAPER_DATASET_TYPES_SUCCESS,
        payload: datasetTypeOptions,
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getInputDetails(workpaperId, inputId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.GET_INPUT_DATA });
      const inputDetails = await analyticsUIService.getTrifactaInputDetails(workpaperId, inputId);
      const { data: inputData, schema: inputSchema } = inputDetails;
      const inputHeader = inputSchema.map(item => item.name);
      const inputColumns = inputData.map(item => inputHeader.map(h => item[h]));
      dispatch({
        type: WPProcessStep1ActionTypes.GET_INPUT_DATA_SUCCESS,
        payload: [inputHeader, ...inputColumns],
      });

      return inputDetails;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.GET_INPUT_DATA_ERROR });

      return false;
    }
  };
}

export function refreshCentralizedData(workpaperId, latestWorkPaper) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT });

      const engWorkpaperInputs = getState().wpProcess.step1.get('inputs');
      const latestInputs = await analyticsUIService.getWorkPaperInputs(latestWorkPaper.id);
      const updateWorkPaperTemplate = {
        Id: workpaperId,
        TemplateId: latestWorkPaper.id,
      };
      const inputsToBeRefreshed = [];
      engWorkpaperInputs.map(async item => {
        const matchedLatestInput = latestInputs.findIndex(input => input.name === item.name);
        if (
          item.centralizedData &&
          item.centralizedData.lastUpdated !== latestInputs[matchedLatestInput].centralizedData.lastUpdated
        ) {
          inputsToBeRefreshed.push({
            templateInputId: latestInputs[matchedLatestInput].id,
            id: item.id,
          });
        }
      });

      const updateStatusResult = await analyticsUIService.updateInputStatus(inputsToBeRefreshed, 'inprogress');
      if (updateStatusResult) {
        const allInputs = await analyticsUIService.getWorkPaperInputs(workpaperId);

        dispatch({
          type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_INPROGRESS,
          payload: { allInputs },
        });
        const updateResult = await analyticsUIService.updateCentralizedInput(workpaperId, inputsToBeRefreshed);
        if (updateResult) {
          await WorkpaperService.updateWorkpaperTemplate(updateWorkPaperTemplate);
          const refreshedInputs = await analyticsUIService.getWorkPaperInputs(workpaperId);
          dispatch({
            type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_SUCCESS,
            payload: { allInputs: refreshedInputs },
          });
        }
      }
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_ERROR });
    }
  };
}

export function triggerDMVForZipUploads(workpaperId, trifactaFlowId, dmvInputs) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT });
      let result = [];
      for (let i = 0; i < dmvInputs.length; ++i) {
        result = await analyticsUIService.triggerDMVForZipUploads(workpaperId, trifactaFlowId, dmvInputs[i].id);
      }
      dispatch({
        type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_ERROR });

      return err;
    }
  };
}

export function downloadInputFileExample(nodeId, filename) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE });
      const filePath = await stagingService.getFilePath(nodeId);
      const node = await stagingService.getTempLink(filePath.item);
      dispatch({ type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE_SUCCESS });
      if (node?.id) {
        await stagingService.storageDownloadFile(node.id, false, filename);
      }

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE_ERROR });

      return err;
    }
  };
}

export function getTrifactaBundles() {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES });
      const trifactaBundles = await bundlesService.getTrifactaBundles();

      dispatch({ type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_SUCCESS, payload: trifactaBundles });
    } catch (err) {
      dispatch(connectToBundleError(err));
      dispatch({ type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_ERROR });
    }
  };
}

export function setBundleToInput(workpaperId, inputId, connectedBundlesData) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES });
      const refinedBundlesData = [...connectedBundlesData].map(eachBundle => {
        return {
          ...eachBundle,
          bundleBaseId: eachBundle.parentId,
          bundleId: eachBundle.id,
          bundleName: eachBundle.name,
        };
      });
      const result = await analyticsUIService.connectToBundle(inputId, refinedBundlesData);
      const allInputs = await analyticsUIService.getWorkPaperInputs(workpaperId);
      dispatch({ type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_SUCCESS, payload: { allInputs } });

      return result;
    } catch (err) {
      dispatch(connectToBundleError(err));
      dispatch({ type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_ERROR });

      return false;
    }
  };
}

export function decoupleDataRequest(workpaperId, inputId, workpaperType, trifactaFlowId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST });
      const result = await analyticsUIService.decoupleDataRequest(workpaperId, inputId);
      dispatch({ type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST_SUCCESS, payload: result });

      await dispatch(getWPStep1Details(workpaperId, null, workpaperType, trifactaFlowId));

      return true;
    } catch (err) {
      dispatch(addInputOptionError(err));
      dispatch({ type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST_ERROR });

      return false;
    }
  };
}

export function getInputRelationship(engagementId, workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.GET_INPUT_RELATIONSHIP });
      const result = await pipelineService.getInputRelationship(engagementId, workpaperId);
      dispatch({ type: WPProcessStep1ActionTypes.GET_INPUT_RELATIONSHIP_SUCCESS, payload: result });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function setAutoDmtFlag(workpaperId, newValue) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST });
      await analyticsUIService.setAutoDmtFlag(workpaperId, newValue);
      dispatch({ type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST_SUCCESS, payload: newValue });

      return true;
    } catch (err) {
      dispatch(addWPProcessingErrors(err));
      dispatch({ type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST_ERROR });

      return false;
    }
  };
}

export function getAutoDmtFlag(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST });
      const autoDMTFlag = await analyticsUIService.getAutoDmtFlag(workpaperId);
      dispatch({ type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_SUCCESS, payload: autoDMTFlag });

      return autoDMTFlag;
    } catch (err) {
      dispatch(addWPProcessingErrors(err));
      dispatch({ type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_ERROR });

      return null;
    }
  };
}

export function replaceInputDataModel(
  workpaperId,
  headersSchema,
  delimiter,
  datamodelId,
  filename,
  fileContent,
  trifactaFlowId,
  isDMT,
  inputId,
  engagementId,
  isPriorPeriod,
  priorPeriodYear
) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep1ActionTypes.REPLACE_DATAMODEL_INPUT });
      let inputs = getState().wpProcess.step1.get('inputs') || [];
      const oldInput = inputs.find(input => input.id === inputId);

      inputs = await analyticsUIService.uploadDataModel(
        workpaperId,
        headersSchema,
        delimiter,
        datamodelId,
        filename,
        fileContent,
        trifactaFlowId,
        isDMT,
        isPriorPeriod,
        priorPeriodYear
      );
      const newInput = inputs.find(i => i.name === filename);

      await DataWranglerService.replaceDataModelInFlowInput(
        trifactaFlowId,
        oldInput?.trifactaInputId,
        newInput?.trifactaInputId
      );
      inputs = await analyticsUIService.updateInputTrifactaId(inputId, 0);
      inputs = await analyticsUIService.deleteTrifactaInput(inputId, workpaperId, engagementId);
      dispatch({ type: WPProcessStep1ActionTypes.REPLACE_DATAMODEL_INPUT_SUCCESS, payload: inputs });

      return inputs;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep1ActionTypes.REPLACE_DATAMODEL_INPUT_ERROR });

      return false;
    }
  };
}
