import { WPProcessStep2ActionTypes } from './actionTypes';
import { ProgressBarTypes, AlertTypes } from 'cortex-look-book';
import AnalyticsUIService from '../../../services/analytics-ui.service';
import dataWranglerService from '../../../services/data-wrangler.service';
import stagingService from '../../../services/staging.service';
import pipelineExecutionService from '../../../services/pipelineExecution.service';
import { addWPProcessingErrors, addImportFlowError, addGlobalError } from '../../errors/actions';
import { updateJRConfirmStatus } from '../../../pages/WorkPaperProcess/utils/WorkPaperProcess.utils';
import {
  cleanTrifactaJobStatus,
  checkIfAllJRStepsApproved,
} from '../../../components/WorkPaperProcess/utils/WorkPaperProcess.utils';
import { WORKPAPER_CANVAS_TYPES, WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import FileSaver from 'file-saver';
import { getTranslation } from '../../../hooks/useTranslation';
import jobOrchestratorService from '../../../services/job-orchestrator.service';
import {
  CONTENT_LIBRARY_WP,
  JOB_ORCHESTRATOR_JOBTYPE,
} from '../../../components/WorkPaperProcess/constants/WorkPaperProcess.const';
import { DUPLICATE_RECIPES_ERROR } from '../../../constants/exceptionErrors.const';
import { getAndSyncFlowOutputsDmts } from '../step3/actions';
import workpaperService from '../../../services/workpaper.service';

export function getJRSteps(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.GET_JR_STEPS_DATA, payload: { workpaperId } });

      const data = await AnalyticsUIService.getJrSteps(workpaperId);

      // Consider moving this to Judgement Steps API instead.
      const jrSteps = data.filter(transformation => transformation.judgementSteps.length > 0);
      dispatch({
        type: WPProcessStep2ActionTypes.GET_JR_STEPS_DATA_SUCCESS,
        payload: { jrStepDetails: jrSteps, workpaperId },
      });
    } catch (e) {
      dispatch(addWPProcessingErrors(e, { workpaperId }));
    }
  };
}

export function getTrifactaParams(workpaperId, flowId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.GET_TRIFACTA_PARAMS, payload: { workpaperId } });

      const trifactaParameters = await dataWranglerService.getTrifactaParameters(flowId);

      dispatch({
        type: WPProcessStep2ActionTypes.GET_TRIFACTA_PARAMS_SUCCESS,
        payload: { trifactaParameters, workpaperId },
      });
    } catch (e) {
      dispatch({
        type: WPProcessStep2ActionTypes.GET_TRIFACTA_PARAMS_ERROR,
        payload: { workpaperId },
      });
      dispatch(addWPProcessingErrors(e, { workpaperId }));
    }
  };
}

export function getTrifactaJRSteps(workpaperId, flowId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.GET_TRIFACTA_JR_STEPS, payload: { workpaperId } });

      const trifactaJRSteps = await dataWranglerService.getTrifactaJRSteps(flowId);

      dispatch({
        type: WPProcessStep2ActionTypes.GET_TRIFACTA_JR_STEPS_SUCCESS,
        payload: {
          workpaperId,
          trifactaJRSteps: {
            flowId,
            trifactaJRSteps,
          },
        },
      });
    } catch (e) {
      dispatch({
        type: WPProcessStep2ActionTypes.GET_TRIFACTA_JR_STEPS_ERROR,
        payload: { workpaperId },
      });
      dispatch(addWPProcessingErrors(e, { workpaperId }));
    }
  };
}

