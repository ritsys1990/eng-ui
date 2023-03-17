import { WPProcessStep3ActionTypes } from './actionTypes';
import AnalyticsUIService from '../../../services/analytics-ui.service';
import StagingService from '../../../services/staging.service';
import WorkpaperService from '../../../services/workpaper.service';
import { addGlobalError } from '../../errors/actions';
import { AlertTypes } from 'cortex-look-book';
import ServerError from '../../../utils/serverError';
import DataWranglerService from '../../../services/data-wrangler.service';
import { WB_PROCESS_TYPE } from 'src/utils/workbooks.const';
import { checkFileExtension } from '../../../utils/outputsHelper';
import { getTranslation } from '../../../hooks/useTranslation';
import { downloadFileFromStream } from '../../../utils/fileHelper';
import bundlesService from '../../../services/bundles.service';
import { NotificationStatus } from '../../../constants/signalR.const';
import { JE_GOLDEN_CHECK } from '../../../components/WorkPaperProcess/constants/WorkPaperProcess.const';

export function getWorkPaperOutputs(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.GET_DATA });

      const outputs = await AnalyticsUIService.getWorkPapersOutputs(workpaperId);

      dispatch({
        type: WPProcessStep3ActionTypes.GET_DATA_SUCCESS,
        payload: { outputs, workpaperId },
      });

      return outputs;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.GET_DATA_ERROR });

      return false;
    }
  };
}

export function cloneWorkbooks(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.CLONE_WORKBOOKS });

      await AnalyticsUIService.cloneWorkbooks(workpaperId);
      const workbooks = await AnalyticsUIService.getWorkbooks(workpaperId);
      const payload = { workbooks, workpaperId };

      dispatch({
        type: WPProcessStep3ActionTypes.CLONE_WORKBOOKS_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({ type: WPProcessStep3ActionTypes.CLONE_WORKBOOKS_ERROR });
    }
  };
}

export function getOutput(workpaperId, outputId, canvasType, wpType) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT });
      const output = await AnalyticsUIService.getOutputDetails(workpaperId, outputId, wpType);
      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_SUCCESS,
        payload: output,
      });

      return output;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT_ERROR });

      return false;
    }
  };
}

export function getAllOutputs(workpaperId, name) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.GET_ALL_OUTPUTS_DETAIL });

      const outputsDetail = await AnalyticsUIService.getAllDCQs(workpaperId);

      await StagingService.storageDownloadAllOutputFiles(outputsDetail, name);

      dispatch({
        type: WPProcessStep3ActionTypes.GET_ALL_OUTPUTS_DETAIL_SUCCESS,
        payload: outputsDetail,
      });

      return outputsDetail;
    } catch (err) {
      dispatch(addGlobalError(err));
      // dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT_ERROR });

      return false;
    }
  };
}

export function saveOutputAsCSV(outputId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_AS_CSV });

      const csv = await AnalyticsUIService.saveOutputAsCSV(outputId);

      await StagingService.storageDownloadFile(csv?.id, true);

      dispatch({
        type: WPProcessStep3ActionTypes.SAVE_AS_CSV_SUCCESS,
        payload: csv,
      });

      return csv;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_AS_CSV_ERROR });

      return false;
    }
  };
}

