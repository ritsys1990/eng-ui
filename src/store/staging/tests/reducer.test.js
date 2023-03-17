import { StagingActionTypes } from '../actionTypes';
import reducer, { initialState } from '../reducer';
import { stagingMock } from './reducer.mock';

describe('staging reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(stagingMock.initialState);
  });

  it('GetEngagementFolders', () => {
    const state = reducer(stagingMock.initialState, stagingMock.GetEngagementFolders.action);
    expect(state).toEqual(stagingMock.GetEngagementFolders.expectedState);
  });

  it('GetEngagementFoldersSuccess', () => {
    const state = reducer(stagingMock.initialState, stagingMock.GetEngagementFoldersSuccess.action);
    expect(state).toEqual(stagingMock.GetEngagementFoldersSuccess.expectedState);
  });

  it('GetEngagementFoldersError', () => {
    const state = reducer(stagingMock.initialState, stagingMock.GetEngagementFoldersError.action);
    expect(state).toEqual(stagingMock.GetEngagementFoldersError.expectedState);
  });

  it('download file', () => {
    const expectedState = initialState.merge({
      isDownloadingFile: true,
    });

    const state = reducer(initialState, { type: StagingActionTypes.DOWNLOAD_FILE });
    expect(state).toEqual(expectedState);
  });

  it('download file success', () => {
    const expectedState = initialState.merge({
      isDownloadingFile: false,
    });

    const state = reducer(initialState, { type: StagingActionTypes.DOWNLOAD_FILE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('download file error', () => {
    const expectedState = initialState.merge({
      isDownloadingFile: false,
    });

    const state = reducer(initialState, { type: StagingActionTypes.DOWNLOAD_FILE_ERROR });
    expect(state).toEqual(expectedState);
  });
});
