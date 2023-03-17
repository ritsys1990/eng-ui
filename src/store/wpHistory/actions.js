import workpaperService from '../../services/workpaper.service';
import { WpHistoryActions } from './actionTypes';
import { addGlobalError } from '../errors/actions';

export function getWpRevisions(id) {
  return async dispatch => {
    try {
      dispatch({ type: WpHistoryActions.GET_DATA });
      const data = await workpaperService.getRevisions(id);

      dispatch({
        type: WpHistoryActions.GET_DATA_SUCCESS,
        payload: { data: data && data[0] },
      });

      return data;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WpHistoryActions.GET_DATA_ERROR });

      return false;
    }
  };
}