export function saveOutputToJE(workpaperId, outputName, transformationId, outputType, outputId, engagementId) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return async (dispatch, getState) => {
    try {
      let jeInProgress = false;
      let tbInProgress = false;
      let jeFailed = false;
      let jeInPending = false;
      if (engagementId) {
        const allOutputsList = await AnalyticsUIService.getWorkPapersOutputs(workpaperId);
        for (let i = 0; i < allOutputsList.outputs.length; i++) {
          if (
            allOutputsList.outputs[i] &&
            allOutputsList.outputs[i].jeStatus &&
            (allOutputsList.outputs[i].jeStatus.status === 'RequestSent' ||
              allOutputsList.outputs[i].jeStatus.status === 'RequestAccepted' ||
              (allOutputsList.outputs[i].jeStatus.type === 'JE' &&
                allOutputsList.outputs[i].jeStatus.status === 'Failed'))
          ) {
            if (allOutputsList.outputs[i].jeStatus.type === 'TB') {
              // eslint-disable-next-line no-unused-vars
              tbInProgress = true;
            }
            if (
              allOutputsList.outputs[i].jeStatus.type === 'JE' &&
              // eslint-disable-next-line eqeqeq
              allOutputsList.outputs[i].jeStatus.status != 'Failed'
            ) {
              jeInPending = true;
            }
            if (
              allOutputsList.outputs[i].jeStatus.type === 'JE' &&
              allOutputsList.outputs[i].jeStatus.status === 'Failed'
            ) {
              jeFailed = true;
            }

            if (
              (outputType === 'TB' && allOutputsList.outputs[i].jeStatus.type === 'JE' && !tbInProgress) ||
              (outputType === 'JE' && jeFailed) ||
              (outputType === 'JE' && !jeInPending)
            ) {
              // console.log('Triggered Save to TB');
            } else {
              jeInProgress = true;
            }
          }
        }
      }
      if (engagementId === null || (engagementId && jeInProgress === false)) {
        jeInProgress = false;
        dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE });

        const fileAdderRes = await AnalyticsUIService.getParquetFileAddress(workpaperId, outputName, transformationId);
        const content = getState().settings.get('content');
        const { t } = getTranslation(content);

        if (!fileAdderRes?.nodeInfo?.filePath || !fileAdderRes?.nodeInfo?.nodeId) {
          throw new ServerError(t('Pages_WorkpaperProcess_Output_SaveToJEPParquetError'));
        }

        const saveJERes = await WorkpaperService.saveToJEOutputRequest(
          workpaperId,
          fileAdderRes?.nodeInfo?.filePath,
          fileAdderRes?.nodeInfo?.nodeId,
          outputType,
          outputId
        );

        dispatch(getWorkPaperOutputs(workpaperId));

        if (saveJERes && !saveJERes.isError) {
          dispatch(
            addGlobalError({
              type: AlertTypes.SUCCESS,
              message: t('Pages_WorkpaperProcess_Output_SaveToJEPSuccessAlert'),
            })
          );
          dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_SUCCESS });

          return;
        }

        dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR });
      }

      // eslint-disable-next-line consistent-return
      return jeInProgress;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR });

      // eslint-disable-next-line consistent-return
      return false;
    }
  };
}

export function saveTrifactaOutputToJE(workpaperId, filePath, nodeId, outputType, outputId, engagementId) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return async (dispatch, getState) => {
    try {
      let jeInProgress = false;
      let tbInProgress = false;
      let jeFailed = false;
      let jeInPending = false;
      if (engagementId) {
        const allOutputsList = await AnalyticsUIService.getWorkPapersOutputs(workpaperId);
        for (let i = 0; i < allOutputsList.outputs.length; i++) {
          if (
            allOutputsList.outputs[i] &&
            allOutputsList.outputs[i].jeStatus &&
            (allOutputsList.outputs[i].jeStatus.status === 'RequestSent' ||
              allOutputsList.outputs[i].jeStatus.status === 'RequestAccepted' ||
              (allOutputsList.outputs[i].jeStatus.type === 'JE' &&
                allOutputsList.outputs[i].jeStatus.status === 'Failed'))
          ) {
            if (allOutputsList.outputs[i].jeStatus.type === 'TB') {
              // eslint-disable-next-line no-unused-vars
              tbInProgress = true;
            }
            if (
              allOutputsList.outputs[i].jeStatus.type === 'JE' &&
              // eslint-disable-next-line eqeqeq
              allOutputsList.outputs[i].jeStatus.status != 'Failed'
            ) {
              jeInPending = true;
            }
            if (
              allOutputsList.outputs[i].jeStatus.type === 'JE' &&
              allOutputsList.outputs[i].jeStatus.status === 'Failed'
            ) {
              jeFailed = true;
            }

            if (
              (outputType === 'TB' && allOutputsList.outputs[i].jeStatus.type === 'JE' && !tbInProgress) ||
              (outputType === 'JE' && jeFailed) ||
              (outputType === 'JE' && !jeInPending)
            ) {
              // console.log('Triggered Save to TB');
            } else {
              jeInProgress = true;
            }
          }
        }
      }
      if (engagementId === null || (engagementId && jeInProgress === false)) {
        jeInProgress = false;
        dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE });
        const file = {
          url: filePath,
          nodeId,
        };
        const parquetFile = { file };

        const saveJERes = await AnalyticsUIService.triggerSaveToJEWithStandardDateFormat(
          parquetFile,
          workpaperId,
          outputId,
          outputType
        );

        const content = getState().settings.get('content');
        const { t } = getTranslation(content);

        dispatch(getWorkPaperOutputs(workpaperId));

        if (saveJERes && !saveJERes.isError) {
          dispatch(
            addGlobalError({
              type: AlertTypes.SUCCESS,
              message: t('Pages_WorkpaperProcess_Output_SaveToJEPSuccessAlert'),
            })
          );
          dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_SUCCESS });
        } else {
          dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR });
        }
      }

      return jeInProgress;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR });

      return false;
    }
  };
}

