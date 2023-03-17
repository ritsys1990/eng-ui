import reducer, { initialState } from '../reducer';
import { CLPipelinesActionTypes } from '../actionTypes';

describe('CLPipelines reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('Fetch cl pipelines request', () => {
    const expectedState = initialState.merge({
      isCLPipelineFetching: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Fetch cl pipelines success', () => {
    const expectedState = initialState.merge({
      isCLPipelineFetching: false,
      CLPipelineFetchingError: false,
      CLPipelines: [],
      isCLPipelinesRefreshNeeded: false,
    });

    const state = reducer(initialState, {
      type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS,
      payload: { items: [] },
    });
    expect(state).toEqual(expectedState);
  });

  it('Fetch cl pipelines error', () => {
    const expectedState = initialState.merge({
      isCLPipelineFetching: false,
      CLPipelineFetchingError: true,
      CLPipelines: [],
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Post cl pipelines request', () => {
    const expectedState = initialState.merge({
      isCLPipelineAdding: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.POST_CL_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Post cl pipelines success', () => {
    const expectedState = initialState.merge({
      isCLPipelineAdding: false,
      CLPipelineAddingError: false,
      isCLPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.POST_CL_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Post cl pipelines error', () => {
    const expectedState = initialState.merge({
      isCLPipelineAdding: false,
      CLPipelineAddingError: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.POST_CL_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Update cl pipelines request', () => {
    const expectedState = initialState.merge({
      isCLPipelineUpdating: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Update cl pipelines success', () => {
    const expectedState = initialState.merge({
      isCLPipelineUpdating: false,
      CLPipelineUpdatingError: false,
      isCLPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Update cl pipelines error', () => {
    const expectedState = initialState.merge({
      isCLPipelineUpdating: false,
      CLPipelineUpdatingError: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Delete cl pipelines request', () => {
    const expectedState = initialState.merge({
      isCLPipelineDeleting: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Delete cl pipelines success', () => {
    const expectedState = initialState.merge({
      isCLPipelineDeleting: false,
      CLPipelineDeletingError: false,
      isCLPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Delete cl pipelines error', () => {
    const expectedState = initialState.merge({
      isCLPipelineDeleting: false,
      CLPipelineDeletingError: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Approve cl pipelines', () => {
    const expectedState = initialState.merge({
      isCLPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });
});
