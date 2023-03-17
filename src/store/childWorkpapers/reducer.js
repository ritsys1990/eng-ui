import { Map as ImmutableMap } from 'immutable';
import { ChildWorkpaperActionTypes } from './actionTypes';
import { groupOutputsByType } from '../../pages/WorkPaperProcess/utils/WorkPaperProcess.utils';

export const initialState = ImmutableMap({
  childWorkPapersList: [],
  fetchingChildWorkpapers: false,
  maxChildWorkPapersLimit: 0,
  savingChildWorkpaperFilterData: false,
  isDeletingChildWorkpaper: false,
  maxGenerateOutputChildWorkPapersLimit: 0,
  isGenerateOutputSuccess: false,
  childWpColumns: [],
  syncingOutputs: false,
  loading: false,
  ungroupedOutputs: ImmutableMap({}),
  outputs: ImmutableMap({}),
});

export const initialOutputs = {
  dataTable: [],
  dqc: [],
  tableau: [],
  tableau_cloned: false,
};

export default function reduce(state = initialState, action = {}) {
  let workpaperTrifactaOutputs;
  let workpaperTrifactaUngroupedOutputs;
  switch (action.type) {
    case ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_REQUEST:
      return state.merge({
        fetchingChildWorkpapers: true,
      });

    case ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_SUCCESS:
      return state.merge({
        fetchingChildWorkpapers: false,
        childWorkPapersList: action.payload,
      });

    case ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_ERROR:
      return state.merge({
        fetchingChildWorkpapers: false,
      });

    case ChildWorkpaperActionTypes.GET_MAX_CHILD_WORKPAPERS_LIMIT:
      return state.merge({
        maxChildWorkPapersLimit: action.payload,
      });

    case ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_REQUEST:
      return state.merge({
        savingChildWorkpaperFilterData: true,
      });

    case ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_SUCCESS:
    case ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_FAILURE:
      return state.merge({
        savingChildWorkpaperFilterData: false,
      });

    case ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER:
      return state.merge({
        isDeletingChildWorkpaper: true,
      });

    case ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER_SUCCESS:
    case ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER_ERROR:
      return state.merge({
        isDeletingChildWorkpaper: false,
      });
    case ChildWorkpaperActionTypes.GET_MAX_GENERATEOUTPUT_CHILD_WORKPAPERS_LIMIT:
      return state.merge({
        maxGenerateOutputChildWorkPapersLimit: action.payload,
      });

    case ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST:
      return state.merge({
        isGenerateOutputSuccess: true,
      });
    case ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_SUCCESS:
    case ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_ERROR:
      return state.merge({
        isGenerateOutputSuccess: false,
      });

    case ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST:
    case ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_ERROR:
      return state.merge({
        childWpColumns: [],
      });
    case ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_SUCCESS:
      return state.merge({
        childWpColumns: action.payload,
      });

    case ChildWorkpaperActionTypes.GET_FLOW_OUTPUT:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaOutputs[action.payload.workpaperId] = { ...initialOutputs };

      return state.merge({
        loading: true,
        syncingOutputs: action.payload.workpaperId,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
      });

    case ChildWorkpaperActionTypes.GET_FLOW_OUTPUT_SUCCESS:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaUngroupedOutputs = {};
      Object.keys(action.payload).forEach(key => {
        workpaperTrifactaOutputs[key] = {
          tableau: [],
          tableau_cloned: false,
          ...groupOutputsByType(action.payload[key]),
        };
        workpaperTrifactaUngroupedOutputs[key] = action.payload[key];
      });

      return state.merge({
        loading: false,
        syncingOutputs: false,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperTrifactaUngroupedOutputs),
      });

    case ChildWorkpaperActionTypes.GET_FLOW_OUTPUT_ERROR:
      workpaperTrifactaOutputs = {};
      workpaperTrifactaOutputs[action.payload.workpaperId] = {
        dataTable: [],
        dqc: [],
        tableau: [],
        tableau_cloned: false,
      };

      workpaperTrifactaUngroupedOutputs = {};
      workpaperTrifactaUngroupedOutputs[action.payload.workpaperId] = action.payload.outputs;

      return state.merge({
        loading: false,
        syncingOutputs: false,
        outputs: state.get('outputs').merge(workpaperTrifactaOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperTrifactaUngroupedOutputs),
      });

    default:
      return state;
  }
}
