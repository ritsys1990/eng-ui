const signalRMessage = state => state.signalR.get('signalRMessage');
const signalRConnections = state => state.signalR.get('signalRConnections');

export const signalRSelector = {
  signalRMessage,
  signalRConnections,
};
