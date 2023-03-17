import reducer, { initialState } from '../reducer';
import { workpaperProcessStep3Mock } from '../reducer.mock';
import { WPProcessStep3ActionTypes } from '../actionTypes';

describe('workpaperProcessStep1 reducer', () => {
  it('CLEAR_OUTPUT_SCHEMA', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.CLEAR_OUTPUT_SCHEMA.action);
    expect(state).toEqual(workpaperProcessStep3Mock.CLEAR_OUTPUT_SCHEMA.expectedState);
  });

  it('GET_OUTPUT_SCHEMA', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.GET_OUTPUT_SCHEMA.action);
    expect(state).toEqual(workpaperProcessStep3Mock.GET_OUTPUT_SCHEMA.expectedState);
  });

  it('GET_OUTPUT_SCHEMA_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GET_OUTPUT_SCHEMA_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GET_OUTPUT_SCHEMA_SUCCESS.expectedState);
  });

  it('GET_OUTPUT_SCHEMA_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GET_OUTPUT_SCHEMA_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GET_OUTPUT_SCHEMA_ERROR.expectedState);
  });

  it('DELETE_LABEL_ERROR', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.DELETE_LABEL_ERROR.action);
    expect(state).toEqual(workpaperProcessStep3Mock.DELETE_LABEL_ERROR.expectedState);
  });

  it('SAVE_OUTPUT_LABEL', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.SAVE_OUTPUT_LABEL.action);
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_LABEL.expectedState);
  });

  it('SAVE_OUTPUT_LABEL_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.SAVE_OUTPUT_LABEL_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_LABEL_SUCCESS.expectedState);
  });

  it('SAVE_OUTPUT_LABEL_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.SAVE_OUTPUT_LABEL_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_LABEL_ERROR.expectedState);
  });

  it('SAVE_OUTPUT_TO_DL', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.SAVE_OUTPUT_TO_DL.action);
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_TO_DL.expectedState);
  });

  it('SAVE_OUTPUT_TO_DL_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.SAVE_OUTPUT_TO_DL_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_TO_DL_SUCCESS.expectedState);
  });

  it('SAVE_OUTPUT_TO_DL_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.SAVE_OUTPUT_TO_DL_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_TO_DL_ERROR.expectedState);
  });

  it('SAVE_OUTPUT_TO_SQL', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.SAVE_OUTPUT_TO_SQL.action);
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_TO_SQL.expectedState);
  });

  it('SAVE_OUTPUT_TO_SQL_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.SAVE_OUTPUT_TO_SQL_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_TO_SQL_SUCCESS.expectedState);
  });

  it('SAVE_OUTPUT_TO_SQL_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.SAVE_OUTPUT_TO_SQL_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.SAVE_OUTPUT_TO_SQL_ERROR.expectedState);
  });

  it('GET_OUTPUT_LABEL', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.GET_OUTPUT_LABEL.action);
    expect(state).toEqual(workpaperProcessStep3Mock.GET_OUTPUT_LABEL.expectedState);
  });

  it('GET_OUTPUT_LABEL_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GET_OUTPUT_LABEL_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GET_OUTPUT_LABEL_SUCCESS.expectedState);
  });

  it('GET_OUTPUT_LABEL_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GET_OUTPUT_LABEL_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GET_OUTPUT_LABEL_ERROR.expectedState);
  });

  it('GET_WP_OUTPUT_LABEL_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GET_WP_OUTPUT_LABEL_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GET_WP_OUTPUT_LABEL_SUCCESS.expectedState);
  });

  it('DOWNLOAD_OUTPUT_CSV', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.DOWNLOAD_OUTPUT_CSV.action);
    expect(state).toEqual(workpaperProcessStep3Mock.DOWNLOAD_OUTPUT_CSV.expectedState);
  });

  it('DOWNLOAD_OUTPUT_CSV_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.DOWNLOAD_OUTPUT_CSV_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.DOWNLOAD_OUTPUT_CSV_SUCCESS.expectedState);
  });

  it('DOWNLOAD_OUTPUT_CSV_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.DOWNLOAD_OUTPUT_CSV_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.DOWNLOAD_OUTPUT_CSV_ERROR.expectedState);
  });

  it('DOWNLOAD_ALL_OUTPUTS', () => {
    const expectedState = initialState.merge({
      isDownloadingAllOutputs: true,
    });

    const state = reducer(initialState, { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS });
    expect(state).toEqual(expectedState);
  });

  it('DOWNLOAD_ALL_OUTPUTS_SUCCESS', () => {
    const expectedState = initialState.merge({
      isDownloadingAllOutputs: false,
    });

    const state = reducer(initialState, { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('DOWNLOAD_ALL_OUTPUTS_ERROR', () => {
    const expectedState = initialState.merge({
      isDownloadingAllOutputs: false,
    });

    const state = reducer(initialState, { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('GENERATE_WORKBOOKS', () => {
    const state = reducer(workpaperProcessStep3Mock.initialState, workpaperProcessStep3Mock.GENERATE_WORKBOOKS.action);
    expect(state).toEqual(workpaperProcessStep3Mock.GENERATE_WORKBOOKS.expectedState);
  });

  it('GENERATE_WORKBOOKS_STATE', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GENERATE_WORKBOOKS_STATE.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GENERATE_WORKBOOKS_STATE.expectedState);
  });

  it('GENERATE_WORKBOOKS_FETCH_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GENERATE_WORKBOOKS_FETCH_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GENERATE_WORKBOOKS_FETCH_ERROR.expectedState);
  });

  it('GENERATE_WORKBOOKS_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.GENERATE_WORKBOOKS_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.GENERATE_WORKBOOKS_ERROR.expectedState);
  });

  it('ADD_DATAMODEL_OUTPUT_REQUEST', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.ADD_DATAMODEL_OUTPUT_REQUEST.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.ADD_DATAMODEL_OUTPUT_REQUEST.expectedState);
  });

  it('ADD_DATAMODEL_OUTPUT_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.ADD_DATAMODEL_OUTPUT_SUCCESS.action
    );

    expect(state).toEqual(workpaperProcessStep3Mock.ADD_DATAMODEL_OUTPUT_SUCCESS.expectedState);
  });

  it('ADD_DATAMODEL_OUTPUT_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.ADD_DATAMODEL_OUTPUT_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.ADD_DATAMODEL_OUTPUT_ERROR.expectedState);
  });

  it('VALIDATE_CONNECTED_DM_STATE', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.VALIDATE_CONNECTED_DM_STATE.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.VALIDATE_CONNECTED_DM_STATE.expectedState);
  });

  it('VALIDATE_CONNECTED_DM_STATE_SUCCESS', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.VALIDATE_CONNECTED_DM_STATE_SUCCESS.action
    );

    expect(state).toEqual(workpaperProcessStep3Mock.VALIDATE_CONNECTED_DM_STATE_SUCCESS.expectedState);
  });

  it('VALIDATE_CONNECTED_DM_STATE_ERROR', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.VALIDATE_CONNECTED_DM_STATE_ERROR.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.VALIDATE_CONNECTED_DM_STATE_ERROR.expectedState);
  });

  it('CLEAR_CONNECTED_DM_STATE', () => {
    const state = reducer(
      workpaperProcessStep3Mock.initialState,
      workpaperProcessStep3Mock.CLEAR_CONNECTED_DM_STATE.action
    );
    expect(state).toEqual(workpaperProcessStep3Mock.CLEAR_CONNECTED_DM_STATE.expectedState);
  });
});
