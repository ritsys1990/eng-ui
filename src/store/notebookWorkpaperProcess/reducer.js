import { Map as ImmutableMap } from 'immutable';
import { NotebookWPActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  workpaper: null,
  isFetchingWorkpaper: false,
  isLoading: true,
  template: null,
  wpStatus: null,
  progress: ImmutableMap({}),
  executionStatus: null,
  errorOnSaveParameters: false,
  isNotebookAttached: false,
  errorOnLinking: false,
  resetExecution: false,
});

export default function reduce(state = initialState, action = {}) {
  let workpaperProgress;

  switch (action.type) {
    case NotebookWPActionTypes.GET_DATA:
      return state.merge({
        isLoading: true,
      });

    case NotebookWPActionTypes.GET_DATA_SUCCESS:
      return state.merge({
        isLoading: false,
        workpaper: action.payload.details,
        template: action.payload.template,
        wpStatus: action.payload.wpStatus,
      });

    case NotebookWPActionTypes.GET_DATA_ERROR:
      return state.merge({
        isLoading: false,
        data: null,
      });

    case NotebookWPActionTypes.GET_WORKPAPER:
      return state.merge({
        isFetchingWorkpaper: true,
      });

    case NotebookWPActionTypes.GET_WORKPAPER_SUCCESS:
      return state.merge({
        isFetchingWorkpaper: false,
        workpaper: action.payload.details,
      });

    case NotebookWPActionTypes.GET_WORKPAPER_ERROR:
      return state.merge({
        isFetchingWorkpaper: false,
        data: null,
      });

    case NotebookWPActionTypes.RESET:
      return state.merge({
        data: null,
        isLoading: true,
      });

    case NotebookWPActionTypes.EXECUTE_NOTEBOOK_STATUS_SUCCESS:
      workpaperProgress = {};
      workpaperProgress[action.payload.workpaperId] = action.payload.status;

      return state.merge({
        executionStatus: action.payload.status,
        progress: state.get('progress').merge(workpaperProgress),
      });

    case NotebookWPActionTypes.SAVE_PARAMETERS_WORKPAPER_ERROR:
      return state.merge({
        errorOnSaveParameters: true,
      });

    case NotebookWPActionTypes.REPLACE_NOTEBOOK_WORKPAPER_REQUEST:
    case NotebookWPActionTypes.ATTACH_NOTEBOOK_WORKPAPER_REQUEST:
      return state.merge({
        isNotebookAttached: false,
      });

    case NotebookWPActionTypes.REPLACE_NOTEBOOK_WORKPAPER_REQUEST_SUCCESS:
    case NotebookWPActionTypes.ATTACH_NOTEBOOK_WORKPAPER_REQUEST_SUCCESS:
      return state.merge({
        isNotebookAttached: true,
        errorOnLinking: false,
      });

    case NotebookWPActionTypes.REPLACE_NOTEBOOK_WORKPAPER_REQUEST_ERROR:
    case NotebookWPActionTypes.ATTACH_NOTEBOOK_WORKPAPER_REQUEST_ERROR:
      return state.merge({
        isNotebookAttached: true,
        errorOnLinking: true,
      });

    case NotebookWPActionTypes.RESET_EXECTUTION:
      return state.merge({
        resetExecution: true,
      });

    case NotebookWPActionTypes.EXECUTE_NOTEBOOK:
      return state.merge({
        resetExecution: false,
      });

    case NotebookWPActionTypes.UPDATE_EXECUTION_STATUS:
      return state.merge({
        executionStatus: action.payload,
      });
    default:
      return state;
  }
}
