const omniaLinkResponse = state => state.dataExchange.get('omniaLinkResponse');
const isLinkingEngagementToOmnia = state => state.dataExchange.get('isLinkingEngagementToOmnia');
const sendWPOutputStatus = state => state.dataExchange.get('sendWPOutputStatus');
const isSendingWPOutputToOmnia = state => state.dataExchange.get('isSendingWPOutputToOmnia');
const isFetchingWPOutputStatus = state => state.dataExchange.get('isFetchingWPOutputStatus');
const isFetchingSendToOmniaOutputHistory = state => state.dataExchange.get('isFetchingSendToOmniaOutputHistory');
const sendToOmniaOutputHistory = state => state.dataExchange.get('sendToOmniaOutputHistory');
const isSendToOmniaOutputHistoryNeededRefresh = state =>
  state.dataExchange.get('isSendToOmniaOutputHistoryNeededRefresh');
const isFetchingLinkedOmniaEngagements = state => state.dataExchange.get('isFetchingLinkedOmniaEngagements');
const linkedOmniaEngagements = state => state.dataExchange.get('linkedOmniaEngagements');
const isUnlinkedOmniaEngagement = state => state.dataExchange.get('isUnlinkedOmniaEngagement');

export const dataExchangeSelectors = {
  omniaLinkResponse,
  isLinkingEngagementToOmnia,
  sendWPOutputStatus,
  isSendingWPOutputToOmnia,
  isFetchingWPOutputStatus,
  isFetchingSendToOmniaOutputHistory,
  sendToOmniaOutputHistory,
  isSendToOmniaOutputHistoryNeededRefresh,
  linkedOmniaEngagements,
  isFetchingLinkedOmniaEngagements,
  isUnlinkedOmniaEngagement,
};