export function getAndSyncFlowOutputs(workpaperId) {
  return async (dispatch, getState) => {
    if (getState().wpProcess.step3.get('syncingOutputs') !== workpaperId) {
      try {
        dispatch({ type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT, payload: { workpaperId } });

        const outputs = await DataWranglerService.getAndSyncFlowOutputs(workpaperId);

        dispatch({
          type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_SUCCESS,
          payload: { [workpaperId]: outputs },
        });
      } catch (err) {
        dispatch(addGlobalError(err));
        dispatch({ type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_ERROR, payload: { workpaperId, outputs: [] } });
      }
    }
  };
}

export function getAndSyncFlowOutputsDmts(workpaperId) {
  return async (dispatch, getState) => {
    if (getState().wpProcess.step3.get('syncingOutputs') !== workpaperId) {
      try {
        dispatch({ type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT, payload: { workpaperId } });

        const outputs = await DataWranglerService.getAndSyncFlowOutputsDmts(workpaperId);

        dispatch({
          type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_SUCCESS,
          payload: outputs,
        });
      } catch (err) {
        dispatch(addGlobalError(err));
        dispatch({ type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_ERROR, payload: { workpaperId, outputs: [] } });
      }
    }
  };
}

export function getWorkbooks(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.GET_WORKBOOKS });
      const workbooks = await AnalyticsUIService.getWorkbooks(workpaperId);
      dispatch({
        type: WPProcessStep3ActionTypes.GET_WORKBOOKS_SUCCESS,
        payload: workbooks,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.GET_WORKBOOKS_ERROR });
    }
  };
}

export function publishWorkbook(workpaperId, name, file) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS,
        payload: { status: WB_PROCESS_TYPE.UPLOADING },
      });

      await AnalyticsUIService.publishWorkbook(workpaperId, name, file, chunk => {
        dispatch({
          type: WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_PROGRESS,
          payload: chunk,
        });
      });

      dispatch({
        type: WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_SUCCESS,
        payload: { status: WB_PROCESS_TYPE.DONE },
      });

      // Wait two secs before pulling new workbooks, cause it looks cool.
      await new Promise(resolve => setTimeout(() => resolve(), 2000));
      dispatch(getWorkbooks(workpaperId));
    } catch (err) {
      if (err.message === WB_PROCESS_TYPE.TABLEMISMATCH) {
        dispatch({
          type: WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_TABLEMISMATCH_ERROR,
          payload: { status: WB_PROCESS_TYPE.TABLEMISMATCH, message: err.message },
        });
      } else {
        dispatch({
          type: WPProcessStep3ActionTypes.PUBLISH_WORKBOOKS_ERROR,
          payload: { status: WB_PROCESS_TYPE.ERROR, message: err.message },
        });
      }
    }
  };
}

