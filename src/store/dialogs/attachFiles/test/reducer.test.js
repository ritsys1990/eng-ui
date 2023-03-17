import reducer, { initialState } from '../reducer';
import { attachFilesMockReducer } from './reducer.mock';
import { AttachFilesActions } from '../actionTypes';

describe('attach files reducer', () => {
  it('Get Root Folder', () => {
    const expectedState = initialState.merge({
      isLoading: true,
    });

    const state = reducer(initialState, { type: AttachFilesActions.GET_ROOT_FOLDER });
    expect(state).toEqual(expectedState);
  });

  it('Get Root Folder Error', () => {
    const expectedState = initialState.merge({
      isLoading: false,
    });

    const state = reducer(initialState, { type: AttachFilesActions.GET_ROOT_FOLDER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Get Children Folder', () => {
    const expectedState = initialState.merge({
      isLoading: true,
    });

    const state = reducer(initialState, { type: AttachFilesActions.GET_CHILDREN_FOLDER });
    expect(state).toEqual(expectedState);
  });

  it('Get Children Folder Error', () => {
    const expectedState = initialState.merge({
      isLoading: false,
    });

    const state = reducer(initialState, { type: AttachFilesActions.GET_CHILDREN_FOLDER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('fetch all published datamodels', () => {
    const state = reducer(attachFilesMockReducer.initialState, attachFilesMockReducer.fetchPublishedDatamodels.action);
    expect(state).toEqual(attachFilesMockReducer.fetchPublishedDatamodels.expectedState);
  });

  it('FAILURE CASE --fetch all published datamodels', () => {
    const state = reducer(
      attachFilesMockReducer.initialState,
      attachFilesMockReducer.fetchPublishedDatamodelsError.action
    );
    expect(state).toEqual(attachFilesMockReducer.fetchPublishedDatamodelsError.expectedState);
  });

  it('SUCCESS CASE --fetch all published datamodels', () => {
    const state = reducer(
      attachFilesMockReducer.initialState,
      attachFilesMockReducer.fetchPublishedDatamodelsSuccess.action
    );
    expect(state).toEqual(attachFilesMockReducer.fetchPublishedDatamodelsSuccess.expectedState);
  });

  it('PREVIEW_SHEET', () => {
    const expectedState = initialState.merge({
      isFilePreviewLoading: true,
    });

    const state = reducer(initialState, { type: AttachFilesActions.PREVIEW_SHEET });
    expect(state).toEqual(expectedState);
  });

  it('PREVIEW_SHEET_SUCCESS', () => {
    const schemaWithData = [{ name: '4' }, { name: '5' }, { name: '6' }];
    const schema = ['4', '5', '6'];
    const rows = [
      ['2', '2', '2'],
      ['3', '3', '3'],
    ];
    const data = [schema, ...rows];

    const payload = { data, schema: schemaWithData };
    const expectedState = initialState.merge({
      isFilePreviewLoading: false,
      preview: {
        type: 'sheet',
        data,
      },
    });

    const state = reducer(initialState, { type: AttachFilesActions.PREVIEW_SHEET_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('PREVIEW_SHEET_FAILURE', () => {
    const expectedState = initialState.merge({
      isFilePreviewLoading: false,
    });

    const state = reducer(initialState, { type: AttachFilesActions.PREVIEW_SHEET_FAILURE });
    expect(state).toEqual(expectedState);
  });
});
