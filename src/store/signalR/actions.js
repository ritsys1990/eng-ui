import { SignalRActionTypes } from './actionTypes';
import { addGlobalError } from '../errors/actions';

export const setSignalRMessage = message => {
  return async dispatch => {
    try {
      return dispatch({ type: SignalRActionTypes.SET_SIGNALR_MESSAGE, payload: message });
    } catch (err) {
      return dispatch(addGlobalError(err));
    }
  };
};

export const setSignalRConnections = connections => {
  return async dispatch => {
    try {
      return dispatch({ type: SignalRActionTypes.SET_SIGNALR_CONNECTIONS, payload: connections });
    } catch (err) {
      return dispatch(addGlobalError(err));
    }
  };
};