export function setTrifactaParam(workpaperId, parameter) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.SET_TRIFACTA_PARAMS, payload: { workpaperId } });

      const paramSetResult = await dataWranglerService.setTrifactaParameter(parameter);
      const content = getState().settings.get('content');
      const { t } = getTranslation(content);

      if (paramSetResult) {
        const trifactaParameters = await dataWranglerService.getTrifactaParameters(parameter?.flowId);

        dispatch({
          type: WPProcessStep2ActionTypes.SET_TRIFACTA_PARAMS_SUCCESS,
          payload: { trifactaParameters, workpaperId },
        });
      } else {
        throw new Error(t('Pages_TrifactaWorkpaperProcess_Step2_ParametersTable_FailedToUpdate'));
      }
    } catch (e) {
      dispatch({
        type: WPProcessStep2ActionTypes.SET_TRIFACTA_PARAMS_ERROR,
        payload: { workpaperId },
      });
      dispatch(addWPProcessingErrors(e, { workpaperId }));
    }
  };
}

export function processWorkpaperStatus(workpaperId, checkUntilRunning = false, workpaperType, trifactaFlowId) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS,
        payload: { workpaperId, isLoading: checkUntilRunning },
      });

      switch (workpaperType) {
        case WORKPAPER_TYPES.TRIFACTA:
          const flowStatus = await jobOrchestratorService.getFlowStatus(trifactaFlowId);

          const cleanedFlowStatus = cleanTrifactaJobStatus(flowStatus);

          dispatch({
            type: WPProcessStep2ActionTypes.PROCESS_TRIFACTAWORKPAPER_STATUS_SUCCESS,
            payload: { progress: cleanedFlowStatus, workpaperId },
          });

          break;
        case WORKPAPER_TYPES.CORTEX:
          const progress = await AnalyticsUIService.getProcessWorkpaperStatus(workpaperId);

          if (checkUntilRunning && progress.status !== ProgressBarTypes.RUNNING) {
            setTimeout(() => dispatch(processWorkpaperStatus(workpaperId, true, WORKPAPER_TYPES.CORTEX)), 3000);
          } else {
            dispatch({
              type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_SUCCESS,
              payload: { progress, workpaperId },
            });
          }
          break;
        default:
          dispatch({ type: WPProcessStep2ActionTypes, payload: { workpaperId } });
          break;
      }

      return true;
    } catch (e) {
      dispatch({ type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_ERROR, payload: { workpaperId } });
      dispatch(addWPProcessingErrors(e, { workpaperId }));

      return false;
    }
  };
}

export function processWorkpaper(workpaperId, workpaperType, trifactaFlowId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER, payload: { workpaperId } });
      const workpaper = getState().wpProcess.general.get('workpaper');
      const workpaperProgress = getState().wpProcess.step2.get('progress');
      const engagementId = workpaper.engagementId ? workpaper.engagementId : CONTENT_LIBRARY_WP.ENGAGEMENT_ID;
      switch (workpaperType) {
        case WORKPAPER_TYPES.TRIFACTA:
          await AnalyticsUIService.resetOutputsDataLakePaths(workpaperId);
          dispatch(getAndSyncFlowOutputsDmts(workpaperId));
          await jobOrchestratorService.runFlow(engagementId, trifactaFlowId, JOB_ORCHESTRATOR_JOBTYPE.DATA_WRANGLER);
          dispatch({
            type: WPProcessStep2ActionTypes.PROCESS_TRIFACTAWORKPAPER_SUCCESS,
            payload: { workpaperId },
          });
          dispatch(processWorkpaperStatus(workpaperId, true, WORKPAPER_TYPES.TRIFACTA, trifactaFlowId));
          break;
        case WORKPAPER_TYPES.CORTEX:
        default:
          await AnalyticsUIService.processWorkpaper(workpaperId, workpaperType);
          /**
           * If Workpaper Progress is waiting, do not reset process workapaper state
           * as that JR StepID is needed to determine if you recieved the most updated
           * status when you poll and if you should continue to poll or stop polling.
           */
          if (workpaperProgress?.status === 'waiting') {
            dispatch({ type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_SUCCESS, payload: { workpaperId } });
          } else {
            dispatch({ type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_SUCCESS, payload: { workpaperId } });
            dispatch({ type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_RESET, payload: { workpaperId } });
          }
          dispatch(processWorkpaperStatus(workpaperId, true, WORKPAPER_TYPES.CORTEX));
          break;
      }

      return true;
    } catch (e) {
      dispatch({ type: WPProcessStep2ActionTypes.PROCESS_WORKPAPER_ERROR, payload: { workpaperId } });
      if (!e.length && e.message.includes(DUPLICATE_RECIPES_ERROR)) {
        const content = getState().settings.get('content');
        const { t } = getTranslation(content);

        dispatch(
          addWPProcessingErrors(
            {
              type: AlertTypes.ERROR,
              message: `${t('Pages_TrifactaWorkpaperProcess_Step2_Duplicated_Recipes_Error')}\n\n${e.message}`,
            },
            { workpaperId }
          )
        );
      } else {
        dispatch(addWPProcessingErrors(e, { workpaperId }));
      }

      return false;
    }
  };
}

