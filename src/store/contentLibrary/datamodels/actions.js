import { addGlobalError, addDMFieldError, addIngestDMTError } from '../../errors/actions';
import { getPublishedBundlesList } from '../../bundles/actions';
import { AlertTypes } from 'cortex-look-book';
import { CLDataModelsActionTypes } from './actionTypes';
import { CLCDMActionTypes } from '../commonDataModels/actionTypes';
import bundleService from '../../../services/bundles.service';
import stagingService from '../../../services/staging.service';
import analyticsUIService from '../../../services/analytics-ui.service';
import FileSaver from 'file-saver';
import workpaperService from '../../../services/workpaper.service';
import ServerError from '../../../utils/serverError';

const DMT_MAPPING_TYPE = 'dmMapping';
const PROMPT_DM_RENAME = 'Prompt for Data Model Rename';

export function getAllDataModels() {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST });
      const cdmsList = await bundleService.getAllCommonDataModels();
      const result = await bundleService.getDatamodelsList();
      dispatch({ type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: cdmsList });
      dispatch({ type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.FETCH_DATAMODELS_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getPublishedDatamodels() {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_REQUEST });
      const dmLlist = await bundleService.getPublishedDatamodelList();

      dispatch({
        type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_SUCCESS,
        payload: dmLlist?.items,
      });

      return dmLlist;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getDatamodelFromId(datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_DATA });
      const datamodel = await bundleService.getDatamodelFromId(datamodelId);

      dispatch({
        type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_SUCCESS,
        payload: datamodel,
      });

      return datamodel;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteDMField(datamodelId, fieldId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD });
      const result = await bundleService.deleteField(datamodelId, fieldId);
      dispatch(getDatamodelFromId(datamodelId));

      dispatch({
        type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getDMFieldTypes() {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DM_FILED_TYPES });
      const result = await bundleService.getFieldTypes();

      dispatch({
        type: CLDataModelsActionTypes.GET_DM_FILED_TYPES_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DM_FIELD_TYPES_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updateDMField(datamodelId, field) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.UPDATE_DM_FIELD });
      const result = await bundleService.updateDMField(datamodelId, field);
      dispatch(getDatamodelFromId(datamodelId));

      dispatch({
        type: CLDataModelsActionTypes.UPDATE_DM_FIELD_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.UPDATE_DM_FIELD_ERROR });
      dispatch(addDMFieldError(err));

      return false;
    }
  };
}

export function updateDataModel(datamodel) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.UPDATE_DATAMODEL_REQUEST });
      const result = await bundleService.updateDataModel(datamodel);
      dispatch(getAllDataModels());

      dispatch({
        type: CLDataModelsActionTypes.UPDATE_DATAMODEL_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.UPDATE_DATAMODEL_ERROR });
      dispatch(addDMFieldError(err));

      return false;
    }
  };
}