export function generateWorkbooks(workpaperId, manual = false) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS,
      });
      // Queue generate workbooks task.
      const payload = await AnalyticsUIService.generateWorkbooks(workpaperId, manual);
      dispatch({
        type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_STATE,
        payload,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_ERROR,
        payload: err.message,
      });
    }
  };
}

export function updateWbRefreshFlag(workpaperId, refreshFlag) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.WORKBOOK_REFRESH_FLAG });
      await AnalyticsUIService.updateWorkbookRefreshFlag(workpaperId, refreshFlag);
      dispatch({
        type: WPProcessStep3ActionTypes.WORKBOOK_REFRESH_FLAG_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.WORKBOOK_REFRESH_FLAG_ERROR });
    }
  };
}

export function getGenWBStatus(workpaperId) {
  return async dispatch => {
    try {
      // check current state.
      const payload = await AnalyticsUIService.getGenWBStatus(workpaperId);
      dispatch({
        type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_STATE,
        payload,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_FETCH_ERROR,
        payload: err.message,
      });
    }
  };
}

export function removeWorkbooks(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.REMOVE_WORKBOOKS });
      await AnalyticsUIService.removeWorkbooks(workpaperId);
      dispatch({
        type: WPProcessStep3ActionTypes.REMOVE_WORKBOOKS_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.REMOVE_WORKBOOKS_ERROR });
    }
  };
}

export function setupTableau(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.SETUP_TABLEAU });

      await AnalyticsUIService.setupTableau(workpaperId);
      dispatch({
        type: WPProcessStep3ActionTypes.SETUP_TABLEAU_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.SETUP_TABLEAU_ERROR, payload: err.message });
    }
  };
}

export function downloadOutputAsCSV(filename, outputId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV });

      const { path } = await AnalyticsUIService.downloadOutputInZip(outputId);

      const file = await StagingService.stagingGetFileDL(path);

      // eslint-disable-next-line sonarjs/no-duplicate-string
      downloadFileFromStream(file, filename, 'zip', 'application/octet-stream');

      dispatch({
        type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_ERROR });
    }
  };
}

export function getWorkpaperOutputLabels(outputs) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL,
      });

      const wpLabels = {};

      const configKey = 'EXCLUDEDUPLABELSLIST';
      const dupCheckExcludeLabelsList = await WorkpaperService.getWorkPaperConfigByKey(configKey);

      outputs.forEach(element => {
        const replacedDataSetName = element.dataSetName ? element.dataSetName.replace(/ /gi, '').toLowerCase() : '';
        wpLabels[element.id] = replacedDataSetName;
      });
      dispatch({
        type: WPProcessStep3ActionTypes.GET_WP_OUTPUT_LABEL_SUCCESS,
        payload: { dupCheckExcludeLabelsList, wpLabels },
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));

      return false;
    }
  };
}

export function getEngagementOutputLabels(engagementId, workpaperId) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL,
      });

      const configKey = 'EXCLUDEDUPLABELSLIST';
      const dupCheckExcludeLabelsList = await WorkpaperService.getWorkPaperConfigByKey(configKey);

      const outputList = await AnalyticsUIService.getOutputLabelsForEngagement(engagementId);
      const engagementLabels = [];
      const wpLabels = {};
      outputList.forEach(element => {
        const replacedDataSetName = element.dataSetName ? element.dataSetName.replace(/ /gi, '').toLowerCase() : '';
        if (element.workpaperId === workpaperId) {
          wpLabels[element.id] = replacedDataSetName;
        } else {
          engagementLabels.push(replacedDataSetName);
        }
      });

      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL_SUCCESS,
        payload: { dupCheckExcludeLabelsList, engagementLabels, wpLabels },
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_LABEL_ERROR,
      });

      return false;
    }
  };
}

export function saveToSql(nodePath, nodeId, outputId, workpaperId, mapping, tableName) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL });
      const result = await AnalyticsUIService.saveToSql(nodePath, nodeId, outputId, workpaperId, mapping, tableName);
      dispatch({
        type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_SQL_ERROR });

      return false;
    }
  };
}

