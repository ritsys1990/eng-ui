import childWorkpaperService from '../../services/child-workpaper.service';
import workpaperService from '../../services/workpaper.service';
import { ChildWorkpaperActionTypes } from './actionTypes';
import { addGlobalError, addAddWorkpaperError } from '../errors/actions';
import DataWranglerService from '../../services/data-wrangler.service';

export function getChildWorkPapers(parentId) {
  return async dispatch => {
    try {
      dispatch({ type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_REQUEST });
      const childWorkPapers = await childWorkpaperService.getChildWorkPapers(parentId);
      dispatch({
        type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_SUCCESS,
        payload: childWorkPapers,
      });

      const configKey = 'MAXCHILDWORKPAPERLIMIT';
      const childWpCount = await workpaperService.getWorkPaperConfigByKey(configKey);
      dispatch({
        type: ChildWorkpaperActionTypes.GET_MAX_CHILD_WORKPAPERS_LIMIT,
        payload: childWpCount,
      });

      const genreratOutputeKey = 'MAXGENERATEOUTPUTCHILDWORKPAPERLIMIT';
      const generateOutputWpCount = await workpaperService.getWorkPaperConfigByKey(genreratOutputeKey);
      dispatch({
        type: ChildWorkpaperActionTypes.GET_MAX_GENERATEOUTPUT_CHILD_WORKPAPERS_LIMIT,
        payload: generateOutputWpCount,
      });

      return childWorkPapers;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_ERROR,
        payload: { err },
      });

      return false;
    }
  };
}
export function checkChildWorkpaperNameExists(engagementId, workpaperName, childDetailId = '') {
  return async dispatch => {
    try {
      return await childWorkpaperService.checkWorkpaperNameExists(engagementId, workpaperName, childDetailId);
    } catch (err) {
      dispatch(addAddWorkpaperError(err));

      return false;
    }
  };
}

export function saveWorkPaperFilterData(filterData, errorAction = addGlobalError, isUpdateChildWorkpaper) {
  return async dispatch => {
    try {
      dispatch({ type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_REQUEST });
      const isSaved = await childWorkpaperService.saveChildWpFilterData(filterData, isUpdateChildWorkpaper);
      dispatch({
        type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_SUCCESS,
      });

      return isSaved;
    } catch (err) {
      dispatch(errorAction(err));
      dispatch({
        type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_FAILURE,
        payload: { err },
      });

      return false;
    }
  };
}

export function deleteChildWorkPaper(id, childWorkpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER });
      const isDeleted = await childWorkpaperService.deleteChildWorkpaper(id);
      if (childWorkpaperId) {
        await workpaperService.deleteWorkpaper(childWorkpaperId);
      }
      dispatch({ type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER_SUCCESS });

      return isDeleted;
    } catch (err) {
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function generateChildWorkpapers(childWorkPapers) {
  return async dispatch => {
    try {
      dispatch({ type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST });
      const isGenerated = await childWorkpaperService.generateChildWorkpapers(childWorkPapers);
      dispatch({ type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_SUCCESS });

      return isGenerated;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_ERROR });

      return false;
    }
  };
}

export function getChildWpColumns() {
  return async dispatch => {
    try {
      dispatch({ type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST });
      const includeChildWpColumnsKey = 'INCLUDECHILDWPCOLUMNSLIST';
      const includeChildWpColumnsList = await workpaperService.getWorkPaperConfigByKey(includeChildWpColumnsKey);
      dispatch({
        type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_SUCCESS,
        payload: includeChildWpColumnsList,
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_ERROR, payload: [] });

      return false;
    }
  };
}

export function getAndSyncFlowOutputs(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: ChildWorkpaperActionTypes.GET_FLOW_OUTPUT, payload: { workpaperId } });

      const outputs = await DataWranglerService.getAndSyncFlowOutputs(workpaperId);
      dispatch({
        type: ChildWorkpaperActionTypes.GET_FLOW_OUTPUT_SUCCESS,
        payload: { [workpaperId]: outputs },
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: ChildWorkpaperActionTypes.GET_FLOW_OUTPUT_ERROR, payload: { workpaperId, outputs: [] } });
    }
  };
}
