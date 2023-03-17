import { Map as ImmutableMap } from 'immutable';
import { EngPipelinesActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  isPipelineFetching: false,
  isPipelineFetchingError: false,
  pipelines: [],
  isPipelinesRefreshNeeded: true,
  isPipelineCreating: false,
  isPipelineCreatingError: false,
  isPipelineUpdating: false,
  isPipelineUpdatingError: false,
  isPipelineDeleting: false,
  isPipelineDeletingError: false,
  isCLPipelineFetching: false,
  isCLPipelineFetchingError: false,
  clPipelines: {
    items: [],
    totalCount: 0,
  },
  addPipelineSelected: '',
  isCLPipelineCloning: false,
  isCLPipelineCloningError: false,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case EngPipelinesActionTypes.FETCH_ENG_PIPELINES_REQUEST:
      return state.merge({
        isPipelineFetching: true,
      });

    case EngPipelinesActionTypes.FETCH_ENG_PIPELINES_SUCCESS:
      return state.merge({
        isPipelineFetching: false,
        isPipelineFetchingError: false,
        pipelines: action.payload?.items,
        isPipelinesRefreshNeeded: false,
      });

    case EngPipelinesActionTypes.FETCH_ENG_PIPELINES_ERROR:
      return state.merge({
        isPipelineFetching: false,
        isPipelineFetchingError: true,
        pipelines: [],
      });

    case EngPipelinesActionTypes.CREATE_ENG_PIPELINE_REQUEST:
      return state.merge({
        isPipelineCreating: true,
      });

    case EngPipelinesActionTypes.CREATE_ENG_PIPELINE_SUCCESS:
      return state.merge({
        isPipelineCreating: false,
        isPipelineCreatingError: false,
        isPipelinesRefreshNeeded: true,
      });

    case EngPipelinesActionTypes.CREATE_ENG_PIPELINE_ERROR:
      return state.merge({
        isPipelineCreating: false,
        isPipelineCreatingError: true,
      });

    case EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_REQUEST:
      return state.merge({
        isPipelineUpdating: true,
      });

    case EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_SUCCESS:
      return state.merge({
        isPipelineUpdating: false,
        isPipelineUpdatingError: false,
        isPipelinesRefreshNeeded: true,
      });

    case EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_ERROR:
      return state.merge({
        isPipelineUpdating: false,
        isPipelineUpdatingError: true,
      });

    case EngPipelinesActionTypes.DELETE_ENG_PIPELINE_REQUEST:
      return state.merge({
        isPipelineDeleting: true,
      });

    case EngPipelinesActionTypes.DELETE_ENG_PIPELINE_SUCCESS:
      return state.merge({
        isPipelineDeleting: false,
        isPipelineDeletingError: false,
        isPipelinesRefreshNeeded: true,
      });

    case EngPipelinesActionTypes.DELETE_ENG_PIPELINE_ERROR:
      return state.merge({
        isPipelineDeleting: false,
        isPipelineDeletingError: true,
      });

    case EngPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST:
      return state.merge({
        isCLPipelineFetching: true,
      });

    case EngPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS:
      const clPipelines = state.get('clPipelines');
      const { items, totalCount, clear } = action.payload;
      const mergeItems = clear ? items : [...clPipelines.items, ...action.payload.items];

      return state.merge({
        isCLPipelineFetching: false,
        isCLPipelineFetchingError: false,
        clPipelines: { ...state.get('clPipelines'), items: mergeItems, totalCount },
        isPipelinesRefreshNeeded: false,
      });

    case EngPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR:
      return state.merge({
        isCLPipelineFetching: false,
        isCLPipelineFetchingError: true,
      });

    case EngPipelinesActionTypes.SET_ADD_PIPELINE_SELECTED:
      return state.merge({
        addPipelineSelected: action.payload,
      });

    case EngPipelinesActionTypes.CLONING_CL_PIPELINE_REQUEST:
      return state.merge({
        isCLPipelineCloning: true,
      });

    case EngPipelinesActionTypes.CLONING_CL_PIPELINE_SUCCESS:
      return state.merge({
        isCLPipelineCloning: false,
        isCLPipelineCloningError: false,
        isPipelinesRefreshNeeded: true,
      });

    case EngPipelinesActionTypes.CLONING_CL_PIPELINE_ERROR:
      return state.merge({
        isCLPipelineCloning: false,
        isCLPipelineCloningError: true,
      });

    default:
      return state;
  }
}
