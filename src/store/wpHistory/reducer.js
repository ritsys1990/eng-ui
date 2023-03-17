import { Map as ImmutableMap } from 'immutable';
import { WpHistoryActions } from './actionTypes';

export const initialState = ImmutableMap({
  data: null,
  isLoading: false,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case WpHistoryActions.GET_DATA:
      return state.merge({
        isLoading: true,
      });

    case WpHistoryActions.GET_DATA_SUCCESS:
      return state.merge({
        isLoading: false,
        data: action.payload.data,
      });

    case WpHistoryActions.GET_DATA_ERROR:
      return state.merge({
        isLoading: false,
        data: null,
      });

    case WpHistoryActions.RESET:
      return state.merge({
        data: null,
        isLoading: false,
      });

    default:
      return state;
  }
}