export function switchDMToDraft(datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT });
      const result = await bundleService.switchDMToDraft(datamodelId);
      dispatch(getAllDataModels());

      dispatch({
        type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function postAddGuidance(data) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.POST_ADD_GUIDANCE });
      const result = await bundleService.postAddGuidance(data);
      dispatch(getAllDataModels());
      dispatch({ type: CLDataModelsActionTypes.POST_ADD_GUIDANCE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.POST_ADD_GUIDANCE_ERROR });
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));

      return false;
    }
  };
}
export function submitDMForReview(datamodelId, comments = '', releaseType = '', rationaleComments = '') {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW });
      const result = await bundleService.submitDMForReview(datamodelId, comments, releaseType, rationaleComments);
      dispatch(getAllDataModels());

      dispatch({
        type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteDM(datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.DELETE_DATAMODEL_REQUEST });
      const result = await bundleService.deleteDM(datamodelId);
      dispatch(getAllDataModels());

      dispatch({
        type: CLDataModelsActionTypes.DELETE_DATAMODEL_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.DELETE_DATAMODEL_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function redirectToDMValidations(datamodel) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION });
      const result = await bundleService.redirectToDMValidations(datamodel);

      dispatch({
        type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function exportDataModels(id) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.EXPORT_DATAMODEL });
      const data = await bundleService.exportDataModels([id]);
      const blobFile = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const currentDate = new Date();
      const fileName = `dataModels_${currentDate.getDate()}-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}.json`;
      FileSaver.saveAs(blobFile, fileName);
      dispatch({ type: CLDataModelsActionTypes.EXPORT_DATAMODEL_SUCCESS });
    } catch (error) {
      dispatch({ type: CLDataModelsActionTypes.EXPORT_DATAMODEL_ERROR });
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: error.message }));
    }
  };
}
export function getDMTsFromDM(datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_FROM_DM });
      let result = await workpaperService.getDMTsFromDM(datamodelId);
      if (result.length > 0) {
        result = result.sort((dm1, dm2) => Date.parse(dm2.lastUpdated) - Date.parse(dm1.lastUpdated));
      }

      dispatch({
        type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function uploadExampleDatamodel(file, datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE });
      const bundleNodeObj = await stagingService.ensureFolder(datamodelId);
      const getNodeObj = await stagingService.generateDMUploadLink(file, bundleNodeObj.nodeId);
      await bundleService.changeDataModelState(datamodelId, getNodeObj.id);
      dispatch(getAllDataModels());
      dispatch({ type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS });

      return true;
    } catch (error) {
      dispatch({ type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_ERROR, payload: { error } });

      return false;
    }
  };
}

export function uploadDataModels(file) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.UPLOAD_DATAMODELS });
      await bundleService.uploadDataModels(file);
      dispatch(getAllDataModels());
      dispatch({ type: CLDataModelsActionTypes.UPLOAD_DATAMODELS_SUCCESS });

      return true;
    } catch (error) {
      dispatch({ type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_ERROR, payload: { error } });

      return false;
    }
  };
}

export function createDMT(dmName, datamodelId, name, IsTrifactaWorkpaper, fetchLatestDMTList) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.CREATE_NEW_DMT });
      const result = await workpaperService.createDMT(dmName, datamodelId, name, IsTrifactaWorkpaper);
      dispatch({
        type: CLDataModelsActionTypes.CREATE_NEW_DMT_SUCCESS,
        payload: result,
      });
      if (fetchLatestDMTList) {
        dispatch(getDMTsFromDM(datamodelId));
      }

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.CREATE_NEW_DMT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function renameDMT(dmtId, name, datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.CREATE_NEW_DMT });
      const result = await workpaperService.renameDMT(dmtId, name);
      dispatch({
        type: CLDataModelsActionTypes.CREATE_NEW_DMT_SUCCESS,
        payload: result,
      });
      dispatch(getDMTsFromDM(datamodelId));

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.CREATE_NEW_DMT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function addInputForDMT(dmtId, datamodel, dmtType, trifactaFlowId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DMT });
      const result = await analyticsUIService.addInputForDMT(dmtId, datamodel, dmtType, trifactaFlowId);
      dispatch({
        type: CLDataModelsActionTypes.VALIDATE_DMT_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DMT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getDatamodelMappings(mappingSource, datamodelsIds, datamodelName = '') {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING });
      let mappingResult = [];
      if (mappingSource === DMT_MAPPING_TYPE) {
        mappingResult = await workpaperService.getDatamodelMappings(datamodelsIds[0], datamodelName);
      } else {
        const draftStateDM = [];
        const publishedDatamodels = getState().contentLibraryDMs.get('publishedDatamodels');
        datamodelsIds.forEach(eachElementId => {
          const mappedPublishedDM = publishedDatamodels.find(eachPublishedDM => eachPublishedDM.id === eachElementId);
          if (mappedPublishedDM) {
            mappingResult.push(mappedPublishedDM);
          } else {
            draftStateDM.push(eachElementId);
          }
        });
        if (draftStateDM.length > 0) {
          // call the API if any draft state DM exist
          const draftDMMappingResult = await bundleService.getDatamodelsByIds(draftStateDM);
          mappingResult = [...mappingResult, ...draftDMMappingResult];
        }
      }

      dispatch({
        type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_SUCCESS,
        payload: { mappingResult },
      });
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_ERROR, payload: err.message });
    }
  };
}

