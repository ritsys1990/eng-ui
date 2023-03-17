import { WpViewOutputsActionTypes } from './actionTypes';
import analyticsService from '../../services/analytics-ui.service';
import { addGlobalError } from '../errors/actions';
import { mapOutputsToView } from '../../components/WorkpaperViewOutputs/utils/ViewOutputs.util';

export function getWpViewOutputs(id) {
  return async dispatch => {
    try {
      dispatch({ type: WpViewOutputsActionTypes.GET_DATA });

      const outputs = await analyticsService.getWorkPaperViewOutputs(id);

      dispatch({
        type: WpViewOutputsActionTypes.GET_DATA_SUCCESS,
        payload: mapOutputsToView(outputs),
      });
    } catch (error) {
      dispatch(addGlobalError(error));
      dispatch({ type: WpViewOutputsActionTypes.GET_DATA_ERROR });
    }
  };
}