export function saveToDL(nodePath, nodeId, outputId, workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL });
      const result = await AnalyticsUIService.saveToDL(nodePath, nodeId, outputId, workpaperId);
      dispatch({
        type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({ type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_DL_ERROR });

      return false;
    }
  };
}

export function updateOutputDataSetNames(finalLabelList, workpaperId) {
  return async dispatch => {
    try {
      if (Object.keys(finalLabelList).length > 0) {
        dispatch({
          type: WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL,
        });

        await AnalyticsUIService.updateOutputDataSetNames(finalLabelList);
        await dispatch(getWorkPaperOutputs(workpaperId));
        dispatch({
          type: WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL_SUCCESS,
        });
      } else {
        throw new Error('no changes has been made');
      }

      return true;
    } catch (err) {
      dispatch({
        type: WPProcessStep3ActionTypes.SAVE_OUTPUT_LABEL_ERROR,
        payload: err.message,
      });

      return false;
    }
  };
}

export function deleteLabelError() {
  return async dispatch => {
    dispatch({ type: WPProcessStep3ActionTypes.DELETE_LABEL_ERROR });
  };
}

export function getOutputSchema(output) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA });

      const schema = await DataWranglerService.getOutputSchema(output.jobId);

      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_SUCCESS,
        payload: schema,
      });

      return schema;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_ERROR });

      return false;
    }
  };
}

export function getOutputSchemaFromJob(nodePath, nodeId, workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA });

      const schema = await AnalyticsUIService.getFileSchemaFromJob(nodePath, nodeId, workpaperId);

      dispatch({
        type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_SUCCESS,
        payload: schema,
      });

      return schema;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.GET_OUTPUT_SCHEMA_ERROR });

      return false;
    }
  };
}

export function setOutputDataSetNames(updateArray, workpaperId) {
  return async dispatch => {
    try {
      if (Object.keys(updateArray).length > 0) {
        await AnalyticsUIService.updateOutputDataSetNames(updateArray);
        dispatch(getWorkPaperOutputs(workpaperId));
      } else {
        throw new Error('no changes has been made');
      }
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
    }
  };
}

export function clearOutputSchema() {
  return async dispatch => {
    dispatch({ type: WPProcessStep3ActionTypes.CLEAR_OUTPUT_SCHEMA, payload: [] });
  };
}

export function validateFileExtension(nodePath) {
  return async (dispatch, getState) => {
    const content = getState().settings.get('content');
    const { t } = getTranslation(content);

    try {
      checkFileExtension(nodePath);

      return true;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: t('Components_Outputs_checkFileExtension_Error') }));

      return false;
    }
  };
}

export function checkFileSize(dataLakePath) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.CHECK_FILE_SIZE_LOADER });

      const fileSize = await StagingService.checkFileSize(dataLakePath);
      const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
      dispatch({ type: WPProcessStep3ActionTypes.CHECK_FILE_SIZE_SUCCESS });

      return sizeInMB;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.CHECK_FILE_SIZE_ERROR });

      return false;
    }
  };
}

export function downloadAllOutputs(workpaperId, workpaperName, outputType) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS });

      const { path } = await AnalyticsUIService.downloadAllOutputsInZip(workpaperId, outputType.id);

      const file = await StagingService.stagingGetFileDL(path);

      downloadFileFromStream(file, `${workpaperName}_${outputType.name}`, 'zip', 'application/octet-stream');

      dispatch({
        type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_ERROR });
    }
  };
}

export function addDMToOutput(workpaperId, selectedDMId, oldDataModelId, outputId, isBundle) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_REQUEST });
      await AnalyticsUIService.addDMToOutput(workpaperId, selectedDMId, oldDataModelId, outputId, isBundle);
      const outputs = await DataWranglerService.getAndSyncFlowOutputs(workpaperId);
      dispatch({ type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_SUCCESS, payload: { workpaperId, outputs } });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_ERROR });
    }
  };
}

