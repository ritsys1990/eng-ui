import { Map as ImmutableMap } from 'immutable';
import { WPProcessActionTypes } from './actionTypes';
import { WP_STATE_STATUS, WP_REVIEW_STATUS } from '../../components/WorkPaperProcess/constants/WorkPaperProcess.const';
import { EngagementCloseoutStatus } from '../../pages/Engagement/constants/constants';

export const initialState = ImmutableMap({
  workpaper: null,
  isFetchingWorkpaper: false,
  isLoading: true,
  template: null,
  wpStatus: null,
  buttonLoading: false,
  readOnlyfromWP: false,
  isCentralizedDSUpdated: false,
  latestTemplate: null,
  dmts: [],
  isFetchingDMTs: false,
  isChildWorkpapersStatusCompleted: false,
  isCloningBundle: ImmutableMap({}),
  isOutputDownloading: false,
  isDownloadingAllOutputs: false,
});

export default function reduce(state = initialState, action = {}) {
  let inputIsCloning;
  const isCentralizedDSUpdatedFlag =
    (action?.payload?.details?.status === WP_STATE_STATUS.DRAFT ||
      action?.payload?.details?.status === WP_STATE_STATUS.READY_FOR_REVIEW) &&
    action?.payload?.details?.centralizedDSUpdate;
  switch (action.type) {
    case WPProcessActionTypes.GET_DATA:
      return state.merge({
        isLoading: true,
      });

    case WPProcessActionTypes.GET_DATA_SUCCESS:
      return state.merge({
        isLoading: false,
        workpaper: action.payload.details,
        template: action.payload.template,
        wpStatus: action.payload.wpStatus,
        isCentralizedDSUpdated: isCentralizedDSUpdatedFlag,
        latestTemplate: action.payload.latestTemplate,
        readOnlyfromWP:
          action.payload.details?.status === WP_STATE_STATUS.PUBLISHED ||
          action.payload.details?.status === WP_STATE_STATUS.DEACTIVATE ||
          action.payload.details?.reviewStatus === WP_REVIEW_STATUS.COMPLETED ||
          isCentralizedDSUpdatedFlag ||
          [EngagementCloseoutStatus.APPROVED, EngagementCloseoutStatus.PENDING_APPROVAL].includes(
            action.payload.checkEngagementCloseout
          ),
      });

    case WPProcessActionTypes.GET_DATA_ERROR:
      return state.merge({
        isLoading: false,
        data: null,
      });

    case WPProcessActionTypes.GET_WORKPAPER:
      return state.merge({
        isFetchingWorkpaper: true,
      });

    case WPProcessActionTypes.GET_WORKPAPER_SUCCESS:
      return state.merge({
        isFetchingWorkpaper: false,
        workpaper: action.payload.details,
        isCentralizedDSUpdated: isCentralizedDSUpdatedFlag,
        readOnlyfromWP:
          action.payload.details?.status === WP_STATE_STATUS.PUBLISHED ||
          action.payload.details?.status === WP_STATE_STATUS.DEACTIVATE ||
          isCentralizedDSUpdatedFlag ||
          action.payload.details?.reviewStatus === WP_REVIEW_STATUS.COMPLETED,
      });

    case WPProcessActionTypes.GET_WORKPAPER_ERROR:
      return state.merge({
        isFetchingWorkpaper: false,
        data: null,
      });

    case WPProcessActionTypes.RESET:
      return state.merge({
        data: null,
        isLoading: true,
      });

    case WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER:
      return state.merge({
        buttonLoading: true,
      });

    case WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER_ERROR:
    case WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER_SUCCESS:
      return state.merge({
        buttonLoading: false,
      });

    case WPProcessActionTypes.GET_WORKPAPER_DMTS:
      return state.merge({
        isFetchingDMTs: true,
      });

    case WPProcessActionTypes.GET_WORKPAPER_DMTS_SUCCESS:
      return state.merge({
        dmts: action.payload,
        isFetchingDMTs: false,
      });

    case WPProcessActionTypes.GET_WORKPAPER_DMTS_ERROR:
      return state.merge({
        isFetchingDMTs: false,
      });

    case WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST:
    case WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR:
      return state.merge({
        isChildWorkpapersStatusCompleted: false,
      });

    case WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS:
      return state.merge({
        isChildWorkpapersStatusCompleted: action.payload,
      });

    case WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_REQUEST:
      inputIsCloning = {};
      inputIsCloning[action.payload.inputId] = true;

      return state.merge({
        isCloningBundle: state.get('isCloningBundle').merge(inputIsCloning),
      });

    case WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_SUCCESS:
    case WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_ERROR:
      inputIsCloning = {};
      inputIsCloning[action.payload.inputId] = false;

      return state.merge({
        isCloningBundle: state.get('isCloningBundle').merge(inputIsCloning),
      });

    case WPProcessActionTypes.RESET_DMTS:
      return state.merge({
        dmts: [],
      });

    case WPProcessActionTypes.DOWNLOAD_OUTPUT:
      return state.merge({
        isOutputDownloading: true,
      });
    case WPProcessActionTypes.DOWNLOAD_OUTPUT_SUCCESS:
    case WPProcessActionTypes.DOWNLOAD_OUTPUT_ERROR:
      return state.merge({
        isOutputDownloading: false,
      });

    case WPProcessActionTypes.DOWNLOAD_ALL_OUTPUTS:
      return state.merge({
        isDownloadingAllOutputs: true,
      });

    case WPProcessActionTypes.DOWNLOAD_ALL_OUTPUTS_SUCCESS:
    case WPProcessActionTypes.DOWNLOAD_ALL_OUTPUTS_ERROR:
      return state.merge({
        isDownloadingAllOutputs: false,
      });
    default:
      return state;
  }
}