export function setTrifactaJRStep(
  workpaperId,
  flowId,
  jrStepInfo,
  isDMT = false,
  isDMTStepShown = false,
  shouldAutoDmt = true,
  isEncrypted = false
) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.SET_TRIFACTA_JR_STEPS, payload: { workpaperId } });
      const trifactaJRSetResult = await dataWranglerService.setTrifactaJRSteps(flowId, jrStepInfo);
      const content = getState().settings.get('content');
      const { t } = getTranslation(content);

      if (trifactaJRSetResult) {
        const trifactaJRSteps = await dataWranglerService.getTrifactaJRSteps(flowId);
        const areAllJRStepsApproved = checkIfAllJRStepsApproved(trifactaJRSteps);
        const workpaper = getState().wpProcess.general.get('workpaper');
        const engagementId = workpaper.engagementId ? workpaper.engagementId : CONTENT_LIBRARY_WP.ENGAGEMENT_ID;
        if (areAllJRStepsApproved && shouldAutoDmt && !isEncrypted) {
          const wpStatus = await pipelineExecutionService.checkWPStatus(engagementId, [workpaperId]);
          if (wpStatus?.length && wpStatus?.[0]?.statusId === 5) {
            const messageBody = {
              engagementId,
              workpaperId,
              targetEventName: 'ReadyToRun',
            };
            await AnalyticsUIService.sendWorkpaperMessage(messageBody);
          } else if (!isDMT && isDMTStepShown) {
            dispatch(processWorkpaper(workpaperId, WORKPAPER_TYPES.TRIFACTA, workpaper?.trifactaFlowId));
          }
        }

        dispatch({
          type: WPProcessStep2ActionTypes.SET_TRIFACTA_JR_STEPS_SUCCESS,
          payload: { workpaperId, trifactaJRSteps: { flowId, trifactaJRSteps } },
        });
      } else {
        throw new Error(t('Pages_TrifactaWorkpaperProcess_Step2_JRSteps_List_FailedToApprove'));
      }
    } catch (e) {
      dispatch({
        type: WPProcessStep2ActionTypes.SET_TRIFACTA_JR_STEPS_ERROR,
        payload: { workpaperId },
      });
      dispatch(addWPProcessingErrors(e, { workpaperId }));
    }
  };
}

export function approveAllJRSteps(workpaperId, jrStepDetails) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.APPROVE_ALL_JR, payload: { workpaperId } });
      const workpaperProgress = getState().wpProcess.step2.get('progress');

      /**
       * Get All JR Step ID's that need to be approved.
       */
      const stepIds = jrStepDetails.reduce((acc, curr) => {
        return acc.concat(curr.judgementSteps.map(jrStep => jrStep.stepId));
      }, []);

      await AnalyticsUIService.approveAllJRSteps(workpaperId, stepIds);
      const data = await AnalyticsUIService.getJrSteps(workpaperId);

      // Consider moving this to Judgement Steps API instead.
      const jrSteps = data.filter(transformation => transformation.judgementSteps.length > 0);

      dispatch({
        type: WPProcessStep2ActionTypes.APPROVE_ALL_JR_SUCCESS,
        payload: { jrStepDetails: jrSteps, workpaperId },
      });

      /**
       * Poll only if current state is waiting state. Or else its either in running,
       */
      if (workpaperProgress.status === ProgressBarTypes.WAITING) {
        dispatch(processWorkpaperStatus(workpaperId, false, WORKPAPER_TYPES.CORTEX));
      }
    } catch (e) {
      dispatch(addWPProcessingErrors(e, { workpaperId }));
    }
  };
}

