import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep2ActionTypes } from './actionTypes';
import { FLOW_IMPORT_STATUS } from '../../../components/WorkPaperProcess/constants/WorkPaperProcess.const';

export const initialState = ImmutableMap({
  template: null,
  isLoading: ImmutableMap({}),
  complete: true,
  jrStepDetails: ImmutableMap({}),
  isFetchingStatus: ImmutableMap({}),
  importProgress: null,
  progress: ImmutableMap({}),
  flowButtonLoading: false,
  trifactaParameters: ImmutableMap({}),
  trifactaJRSteps: ImmutableMap({}),
  fetchingTrifactaJRSteps: ImmutableMap({}),
  fetchingTrifactaParams: ImmutableMap({}),
  importFlowInitiatePolling: false,
  isDMTStepComplete: false,
  isDMTStepPartiallyComplete: false,
  isDMTStepShown: false,
  isFetchingAutoRun: false,
  workpaperStatus: null,
  didFinishAutoRun: false,
});

export default function reduce(state = initialState, action = {}) {
  let workpaperProgress;
  let workpaperIsFetchingStatus;
  let workpaperIsFetchingTrifactaJRSteps;
  let workpaperIsFetchingTrifactaParams;
  let workpaperTrifactaJrSteps;
  let workpaperIsLoading;
  let workpaperJRStepDetails;
  let workpaperTrifactaParameters;

  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case WPProcessStep2ActionTypes.GET_JR_STEPS_DATA:
    case WPProcessStep2ActionTypes.APPROVE_JR:
    case WPProcessStep2ActionTypes.APPROVE_ALL_JR:
    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER:
    case WPProcessStep2ActionTypes.GET_WP_DMV_STATUS:
      workpaperIsLoading = {};
      workpaperIsLoading[action.payload.workpaperId] = true;

      return state.merge({
        isLoading: state.get('isLoading').merge(workpaperIsLoading),
      });

    case WPProcessStep2ActionTypes.GET_JR_STEPS_DATA_SUCCESS:
    case WPProcessStep2ActionTypes.APPROVE_JR_SUCCESS:
    case WPProcessStep2ActionTypes.APPROVE_ALL_JR_SUCCESS:
      workpaperIsLoading = {};
      workpaperIsLoading[action.payload.workpaperId] = false;
      workpaperJRStepDetails = {};
      workpaperJRStepDetails[action.payload.workpaperId] = action.payload.jrStepDetails;

      return state.merge({
        isLoading: state.get('isLoading').merge(workpaperIsLoading),
        jrStepDetails: state.get('jrStepDetails').merge(workpaperJRStepDetails),
      });

    case WPProcessStep2ActionTypes.GET_JR_STEPS_DATA_ERROR:
      workpaperIsLoading = {};
      workpaperIsLoading[action.payload.workpaperId] = false;
      workpaperJRStepDetails = {};
      workpaperJRStepDetails[action.payload.workpaperId] = null;

      return state.merge({
        isLoading: state.get('isLoading').merge(workpaperIsLoading),
        jrStepDetails: state.get('jrStepDetails').merge(workpaperJRStepDetails),
      });

    case WPProcessStep2ActionTypes.APPROVE_JR_ERROR:
    case WPProcessStep2ActionTypes.APPROVE_ALL_JR_ERROR:
    case WPProcessStep2ActionTypes.GET_WP_DMV_STATUS_SUCCESS:
    case WPProcessStep2ActionTypes.GET_WP_DMV_STATUS_ERROR:
    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_SUCCESS:
      workpaperIsLoading = {};
      workpaperIsLoading[action.payload.workpaperId] = false;

      return state.merge({
        isLoading: state.get('isLoading').merge(workpaperIsLoading),
      });

    case WPProcessStep2ActionTypes.PROCESS_TRIFACTAWORKPAPER_SUCCESS:
    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_ERROR:
      workpaperIsFetchingStatus = {};
      workpaperIsFetchingStatus[action.payload.workpaperId] = false;
      workpaperIsLoading = {};
      workpaperIsLoading[action.payload.workpaperId] = false;

      return state.merge({
        isLoading: state.get('isLoading').merge(workpaperIsLoading),
        isFetchingStatus: state.get('isFetchingStatus').merge(workpaperIsFetchingStatus),
      });

    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS:
      workpaperIsFetchingStatus = {};
      workpaperIsFetchingStatus[action.payload.workpaperId] = true;
      workpaperIsLoading = {};
      workpaperIsLoading[action.payload.workpaperId] = action.payload.isLoading;

      return state.merge({
        isFetchingStatus: state.get('isFetchingStatus').merge(workpaperIsFetchingStatus),
        isLoading: state.get('isLoading').merge(workpaperIsLoading),
      });

    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_SUCCESS:
      workpaperProgress = {};
      workpaperProgress[action.payload.workpaperId] = action.payload.progress;
      workpaperIsFetchingStatus = {};
      workpaperIsFetchingStatus[action.payload.workpaperId] = false;

      return state.merge({
        progress: state.get('progress').merge(workpaperProgress),
        isFetchingStatus: state.get('isFetchingStatus').merge(workpaperIsFetchingStatus),
      });

    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_SUCCESS_NO_TYPE:
    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_ERROR:
      workpaperIsFetchingStatus = {};
      workpaperIsFetchingStatus[action.payload.workpaperId] = false;

      return state.merge({
        isFetchingStatus: state.get('isFetchingStatus').merge(workpaperIsFetchingStatus),
      });

    case WPProcessStep2ActionTypes.PROCESS_TRIFACTAWORKPAPER_STATUS_SUCCESS:
      workpaperProgress = {};
      workpaperProgress[action.payload.workpaperId] = action.payload.progress;
      workpaperIsFetchingStatus = {};
      workpaperIsFetchingStatus[action.payload.workpaperId] = false;

      return state.merge({
        isFetchingStatus: state.get('isFetchingStatus').merge(workpaperIsFetchingStatus),
        progress: state.get('progress').merge(workpaperProgress),
      });

    case WPProcessStep2ActionTypes.PROCESS_WORKPAPER_STATUS_RESET:
      workpaperProgress = {};
      workpaperProgress[action.payload.workpaperId] = {
        batchMode: true,
        status: 'running',
        progress: { totalSteps: 0, completedSteps: 0 },
        waitingJRStepId: '',
      };

      return state.merge({
        progress: state.get('progress').merge(workpaperProgress),
      });

    case WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW:
    case WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_SUCCESS:
      return state.merge({
        importProgress: FLOW_IMPORT_STATUS.PENDING,
      });

    case WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING:
      return state.merge({
        importFlowInitiatePolling: true,
      });

    case WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING_RESET:
      return state.merge({
        importFlowInitiatePolling: false,
      });

    case WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_ERROR:
      return state.merge({
        importProgress: FLOW_IMPORT_STATUS.ERROR,
      });
    case WPProcessStep2ActionTypes.GET_WORKPAPER_SETUP_SUCCESS:
      return state.merge({
        importProgress: action.payload.importStatus,
      });

    case WPProcessStep2ActionTypes.EXPORT_DATA_FLOW:
      return state.merge({
        flowButtonLoading: true,
      });

    case WPProcessStep2ActionTypes.EXPORT_DATA_FLOW_ERROR:
    case WPProcessStep2ActionTypes.EXPORT_DATA_FLOW_SUCCESS:
      return state.merge({
        flowButtonLoading: false,
      });

    case WPProcessStep2ActionTypes.GET_TRIFACTA_PARAMS:
    case WPProcessStep2ActionTypes.SET_TRIFACTA_PARAMS:
      workpaperIsFetchingTrifactaParams = {};
      workpaperIsFetchingTrifactaParams[action.payload.workpaperId] = true;

      return state.merge({
        fetchingTrifactaParams: state.get('fetchingTrifactaParams').merge(workpaperIsFetchingTrifactaParams),
      });

    case WPProcessStep2ActionTypes.GET_TRIFACTA_PARAMS_SUCCESS:
    case WPProcessStep2ActionTypes.SET_TRIFACTA_PARAMS_SUCCESS:
      workpaperTrifactaParameters = {};
      workpaperTrifactaParameters[action.payload.workpaperId] = action.payload.trifactaParameters;
      workpaperIsFetchingTrifactaParams = {};
      workpaperIsFetchingTrifactaParams[action.payload.workpaperId] = false;

      return state.merge({
        fetchingTrifactaParams: state.get('fetchingTrifactaParams').merge(workpaperIsFetchingTrifactaParams),
        trifactaParameters: state.get('trifactaParameters').merge(workpaperTrifactaParameters),
      });

    case WPProcessStep2ActionTypes.GET_TRIFACTA_PARAMS_ERROR:
    case WPProcessStep2ActionTypes.SET_TRIFACTA_PARAMS_ERROR:
      workpaperIsFetchingTrifactaParams = {};
      workpaperIsFetchingTrifactaParams[action.payload.workpaperId] = false;

      return state.merge({
        fetchingTrifactaParams: state.get('fetchingTrifactaParams').merge(workpaperIsFetchingTrifactaParams),
      });

    case WPProcessStep2ActionTypes.GET_TRIFACTA_JR_STEPS:
    case WPProcessStep2ActionTypes.SET_TRIFACTA_JR_STEPS:
      workpaperIsFetchingTrifactaJRSteps = {};
      workpaperIsFetchingTrifactaJRSteps[action.payload.workpaperId] = true;

      return state.merge({
        fetchingTrifactaJRSteps: state.get('fetchingTrifactaJRSteps').merge(workpaperIsFetchingTrifactaJRSteps),
      });

    case WPProcessStep2ActionTypes.GET_TRIFACTA_JR_STEPS_SUCCESS:
    case WPProcessStep2ActionTypes.SET_TRIFACTA_JR_STEPS_SUCCESS:
      workpaperTrifactaJrSteps = {};
      workpaperTrifactaJrSteps[action.payload.workpaperId] = action.payload.trifactaJRSteps;
      workpaperIsFetchingTrifactaJRSteps = {};
      workpaperIsFetchingTrifactaJRSteps[action.payload.workpaperId] = false;

      return state.merge({
        fetchingTrifactaJRSteps: state.get('fetchingTrifactaJRSteps').merge(workpaperIsFetchingTrifactaJRSteps),
        trifactaJRSteps: state.get('trifactaJRSteps').merge(workpaperTrifactaJrSteps),
      });

    case WPProcessStep2ActionTypes.GET_TRIFACTA_JR_STEPS_ERROR:
    case WPProcessStep2ActionTypes.SET_TRIFACTA_JR_STEPS_ERROR:
      workpaperIsFetchingTrifactaJRSteps = {};
      workpaperIsFetchingTrifactaJRSteps[action.payload.workpaperId] = false;

      return state.merge({
        fetchingTrifactaJRSteps: state.get('fetchingTrifactaJRSteps').merge(workpaperIsFetchingTrifactaJRSteps),
      });

    case WPProcessStep2ActionTypes.SET_IS_DMT_STEP_COMPLETED:
      return state.merge({
        isDMTStepComplete: action.payload,
      });

    case WPProcessStep2ActionTypes.SET_IS_DMT_STEP_PARTIALLY_COMPLETED:
      return state.merge({
        isDMTStepPartiallyComplete: action.payload,
      });

    case WPProcessStep2ActionTypes.SET_IS_DMT_STEP_SHOWN:
      return state.merge({
        isDMTStepShown: action.payload,
      });

    case WPProcessStep2ActionTypes.RESET_DMT_STEP:
      return state.merge({
        isDMTStepComplete: false,
        isDMTStepShown: false,
        isDMTStepPartiallyComplete: false,
      });

    case WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_REQUEST:
      return state.merge({
        isFetchingAutoRun: true,
        didFinishAutoRun: false,
      });

    case WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_SUCCESS:
      return state.merge({
        workpaperStatus: action.payload,
        isFetchingAutoRun: false,
        didFinishAutoRun: true,
      });

    case WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_ERROR:
      return state.merge({
        isFetchingAutoRun: false,
        didFinishAutoRun: false,
      });

    case WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER:
      return state.merge({
        isLoading: state.get('isLoading').merge({ [action.payload.workpaperId]: true }),
      });

    case WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER_SUCCESS:
    case WPProcessStep2ActionTypes.VALIDATE_DECRYPTION_FOR_WORKPAPER_ERROR:
      return state.merge({
        isLoading: state.get('isLoading').merge({ [action.payload.workpaperId]: false }),
      });
    default:
      return state;
  }
}
