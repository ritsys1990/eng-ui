import reducer, { initialState } from '../reducer';
import { WorkpaperActionTypes } from '../actionTypes';

describe('workpaper reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('copy workpaper', () => {
    const expectedState = initialState.merge({
      isCopyingWorkpaper: true,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.COPY_WORKPAPER_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('copy workpaper success', () => {
    const workpaper = {
      name: 'Workpaper',
    };
    const copyWorkpaper = {
      name: 'Workpaper Copy',
    };

    const updatedInitialState = initialState.merge({
      list: {
        totalCount: 1,
        items: [workpaper],
      },
    });
    const expectedState = initialState.merge({
      isCopyingWorkpaper: false,
      list: {
        totalCount: 2,
        items: [copyWorkpaper, workpaper],
      },
    });

    const state = reducer(updatedInitialState, {
      type: WorkpaperActionTypes.COPY_WORKPAPER_SUCCESS,
      payload: copyWorkpaper,
    });
    expect(state).toEqual(expectedState);
  });

  it('copy workpaper error', () => {
    const expectedState = initialState.merge({
      isCopyingWorkpaper: false,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.COPY_WORKPAPER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('GET_ADD_WORKPAPER_LIST_REQUEST', () => {
    const name = 'Test Name';
    const expectedState = initialState.merge({
      fetchingAddWorkpaperList: true,
      latestSearch: name,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_REQUEST, payload: name });
    expect(state).toEqual(expectedState);
  });

  it('GET_ADD_WORKPAPER_LIST_SUCCESS Clear', () => {
    const payload = {
      list: {
        items: [],
        totalCount: 0,
      },
      clear: true,
    };

    const expectedState = initialState.merge({
      fetchingAddWorkpaperList: false,
      addWorkpaperList: payload.list,
    });

    const state = reducer(initialState, {
      type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_SUCCESS,
      payload,
    });
    expect(state).toEqual(expectedState);
  });

  it('copy GET_ADD_WORKPAPER_LIST_SUCCESS Append', () => {
    const totalCount = 2;
    const workpaper1 = {
      name: 'Workpaper 1',
    };
    const workpaper2 = {
      name: 'Workpaper 2',
    };
    const payload = {
      list: {
        items: [workpaper2],
        totalCount,
      },
      clear: false,
    };

    const updatedInitialState = initialState.merge({
      addWorkpaperList: {
        totalCount,
        items: [workpaper1],
      },
    });
    const expectedState = initialState.merge({
      fetchingAddWorkpaperList: false,
      addWorkpaperList: {
        items: [workpaper1, workpaper2],
        totalCount,
      },
    });

    const state = reducer(updatedInitialState, {
      type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_SUCCESS,
      payload,
    });
    expect(state).toEqual(expectedState);
  });

  it('GET_ADD_WORKPAPER_LIST_ERROR', () => {
    const expectedState = initialState.merge({
      fetchingAddWorkpaperList: false,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('configureTrifactaBundleTransformation request', () => {
    const expectedState = initialState.merge({
      isConfiguringBundle: true,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION });
    expect(state).toEqual(expectedState);
  });

  it('configureTrifactaBundleTransformation request success', () => {
    const expectedState = initialState.merge({
      isConfiguringBundle: false,
    });

    const state = reducer(initialState, {
      type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('configureTrifactaBundleTransformation request error', () => {
    const expectedState = initialState.merge({
      isConfiguringBundle: false,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('create data request', () => {
    const expectedState = initialState.merge({
      isCreatingDataRequest: true,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('create data success', () => {
    const expectedState = initialState.merge({
      isCreatingDataRequest: false,
      dataRequestInfo: undefined,
    });

    const state = reducer(initialState, {
      type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('create data error', () => {
    const expectedState = initialState.merge({
      isCreatingDataRequest: false,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });
  it('Get Child workpaper Status request', () => {
    const expectedState = initialState.merge({
      fetchingList: true,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Get Child workpaper Status request success', () => {
    const expectedState = initialState.merge({
      fetchingList: false,
    });

    const state = reducer(initialState, {
      type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('Get Child workpaper Status request error', () => {
    const expectedState = initialState.merge({
      fetchingList: false,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('Update Child workpaper request', () => {
    const expectedState = initialState.merge({
      fetchingList: true,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.UPDATE_WORKPAPER_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('Update Child workpaper success or error', () => {
    const expectedState = initialState.merge({
      fetchingList: false,
    });

    const state = reducer(initialState, { type: WorkpaperActionTypes.UPDATE_WORKPAPER_SUCCESS });
    expect(state).toEqual(expectedState);
    const errorState = reducer(initialState, { type: WorkpaperActionTypes.UPDATE_WORKPAPER_ERROR });
    expect(errorState).toEqual(expectedState);
  });
});