export function approveJRStep(workpaperId, jrStepDetails, stepId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.APPROVE_JR, payload: { workpaperId } });
      const workpaperProgress = getState().wpProcess.step2.get('progress');
      await AnalyticsUIService.approveJRStep(workpaperId, stepId);
      const updatedJRStepDetails = updateJRConfirmStatus(jrStepDetails, stepId);

      dispatch({
        type: WPProcessStep2ActionTypes.APPROVE_JR_SUCCESS,
        payload: { jrStepDetails: updatedJRStepDetails, workpaperId },
      });

      /**
       * If Someone approves a step, and that step is the one batching is waiting for, then start polling. else,
       * do not poll as batching is still going to be waiting.
       */
      if (workpaperProgress.status === ProgressBarTypes.WAITING && workpaperProgress.waitingJRStepId === stepId) {
        dispatch(processWorkpaperStatus(workpaperId, false, WORKPAPER_TYPES.CORTEX));
      }

      return updatedJRStepDetails;
    } catch (e) {
      dispatch(addWPProcessingErrors(e, { workpaperId }));

      return false;
    }
  };
}

export function exportTrifactaDataFlow(flowId, wpName) {
  return async dispatch => {
    try {
      let fileName = '';
      dispatch({ type: WPProcessStep2ActionTypes.EXPORT_DATA_FLOW });
      const data = await dataWranglerService.exportDataFlow(flowId);
      if (data) {
        data.blob().then(resp => {
          fileName = `${wpName}_${flowId}.zip`;
          FileSaver.saveAs(resp, fileName);
        });
      }
      dispatch({ type: WPProcessStep2ActionTypes.EXPORT_DATA_FLOW_SUCCESS });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WPProcessStep2ActionTypes.EXPORT_DATA_FLOW_ERROR });

      return false;
    }
  };
}

export function importFlow(workpaperId, flowId, file, canvasType) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW });
      await AnalyticsUIService.updateWorkpaperSetupStatus(workpaperId, 'pending');
      dispatch({
        type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING,
      });
      const bundleTransformation =
        canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS ||
        canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS;
      const result = await dataWranglerService.importFlow(workpaperId, flowId, file, bundleTransformation);
      dispatch({
        type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch(addImportFlowError(err));
      dispatch({
        type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_ERROR,
        payload: err,
      });
      dispatch({
        type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING_RESET,
      });

      return null;
    }
  };
}

export function getWorkpaperSetup(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.GET_WORKPAPER_SETUP });
      const workpaper = await AnalyticsUIService.getWorkpaperSetup(workpaperId);
      dispatch({ type: WPProcessStep2ActionTypes.GET_WORKPAPER_SETUP_SUCCESS, payload: workpaper });
      if (workpaper?.importStatus !== 'pending') {
        dispatch({
          type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING_RESET,
        });
      }

      return workpaper;
    } catch (e) {
      dispatch(addImportFlowError(e));
      dispatch({
        type: WPProcessStep2ActionTypes.GET_WORKPAPER_SETUP_ERROR,
        payload: e,
      });
      dispatch({
        type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING_RESET,
      });

      return false;
    }
  };
}

