import reducer, { initialState } from '../reducer';
import { EngPipelinesActionTypes } from '../actionTypes';

describe('EngagementPipelines reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('Fetch Engagement pipelines request', () => {
    const expectedState = initialState.merge({
      isPipelineFetching: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Fetch Engagement pipelines success', () => {
    const expectedState = initialState.merge({
      isPipelineFetching: false,
      isPipelineFetchingError: false,
      pipelines: [],
      isPipelinesRefreshNeeded: false,
    });

    const state = reducer(initialState, {
      type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_SUCCESS,
      payload: { items: [] },
    });
    expect(state).toEqual(expectedState);
  });

  it('Fetch Engagement pipelines error', () => {
    const expectedState = initialState.merge({
      isPipelineFetching: false,
      isPipelineFetchingError: true,
      pipelines: [],
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Post Engagement pipelines request', () => {
    const expectedState = initialState.merge({
      isPipelineCreating: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Post Engagement pipelines success', () => {
    const expectedState = initialState.merge({
      isPipelineCreating: false,
      isPipelineCreatingError: false,
      isPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Post Engagement pipelines error', () => {
    const expectedState = initialState.merge({
      isPipelineCreating: false,
      isPipelineCreatingError: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Update Engagement pipelines request', () => {
    const expectedState = initialState.merge({
      isPipelineUpdating: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Update Engagement pipelines success', () => {
    const expectedState = initialState.merge({
      isPipelineUpdating: false,
      isPipelineUpdatingError: false,
      isPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Update Engagement pipelines error', () => {
    const expectedState = initialState.merge({
      isPipelineUpdating: false,
      isPipelineUpdatingError: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Delete Engagement pipelines request', () => {
    const expectedState = initialState.merge({
      isPipelineDeleting: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Delete Engagement pipelines success', () => {
    const expectedState = initialState.merge({
      isPipelineDeleting: false,
      isPipelineDeletingError: false,
      isPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Delete Engagement pipelines error', () => {
    const expectedState = initialState.merge({
      isPipelineDeleting: false,
      isPipelineDeletingError: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Fetch CL pipelines request', () => {
    const expectedState = initialState.merge({
      isCLPipelineFetching: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Fetch CL pipelines success', () => {
    const expectedState = initialState.merge({
      isCLPipelineFetching: false,
      isCLPipelineFetchingError: false,
      clPipelines: { items: [], totalCount: 0 },
      isPipelinesRefreshNeeded: false,
    });

    const state = reducer(initialState, {
      type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS,
      payload: { items: [], totalCount: 0 },
    });
    expect(state).toEqual(expectedState);
  });

  it('Fetch CL pipelines error', () => {
    const expectedState = initialState.merge({
      isCLPipelineFetching: false,
      isCLPipelineFetchingError: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('add pipelines selected', () => {
    const expectedState = initialState.merge({
      addPipelineSelected: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.SET_ADD_PIPELINE_SELECTED, payload: true });
    expect(state).toEqual(expectedState);
  });
  it('Cloning pipelines request', () => {
    const expectedState = initialState.merge({
      isCLPipelineCloning: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Cloning pipelines success', () => {
    const expectedState = initialState.merge({
      isCLPipelineCloning: false,
      isCLPipelineCloningError: false,
      isPipelinesRefreshNeeded: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('Cloning pipelines error', () => {
    const expectedState = initialState.merge({
      isCLPipelineCloning: false,
      isCLPipelineCloningError: true,
    });

    const state = reducer(initialState, { type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_ERROR });
    expect(state).toEqual(expectedState);
  });
});