export function getEnvironments() {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS });
      const allEnvironments = await bundleService.fetchAllEnvironments();
      dispatch({
        type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_SUCCESS,
        payload: allEnvironments,
      });
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_ERROR, payload: err.message });
      dispatch(addIngestDMTError(err));
    }
  };
}

export function getDMTFromEnvironment(activeDMT, selectedEnvironment) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT });
      const option = {
        bundleName: activeDMT.bundleName,
        publishedState: 'published',
        pullFromSource: selectedEnvironment,
        sourceSystemName: activeDMT.sourceSystemName,
        sourceVersionId: activeDMT.sourceVersionId,
        sourceVersionName: activeDMT.sourceVersionName,
      };
      const environmentContent = await bundleService.fetchDMTContents(option);
      const sortedDMT = [];
      if (environmentContent?.sourceSystems) {
        const prepDMT = {
          bundleId: activeDMT.bundleId,
          externalBundleId: environmentContent.sourceSystems[0].sourceVersions[0].bundleId,
          bundleName: activeDMT.bundleName,
          sourceSystemName: activeDMT.sourceSystemName,
          sourceVersionId: activeDMT.sourceVersionId,
          sourceVersionName: activeDMT.sourceVersionName,
          publishedState: 'published',
          pullFromSource: selectedEnvironment,
          name: activeDMT.sourceVersionName,
        };
        sortedDMT.push({ ...prepDMT });
        if (environmentContent?.trifactaTransformationId) {
          sortedDMT.push({
            ...prepDMT,
            trifactaTransformationId: environmentContent.trifactaTransformationId,
            workpaperSource: 'Trifacta',
          });
        }
      }
      dispatch({
        type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_SUCCESS,
        payload: sortedDMT,
      });
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_ERROR });
      dispatch(addIngestDMTError(err));
    }
  };
}

export function ingestDMTAction(dmtDetails, openRenameModal) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT });
      const option = {
        bundleId: dmtDetails.bundleId,
        bundleName: dmtDetails.bundleName,
        externalBundleId: dmtDetails.externalBundleId,
        publishedState: dmtDetails.publishedState,
        pullFromSource: dmtDetails.pullFromSource,
        sourceSystemName: dmtDetails.pullFromSource,
        sourceVersionName: dmtDetails.sourceVersionName,
        isAlertForRename: openRenameModal,
      };
      const result = await bundleService.ingestDMT(option);

      if (result.length > 0) {
        const customError = [];
        result.forEach(eachError => {
          customError.push(new ServerError(eachError.message));
        });

        throw customError;
      }

      dispatch({
        type: CLDataModelsActionTypes.INGEST_DMT_SUCCESS,
        payload: result,
      });

      return { error: false };
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT_ERROR });
      if (!err.length && err.message.includes(PROMPT_DM_RENAME)) {
        return { error: true, isRename: true };
      }
      dispatch(addIngestDMTError(err));

      return { error: true };
    }
  };
}

export function ingestSBTAction(bundleDetails, bundleBaseId, userEmailId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT });
      const option = {
        pullFromSource: bundleDetails.pullFromSource,
        bundleTransformationType: 1,
        bundleId: bundleDetails.bundleId,
        externalBundleId: bundleDetails.externalBundleId,
        bundleTranformationName: bundleDetails.bundleName,
        externalBundleTransformId: bundleDetails.trifactaTransformationId,
        sourceVersionId: bundleDetails.sourceVersionId,
        userEmail: userEmailId,
      };

      const result = await workpaperService.ingestBundleTransformation(option);

      dispatch({
        type: CLDataModelsActionTypes.INGEST_DMT_SUCCESS,
        payload: result,
      });

      dispatch(getPublishedBundlesList(bundleBaseId));

      return { error: false };
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT_ERROR });
      dispatch(addIngestDMTError(err));

      return { error: true };
    }
  };
}

