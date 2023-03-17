import { Map as ImmutableMap } from 'immutable';
import { SignalRActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  signalRMessage: '',
  signalRConnections: [],
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case SignalRActionTypes.SET_SIGNALR_MESSAGE:
      return state.merge({
        signalRMessage: action.payload,
      });

    case SignalRActionTypes.SET_SIGNALR_CONNECTIONS:
      return state.merge({
        signalRConnections: action.payload,
      });

    default:
      return state;
  }
}
