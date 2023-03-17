import reducer, { initialState } from '../reducer';
import { ChildWorkpaperActionTypes } from '../actionTypes';

describe('childworkpapers reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('get child work papers list request', () => {
    const expectedState = initialState.merge({
      fetchingChildWorkpapers: true,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get child work papers list success', () => {
    const childWorkPapersList = [
      {
        id: '123',
        name: 'Test name',
        description: 'Test description',
        childWorkPaperStatus: 'Not Generated',
      },
    ];
    const initialList = [];

    const updatedInitialState = initialState.merge({
      fetchingChildWorkpapers: true,
      childWorkPapersList: initialList,
    });
    const expectedState = initialState.merge({
      fetchingChildWorkpapers: false,
      childWorkPapersList,
    });

    const state = reducer(updatedInitialState, {
      type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_SUCCESS,
      payload: childWorkPapersList,
    });
    expect(state).toEqual(expectedState);
  });

  it('get child work papers list error', () => {
    const expectedState = initialState.merge({
      fetchingChildWorkpapers: false,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('save child workpaper filter', () => {
    const expectedState = initialState.merge({
      savingChildWorkpaperFilterData: true,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('save child workpaper filter success', () => {
    const expectedState = initialState.merge({
      savingChildWorkpaperFilterData: false,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('save child workpaper filter error', () => {
    const expectedState = initialState.merge({
      savingChildWorkpaperFilterData: false,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_FAILURE });
    expect(state).toEqual(expectedState);
  });
  it('delete  child work paper', () => {
    const expectedState = initialState.merge({
      isDeletingChildWorkpaper: true,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER });
    expect(state).toEqual(expectedState);
  });
  it('delete child work paper success', () => {
    const expectedState = initialState.merge({
      isDeletingChildWorkpaper: false,
    });

    const state = reducer(initialState, {
      type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('delete child work paper error', () => {
    const expectedState = initialState.merge({
      isDeletingChildWorkpaper: false,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Generate outputs child work paper', () => {
    const expectedState = initialState.merge({
      isGenerateOutputSuccess: true,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Generate Outputs for child work paper success', () => {
    const expectedState = initialState.merge({
      isGenerateOutputSuccess: false,
    });

    const state = reducer(initialState, {
      type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('Generate Output child work paper error', () => {
    const expectedState = initialState.merge({
      isGenerateOutputSuccess: false,
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Child workpaper columns request', () => {
    const expectedState = initialState.merge({
      childWpColumns: [],
    });

    const state = reducer(initialState, { type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Child workpaper columns request success', () => {
    const expectedState = initialState.merge({
      childWpColumns: ['Entity'],
    });

    const state = reducer(initialState, {
      type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_SUCCESS,
      payload: ['Entity'],
    });
    expect(state).toEqual(expectedState);
  });

  it('Child workpaper columns error flow', () => {
    const expectedState = initialState.merge({
      childWpColumns: [],
    });

    const state = reducer(initialState, {
      type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_ERROR,
      payload: [],
    });
    expect(state).toEqual(expectedState);
  });
});
