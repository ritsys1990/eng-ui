import reducer, { initialState } from '../reducer';
import { ErrorActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';

const mockErrorMessage = 'Test message error';

const mockWorkpaperId = '1234-5678-9012-3456';

describe('error reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('add client error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      addClientErrors: [...initialState.get('addClientErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_ADD_CLIENT_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete client error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      addClientErrors: [...initialState.get('addClientErrors'), error],
    });

    const expectedState = initialState.merge({
      addClientErrors: [...initialState.get('addClientErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_ADD_CLIENT_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset client error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_ADD_CLIENT_ERRORS });
    expect(state).toEqual(expectedState);
  });

  it('add add workpaper error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      addWorkpaperErrors: [...initialState.get('addWorkpaperErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_ADD_WORKPAPER_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete add workpaper error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      addWorkpaperErrors: [...initialState.get('addWorkpaperErrors'), error],
    });

    const expectedState = initialState.merge({
      addWorkpaperErrors: [...initialState.get('addWorkpaperErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_ADD_WORKPAPER_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset add workpaper error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_ADD_WORKPAPER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('add add pipeline error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      addPipelineError: [...initialState.get('addPipelineError'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_PIPELINE_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete add pipeline error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      addPipelineError: [...initialState.get('addPipelineError'), error],
    });

    const expectedState = initialState.merge({
      addPipelineError: [...initialState.get('addPipelineError')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_ADD_PIPELINE_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset add pipeline error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_ADD_PIPELINE_ERRORS });
    expect(state).toEqual(expectedState);
  });

  it('update pipeline error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      updatePipelineError: [...initialState.get('updatePipelineError'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.UPDATE_PIPELINE_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete update pipeline error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      updatePipelineError: [...initialState.get('updatePipelineError'), error],
    });

    const expectedState = initialState.merge({
      updatePipelineError: [...initialState.get('updatePipelineError')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_UPDATE_PIPELINE_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset update pipeline error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_UPDATE_PIPELINE_ERRORS });
    expect(state).toEqual(expectedState);
  });

  it('add input file error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      inputFileErrors: [...initialState.get('inputFileErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_INPUT_FILE_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete input file  error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      inputFileErrors: [...initialState.get('inputFileErrors'), error],
    });

    const expectedState = initialState.merge({
      inputFileErrors: [...initialState.get('inputFileErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_INPUT_FILE_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset input file error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_INPUT_FILE_ERRORS });
    expect(state).toEqual(expectedState);
  });

  it('add workpaper processing error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const currentWorkpaperProcessingErrors = {};
    const currentErrors = [...(initialState.get('workpaperProcessingErrors').get(mockWorkpaperId) || [])];
    currentWorkpaperProcessingErrors[mockWorkpaperId] = [...currentErrors, error];

    const expectedState = initialState.merge({
      workpaperProcessingErrors: initialState.get('workpaperProcessingErrors').merge(currentWorkpaperProcessingErrors),
    });

    const state = reducer(initialState, {
      type: ErrorActionTypes.ADD_WORKPAPER_PROCESSING_ERROR,
      payload: { error, workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('delete workpaper processing  error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const currentWorkpaperProcessingErrors = {};
    currentWorkpaperProcessingErrors[mockWorkpaperId] = [error];

    const updatedInitialState = initialState.merge({
      workpaperProcessingErrors: initialState.get('workpaperProcessingErrors').merge(currentWorkpaperProcessingErrors),
    });

    const expectedWorkpaperProcessingErrors = {};
    expectedWorkpaperProcessingErrors[mockWorkpaperId] = [];

    const expectedState = initialState.merge({
      workpaperProcessingErrors: initialState.get('workpaperProcessingErrors').merge(expectedWorkpaperProcessingErrors),
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_WORKPAPER_PROCESSING_ERROR,
      payload: { errorKey: error.key, workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('reset workpaper processing error', () => {
    const expectedWorkpaperProcessingErrors = {};
    expectedWorkpaperProcessingErrors[mockWorkpaperId] = [];

    const expectedState = initialState.merge({
      workpaperProcessingErrors: initialState.get('workpaperProcessingErrors').merge(expectedWorkpaperProcessingErrors),
    });

    const state = reducer(initialState, {
      type: ErrorActionTypes.RESET_WORKPAPER_PROCESSING_ERRORS,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('add import flow error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      importFlowErrors: [...initialState.get('importFlowErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_IMPORT_FLOW_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete import flow error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      importFlowErrors: [...initialState.get('importFlowErrors'), error],
    });

    const expectedState = initialState.merge({
      importFlowErrors: [...initialState.get('importFlowErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_IMPORT_FLOW_EACH_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('add reconcile client error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      reconcileClientErrors: [...initialState.get('reconcileClientErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_RECONCILE_CLIENT_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete reconcile client error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      reconcileClientErrors: [...initialState.get('reconcileClientErrors'), error],
    });

    const expectedState = initialState.merge({
      reconcileClientErrors: [...initialState.get('reconcileClientErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_RECONCILE_CLIENT_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset reconcile client error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      reconcileClientErrors: [...initialState.get('reconcileClientErrors'), error],
    });

    const expectedState = initialState.merge({
      reconcileClientErrors: [],
    });

    const state = reducer(updatedInitialState, { type: ErrorActionTypes.RESET_RECONCILE_CLIENT_ERRORS });
    expect(state).toEqual(expectedState);
  });

  it('add DM Field error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      dmFieldErrors: [...initialState.get('dmFieldErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_DM_FIELD_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete DM Field  error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      dmFieldErrors: [...initialState.get('dmFieldErrors'), error],
    });

    const expectedState = initialState.merge({
      dmFieldErrors: [...initialState.get('dmFieldErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_DM_FIELD_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset DM Field error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_DM_FILED_ERRORS });
    expect(state).toEqual(expectedState);
  });

  it('add add engagement error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      addEngagementErrors: [...initialState.get('addEngagementErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_ADD_ENGAGEMENT_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete add engagement error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      addEngagementErrors: [...initialState.get('addEngagementErrors'), error],
    });

    const expectedState = initialState.merge({
      addEngagementErrors: [...initialState.get('addEngagementErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_ADD_ENGAGEMENT_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset add engagement error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      addEngagementErrors: [...initialState.get('addEngagementErrors'), error],
    });

    const expectedState = initialState.merge({
      addEngagementErrors: [],
    });

    const state = reducer(updatedInitialState, { type: ErrorActionTypes.RESET_ADD_ENGAGEMENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('add ingest DMT error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedState = initialState.merge({
      ingestDMTErrors: [...initialState.get('ingestDMTErrors'), error],
    });

    const state = reducer(initialState, { type: ErrorActionTypes.ADD_INGEST_DMT_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('delete ingest DMT  error', () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const updatedInitialState = initialState.merge({
      ingestDMTErrors: [...initialState.get('ingestDMTErrors'), error],
    });

    const expectedState = initialState.merge({
      ingestDMTErrors: [...initialState.get('ingestDMTErrors')],
    });

    const state = reducer(updatedInitialState, {
      type: ErrorActionTypes.DELETE_INGEST_DMT_ERROR,
      payload: error.key,
    });
    expect(state).toEqual(expectedState);
  });

  it('reset ingest DMT error', () => {
    const expectedState = initialState;

    const state = reducer(initialState, { type: ErrorActionTypes.RESET_DELETE_INGEST_DMT_ERROR });
    expect(state).toEqual(expectedState);
  });
});
