import dataExchangeService from '../../services/data-exchange.service';
import AnalyticsUIService from '../../services/analytics-ui.service';
import { addGlobalError } from '../errors/actions';
import { DataExchangeActionTypes } from './actionTypes';
import { WPProcessStep3ActionTypes } from '../workpaperProcess/step3/actionTypes';

export function linkOmniaEngagement(token) {
  return async dispatch => {
    try {
      dispatch({ type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT });
      const result = await dataExchangeService.linkOmniaEngagement(token);
      dispatch({ type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function submitFileSharingRequest(data, workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST });
      const result = await dataExchangeService.submitFileSharingRequest(data);
      const { outputId, omniaEngagementFileId } = result;
      dispatch({
        type: WPProcessStep3ActionTypes.UPDATE_OUTPUTS,
        payload: { outputId, omniaEngagementFileId, workpaperId },
      });
      dispatch({ type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_SUCCESS, payload: result });
      await AnalyticsUIService.addOmniaEngagementFileId(outputId, omniaEngagementFileId);

      return result;
    } catch (err) {
      dispatch({ type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function checkFileSharingRequestStatusById(omniaEngagementFileId) {
  return async dispatch => {
    try {
      dispatch({ type: DataExchangeActionTypes.FILE_SHARING_REQUEST_SATUS });
      const result = await dataExchangeService.checkFileSharingRequestStatusById(omniaEngagementFileId);
      dispatch({ type: DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getSendToOmniaOutputHistory(outputId) {
  return async dispatch => {
    try {
      dispatch({ type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_REQUEST });
      const result = await dataExchangeService.getSendToOmniaOutputHistory(outputId);
      dispatch({ type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getBriefLinkedOmniaEngagements(cortexEngagementId) {
  return async dispatch => {
    try {
      dispatch({ type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_STATUS });
      const result = await dataExchangeService.getBriefLinkedOmniaEngagements(cortexEngagementId);
      dispatch({ type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function unlinkOmniaEngagement(data) {
  return async dispatch => {
    try {
      dispatch({ type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_STATUS });
      const result = await dataExchangeService.unlinkOmniaEngagement(data);
      dispatch({ type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
