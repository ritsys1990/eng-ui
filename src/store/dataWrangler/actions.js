import { AlertTypes } from 'cortex-look-book';
import { JOB_ORCHESTRATOR_JOBTYPE } from '../../components/WorkPaperProcess/constants/WorkPaperProcess.const';
import dataWranglerService from '../../services/data-wrangler.service';
import AnalyticsUIService from '../../services/analytics-ui.service';
import jobOrchestratorService from '../../services/job-orchestrator.service';
import { WORKPAPER_TYPES } from '../../utils/WorkpaperTypes.const';
import { addGlobalError } from '../errors/actions';
import { processWorkpaperStatus } from '../workpaperProcess/step2/actions';
import { getAndSyncFlowOutputsDmts } from '../workpaperProcess/step3/actions';
import { DataWranglerActionTypes } from './actionTypes';
import { getTranslation } from '../../hooks/useTranslation';
import { DUPLICATE_RECIPES_ERROR } from '../../constants/exceptionErrors.const';

export function addDataSetToFlow(trifactaFlowId, path, inputId, name) {
  return async dispatch => {
    try {
      dispatch({ type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW });
      const result = await dataWranglerService.addDatasetToFlow(trifactaFlowId, path, inputId, name);
      dispatch({ type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updateDatasetFilePath(datasetId, path) {
  return async dispatch => {
    try {
      dispatch({ type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH });
      const result = await dataWranglerService.updateDatasetFilePath(datasetId, path);
      dispatch({ type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function importFlow(workpaperId, flowId, file) {
  return async dispatch => {
    try {
      await dataWranglerService.importFlow(workpaperId, flowId, file);
    } catch (err) {
      dispatch(addGlobalError(err));
    }
  };
}
export function getFlowIsModified(workpaperId, trifactaFlowId) {
  return async dispatch => {
    try {
      dispatch({ type: DataWranglerActionTypes.GET_FLOW_MODIFIED, payload: { workpaperId } });
      const result = await dataWranglerService.flowIsModified(trifactaFlowId);
      dispatch({
        type: DataWranglerActionTypes.GET_FLOW_MODIFIED_SUCCESS,
        payload: { isFlowModified: result, workpaperId },
      });

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.GET_FLOW_MODIFIED_ERROR, payload: { workpaperId } });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function isUserPartOfTrifactaGroup(engagementid) {
  return async dispatch => {
    try {
      const result = await dataWranglerService.isUserPartOfTrifactaGroup(engagementid);
      localStorage.setItem('isUserPartOfTrifactaGroup', result);
    } catch (err) {
      dispatch(addGlobalError(err));
    }
  };
}

export function getFlowDetails(workpaperId, flowId) {
  return async dispatch => {
    try {
      dispatch({ type: DataWranglerActionTypes.GET_FLOW_DETAILS, payload: { workpaperId } });
      const result = await dataWranglerService.getFlowDetails(flowId);
      dispatch({
        type: DataWranglerActionTypes.GET_FLOW_DETAILS_SUCCESS,
        payload: { flowDetails: result, workpaperId },
      });

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.GET_FLOW_DETAILS_ERROR, payload: { workpaperId } });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function runSpecificDataFlows(flowId, outputsNames, engagementId, workpaperId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: DataWranglerActionTypes.RUN_SPECIFIC_DATA_FLOWS, payload: { workpaperId } });
      await AnalyticsUIService.resetOutputsDataLakePaths(workpaperId);
      dispatch(getAndSyncFlowOutputsDmts(workpaperId));
      const result = await jobOrchestratorService.runDataWrangleOutputs(
        engagementId,
        flowId,
        JOB_ORCHESTRATOR_JOBTYPE.DATA_WRANGLER,
        outputsNames
      );
      dispatch({
        type: DataWranglerActionTypes.RUN_SPECIFIC_DATA_FLOWS_SUCCESS,
        payload: { workpaperId },
      });
      dispatch(processWorkpaperStatus(workpaperId, true, WORKPAPER_TYPES.TRIFACTA, flowId));

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.RUN_SPECIFIC_DATA_FLOWS_ERROR, payload: { workpaperId } });

      if (!err.length && err.message.includes(DUPLICATE_RECIPES_ERROR)) {
        const content = getState().settings.get('content');
        const { t } = getTranslation(content);

        dispatch(
          addGlobalError({
            type: AlertTypes.ERROR,
            message: `${t('Pages_TrifactaWorkpaperProcess_Step2_Duplicated_Recipes_Error')}\n\n${err.message}`,
          })
        );
      } else {
        dispatch(addGlobalError(err));
      }

      return false;
    }
  };
}

export function validateFlowRecipes(workpaperId, flowId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES, payload: { workpaperId } });
      const result = await dataWranglerService.validateFlowRecipes(flowId);
      dispatch({
        type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_SUCCESS,
        payload: { workpaperId },
      });

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_ERROR, payload: { workpaperId } });
      dispatch(errorAction(err, { workpaperId }));

      return false;
    }
  };
}

export function getEditRecipesHistory(flowId, startdate, enddate, timezone, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: DataWranglerActionTypes.GET_EDIT_RECIPES_HISTORY });
      const result = await dataWranglerService.getEditRecipesHistory(flowId, startdate, enddate, timezone);
      dispatch({
        type: DataWranglerActionTypes.GET_EDIT_RECIPES_HISTORY_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch({ type: DataWranglerActionTypes.GET_EDIT_RECIPES_HISTORY_ERROR });
      dispatch(errorAction(err));

      return false;
    }
  };
}
