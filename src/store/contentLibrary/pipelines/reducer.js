import { Map as ImmutableMap } from 'immutable';
import { CLPipelinesActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  isCLPipelineFetching: false,
  CLPipelineFetchingError: false,
  CLPipelines: [],
  isCLPipelinesRefreshNeeded: true,
  isCLPipelineAdding: false,
  CLPipelineAddingError: false,
  isCLPipelineUpdating: false,
  CLPipelineUpdatingError: false,
  isCLPipelineDeleting: false,
  CLPipelineDeletingError: false,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case CLPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST:
      return state.merge({
        isCLPipelineFetching: true,
      });

    case CLPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS:
      return state.merge({
        isCLPipelineFetching: false,
        CLPipelineFetchingError: false,
        CLPipelines: action.payload?.items,
        isCLPipelinesRefreshNeeded: false,
      });

    case CLPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR:
      return state.merge({
        isCLPipelineFetching: false,
        CLPipelineFetchingError: true,
        CLPipelines: [],
      });

    case CLPipelinesActionTypes.POST_CL_PIPELINE_REQUEST:
      return state.merge({
        isCLPipelineAdding: true,
      });

    case CLPipelinesActionTypes.POST_CL_PIPELINE_SUCCESS:
      return state.merge({
        isCLPipelineAdding: false,
        CLPipelineAddingError: false,
        isCLPipelinesRefreshNeeded: true,
      });

    case CLPipelinesActionTypes.POST_CL_PIPELINE_ERROR:
      return state.merge({
        isCLPipelineAdding: false,
        CLPipelineAddingError: true,
      });

    case CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST:
      return state.merge({
        isCLPipelineUpdating: true,
      });

    case CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS:
      return state.merge({
        isCLPipelineUpdating: false,
        CLPipelineUpdatingError: false,
        isCLPipelinesRefreshNeeded: true,
      });

    case CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR:
      return state.merge({
        isCLPipelineUpdating: false,
        CLPipelineUpdatingError: true,
      });

    case CLPipelinesActionTypes.DELETE_CL_PIPELINE_REQUEST:
      return state.merge({
        isCLPipelineDeleting: true,
      });

    case CLPipelinesActionTypes.DELETE_CL_PIPELINE_SUCCESS:
      return state.merge({
        isCLPipelineDeleting: false,
        CLPipelineDeletingError: false,
        isCLPipelinesRefreshNeeded: true,
      });

    case CLPipelinesActionTypes.DELETE_CL_PIPELINE_ERROR:
      return state.merge({
        isCLPipelineDeleting: false,
        CLPipelineDeletingError: true,
      });

    case CLPipelinesActionTypes.APPROVE_CL_PIPELINE_SUCCESS:
    case CLPipelinesActionTypes.REJECT_CL_PIPELINE_REQUEST:
      return state.merge({
        isCLPipelinesRefreshNeeded: true,
      });

    default:
      return state;
  }
}