export function getDMVStatus(workpaperId, inputs) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.GET_WP_DMV_STATUS, payload: { workpaperId } });
      let isDMVIncomplete = false;
      for (let i = 0; i < inputs.length; ++i) {
        if (inputs[i].clonedDataModelId && inputs[i].nodeId) {
          const nodeInfo = await stagingService.getNodeInfo(inputs[i].nodeId);
          if (nodeInfo?.dataWorkBenchValidation?.length > 0 && nodeInfo.dataWorkBenchValidation[0].status !== 1) {
            isDMVIncomplete = true;
          }
        }
      }
      dispatch({ type: WPProcessStep2ActionTypes.GET_WP_DMV_STATUS_SUCCESS, payload: { workpaperId } });

      return isDMVIncomplete;
    } catch (err) {
      dispatch({ type: WPProcessStep2ActionTypes.GET_WP_DMV_STATUS_ERROR, payload: { workpaperId } });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function setIsDMTStepComplete(dmts, progress) {
  return async dispatch => {
    let isDMTStepCompleted = dmts.length !== 0;

    for (let i = 0; i < dmts.length; i++) {
      const dmt = dmts[i];
      const dmtProgress = progress.get(dmt.id);

      if (!dmtProgress) {
        isDMTStepCompleted = false;
        break;
      }

      if (dmtProgress.status !== ProgressBarTypes.FINISHED) {
        isDMTStepCompleted = false;
        break;
      }
    }

    dispatch({ type: WPProcessStep2ActionTypes.SET_IS_DMT_STEP_COMPLETED, payload: isDMTStepCompleted });
  };
}

export function setIsDMTStepPartiallyComplete(dmts, progress) {
  return async dispatch => {
    let isDMTStepCompleted = false;

    for (let i = 0; i < dmts.length; i++) {
      const dmt = dmts[i];
      const dmtProgress = progress.get(dmt.id);

      if (dmtProgress && dmtProgress.status === ProgressBarTypes.FINISHED) {
        isDMTStepCompleted = true;
        break;
      }
    }

    dispatch({ type: WPProcessStep2ActionTypes.SET_IS_DMT_STEP_PARTIALLY_COMPLETED, payload: isDMTStepCompleted });
  };
}

export function setIsDMTStepShown(inputs, canvasType) {
  return async dispatch => {
    const isDMTStepShown =
      inputs?.some(input => input?.dataRequestInfo?.length > 0) &&
      canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD;

    dispatch({ type: WPProcessStep2ActionTypes.SET_IS_DMT_STEP_SHOWN, payload: isDMTStepShown });
  };
}

export function resetDMTStep() {
  return async dispatch => {
    dispatch({ type: WPProcessStep2ActionTypes.RESET_DMT_STEP });
  };
}

export function autoRunWorkpaper(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_REQUEST });

      const result = await AnalyticsUIService.autoRunWorkpaper(workpaperId);

      dispatch(getAndSyncFlowOutputsDmts(workpaperId));

      dispatch({
        type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_SUCCESS,
        payload: workpaperId,
      });

      return result;
    } catch (err) {
      dispatch({ type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_ERROR, payload: { workpaperId } });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function isDecryptionNeeded(workpaper) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER,
        payload: { workpaperId: workpaper.id },
      });
      const result = await workpaperService.getDetails(workpaper.id, false);
      dispatch({
        type: WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER_SUCCESS,
        payload: { workpaperId: workpaper.id },
      });
      if (result.decryptionStatus?.toLowerCase() === 'success') {
        return false;
      }

      return result.decryptionStatus ? result.decryptionStatus.toLowerCase() : 'notStarted';
    } catch (err) {
      dispatch({
        type: WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER_ERROR,
        payload: { workpaperId: workpaper.id, err },
      });
      dispatch(addGlobalError(err));

      return err;
    }
  };
}

export function triggerWorkpaperDecryption(workpaper) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER,
        payload: { workpaperId: workpaper.id },
      });
      const response = await stagingService.triggerWorkpaperDecryption(
        workpaper?.id,
        workpaper?.trifactaFlowId,
        workpaper?.engagementId
      );
      dispatch({
        type: WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER_SUCCESS,
        payload: { workpaperId: workpaper.id },
      });

      return response;
    } catch (err) {
      dispatch({
        type: WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER_ERROR,
        payload: { workpaperId: workpaper.id, err },
      });
      dispatch(addGlobalError(err));

      return err;
    }
  };
}