export function tableauTailoring(outputId, workpaperId, mappingTableau) {
  return async dispatch => {
    try {
      const data = { outputId, workpaperId, mappingTableau };
      dispatch({ type: WPProcessStep3ActionTypes.TABLEAU_TAILORING_OUTPUT_REQUEST });
      const result = await AnalyticsUIService.tableauTailoring(data);
      dispatch({ type: WPProcessStep3ActionTypes.TABLEAU_TAILORING_OUTPUT_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: WPProcessStep3ActionTypes.TABLEAU_TAILORING_OUTPUT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getConnectedDMInfo(datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE });
      const dmInfo = await bundlesService.getDatamodelFromId(datamodelId);

      dispatch({ type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_SUCCESS, payload: dmInfo });

      return dmInfo;
    } catch (err) {
      dispatch({ type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function clearConnectedDMInfo() {
  return async dispatch => {
    dispatch({ type: WPProcessStep3ActionTypes.CLEAR_CONNECTED_DM_STATE });
  };
}

export function updateWorkbookDataSource(workpaperId, workbookDataSource) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep3ActionTypes.UPDATE_WORKBOOKS,
        payload: { status: WB_PROCESS_TYPE.UPLOADING },
      });
      await WorkpaperService.updateWorkbookDataSource(workpaperId, workbookDataSource);

      dispatch({
        type: WPProcessStep3ActionTypes.UPDATE_WORKBOOKS_SUCCESS,
        payload: { status: WB_PROCESS_TYPE.DONE },
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WPProcessStep3ActionTypes.UPDATE_WORKBOOKS_ERROR,
        payload: { status: WB_PROCESS_TYPE.ERROR, message: err.message },
      });
    }
  };
}

export function executeJEReconciliationReport(workpaper) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep3ActionTypes.EXECUTE_JE_RECONCILIATION_REPORT,
      });
      await WorkpaperService.executeJEReconciliationReport(workpaper?.id);
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WPProcessStep3ActionTypes.EXECUTE_JE_RECONCILIATION_REPORT_ERROR,
      });
    }
  };
}

export function generateJEReconciliationReport(data) {
  return async (dispatch, getState) => {
    try {
      switch (data.status) {
        case NotificationStatus.PENDING:
        case NotificationStatus.RUNNING:
          dispatch({
            type: WPProcessStep3ActionTypes.GENERATE_JE_RECONCILIATION_REPORT,
          });
          break;
        case NotificationStatus.SUCCESS:
          const myClients = getState().client.get('myList');
          const { clientId } = getState().engagement.get('engagement');
          const { id: workpaperId } = getState().wpProcess.general.get('workpaper');
          const trifactaParameters = getState().wpProcess.step2.get('trifactaParameters').get(workpaperId);
          const { name: clientName } = myClients.filter(client => client.id === clientId)[0];

          let fiscalYear = 'yyyy';
          if (trifactaParameters.length) {
            const parameter = trifactaParameters.find(param => param.parameterName === JE_GOLDEN_CHECK.FISCAL_YEAR_STR);
            fiscalYear = parameter.parameterValue;
          }
          const fileName = JE_GOLDEN_CHECK.RECON_REPORT_FILE_NAME.replace('{clientName}', clientName).replace(
            '{fiscalYear}',
            fiscalYear
          );

          dispatch({
            type: WPProcessStep3ActionTypes.GENERATE_JE_RECONCILIATION_REPORT_SUCCESS,
          });
          const { item: filePath } = await StagingService.getFilePath(data.workpaper.ReconReportTemplateId);
          const fileExt = filePath.split('.').pop().toLowerCase();
          const file = await StagingService.stagingGetFileDL(filePath);

          downloadFileFromStream(file, fileName, fileExt, 'application/octet-stream');
          break;
        case NotificationStatus.FAILURE:
          dispatch(addGlobalError({ type: AlertTypes.ERROR, message: data?.error?.Message }));
          dispatch({
            type: WPProcessStep3ActionTypes.GENERATE_JE_RECONCILIATION_REPORT_ERROR,
          });
          break;
        default:
          break;
      }
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WPProcessStep3ActionTypes.EXECUTE_JE_RECONCILIATION_REPORT_ERROR,
      });
    }
  };
}