export function getPublishedDatamodelsByEnv(environment) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV });
      const environmentContent = await bundleService.fetchContents(environment);
      dispatch({
        type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_SUCCESS,
        payload: environmentContent,
      });
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_ERROR, payload: err.message });
    }
  };
}

export function clearModalContent() {
  return async dispatch => {
    dispatch({ type: CLDataModelsActionTypes.CLEAR_MODAL_CONTENT });
  };
}

export function ingestDataModel(ingestingDatamodel) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DATAMODEL_START });
      const datamodel = await bundleService.ingestDatamodel(ingestingDatamodel);
      await dispatch(getAllDataModels());
      dispatch({ type: CLDataModelsActionTypes.INGEST_DATAMODEL_SUCCESS, payload: { bundle: datamodel } });
      if (datamodel.length === undefined) {
        // let ingestingDataModelName = values.issamename ? values.newname : ingestingDataModel.dataModelName
      } else {
        dispatch(addGlobalError(datamodel));
      }

      return datamodel;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DATAMODEL_ERROR, payload: { err, ingestingDatamodel } });
      if (err.message.indexOf(PROMPT_DM_RENAME) === -1) {
        dispatch(addGlobalError(err));
      } else if (err.message.indexOf(PROMPT_DM_RENAME) > -1) {
        return { isPop: true };
      }

      return { isError: true };
    }
  };
}

export function getDMTsOfDMByEnv(datamodelName, environment) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST });
      const result = await workpaperService.getDMTsofDMByEnv(datamodelName, environment);
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_ERROR, payload: { err } });
      dispatch(addGlobalError(err));

      return { isError: true };
    }
  };
}

export function ingestDMT(ingestRequestObj) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT_QUEUE });
      const result = await workpaperService.ingestDMT(ingestRequestObj);
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT_QUEUE_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.INGEST_DMT_QUEUE_ERROR, payload: { err } });
      dispatch(addGlobalError(err));

      return { isError: true };
    }
  };
}

export function getDMTIngestionStatus(datamodelName) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS });
      let result = await workpaperService.getDMTsIngestionStatus(datamodelName);
      if (result?.length > 0) {
        result = result.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
      }
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_ERROR, payload: { err } });
      dispatch(addGlobalError(err));

      return { isError: true };
    }
  };
}

export function getSBTIngestionStatus(id, refreshIcon = false) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS });
      dispatch({ type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: refreshIcon });
      const result = await workpaperService.getSBTIngestionStatus(id);
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_SUCCESS, payload: [result] });
      dispatch({ type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: false });

      return result;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_ERROR, payload: { err } });
      dispatch({ type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: false });
      dispatch(addGlobalError(err));

      return { isError: true };
    }
  };
}

export function validateDMTName(dmtName) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DMT_NAME });

      const isValidName = await workpaperService.validateDMTName(dmtName);
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DMT_NAME_SUCCESS });

      return isValidName;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.VALIDATE_DMT_NAME_ERROR });

      if (err?.code === 409) {
        return false;
      }
      dispatch(addGlobalError(err));

      return { isError: true };
    }
  };
}

export function clearDMTsOfDMByEnv() {
  return async dispatch => {
    dispatch({ type: CLDataModelsActionTypes.CLEAR_DMTS_OF_DM });
  };
}

export function getDatamodelVersionsHistoryById(datamodelId) {
  return async dispatch => {
    try {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY });
      const datamodel = await bundleService.getDatamodelFromId(datamodelId);

      dispatch({
        type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_SUCCESS,
        payload: datamodel,
      });

      return datamodel;
    } catch (err) {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_ERROR_RESET });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
