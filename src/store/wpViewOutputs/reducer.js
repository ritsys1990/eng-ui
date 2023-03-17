import { Map as ImmutableMap } from 'immutable';
import { WpViewOutputsActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  data: null,
  isLoading: false,
  error: false,
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case WpViewOutputsActionTypes.GET_DATA:
      return state.merge({
        isLoading: true,
      });
    case WpViewOutputsActionTypes.GET_DATA_SUCCESS:
      return state.merge({
        isLoading: false,
        data: action.payload,
      });
    case WpViewOutputsActionTypes.GET_DATA_ERROR:
      return state.merge({
        isLoading: false,
        data: null,
        error: true,
      });
    case WpViewOutputsActionTypes.RESET:
      return state.merge(initialState);
    default:
      return state;
  }
}
