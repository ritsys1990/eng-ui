import { Map as ImmutableMap } from 'immutable';
import { DataExchangeActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  isLinkingEngagementToOmnia: false,
  omniaLinkResponse: null,
  isSendingWPOutputToOmnia: false,
  isFetchingWPOutputStatus: false,
  sendWPOutputStatus: null,
  sendToOmniaOutputHistory: [],
  isFetchingSendToOmniaOutputHistory: false,
  linkedOmniaEngagements: [],
  unlinkedOmniaEngagement: [],
  isSendToOmniaOutputHistoryNeededRefresh: true,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT:
      return state.merge({
        isLinkingEngagementToOmnia: true,
      });

    case DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_SUCCESS:
      return state.merge({
        isLinkingEngagementToOmnia: false,
        omniaLinkResponse: action.payload,
      });

    case DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_ERROR:
      return state.merge({
        isLinkingEngagementToOmnia: false,
      });

    case DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST:
      return state.merge({
        isSendingWPOutputToOmnia: true,
      });

    case DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_SUCCESS:
      return state.merge({
        isSendingWPOutputToOmnia: false,
        sendWPOutputStatus: action.payload,
        isSendToOmniaOutputHistoryNeededRefresh: true,
      });

    case DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_ERROR:
      return state.merge({
        isSendingWPOutputToOmnia: false,
        isSendToOmniaOutputHistoryNeededRefresh: true,
      });

    case DataExchangeActionTypes.FILE_SHARING_REQUEST_SATUS:
      return state.merge({
        isFetchingWPOutputStatus: true,
      });

    case DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_SUCCESS:
      return state.merge({
        isFetchingWPOutputStatus: false,
        sendWPOutputStatus: action.payload,
      });

    case DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_ERROR:
      return state.merge({
        isFetchingWPOutputStatus: false,
      });
    case DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_REQUEST:
      return state.merge({
        isFetchingSendToOmniaOutputHistory: true,
      });

    case DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_SUCCESS:
      return state.merge({
        isFetchingSendToOmniaOutputHistory: false,
        sendToOmniaOutputHistory: action.payload,
        isSendToOmniaOutputHistoryNeededRefresh: false,
      });

    case DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_ERROR:
      return state.merge({
        isFetchingSendToOmniaOutputHistory: false,
      });

    case DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_STATUS:
      return state.merge({
        isFetchingLinkedOmniaEngagements: true,
      });

    case DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_SUCCESS:
      return state.merge({
        isFetchingLinkedOmniaEngagements: false,
        linkedOmniaEngagements: action.payload,
      });

    case DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_ERROR:
      return state.merge({
        isFetchingLinkedOmniaEngagements: false,
      });

    case DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_STATUS:
      return state.merge({
        isUnlinkedOmniaEngagement: true,
      });

    case DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_SUCCESS:
    case DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_ERROR:
      return state.merge({
        isUnlinkedOmniaEngagement: false,
      });

    default:
      return state;
  }
}
