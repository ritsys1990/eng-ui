import reducer from './reducer';
import { workpaperProcessMock } from './reducer.mock';

describe('workpaperProcess reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(workpaperProcessMock.initialState);
  });

  it('GetData', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.GetData.action);
    expect(state).toEqual(workpaperProcessMock.GetData.expectedState);
  });

  it('GetDataSuccess', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.GetDataSuccess.action);
    expect(state).toEqual(workpaperProcessMock.GetDataSuccess.expectedState);
  });

  it('GetDataError', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.GetDataError.action);
    expect(state).toEqual(workpaperProcessMock.GetDataError.expectedState);
  });

  it('GET_WORKPAPER', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.GET_WORKPAPER.action);
    expect(state).toEqual(workpaperProcessMock.GET_WORKPAPER.expectedState);
  });

  it('GET_WORKPAPER_SUCCESS', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.GET_WORKPAPER_SUCCESS.action);
    expect(state).toEqual(workpaperProcessMock.GET_WORKPAPER_SUCCESS.expectedState);
  });

  it('GET_WORKPAPER_ERROR', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.GET_WORKPAPER_ERROR.action);
    expect(state).toEqual(workpaperProcessMock.GET_WORKPAPER_ERROR.expectedState);
  });

  it('Reset', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.Reset.action);
    expect(state).toEqual(workpaperProcessMock.Reset.expectedState);
  });

  it('EXPORT_TRIFACTA_WORKPAPER', () => {
    const state = reducer(workpaperProcessMock.initialState, workpaperProcessMock.EXPORT_TRIFACTA_WORKPAPER.action);
    expect(state).toEqual(workpaperProcessMock.EXPORT_TRIFACTA_WORKPAPER.expectedState);
  });

  it('EXPORT_TRIFACTA_WORKPAPER_SUCCESS', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.EXPORT_TRIFACTA_WORKPAPER_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessMock.EXPORT_TRIFACTA_WORKPAPER_SUCCESS.expectedState);
  });

  it('EXPORT_TRIFACTA_WORKPAPER_ERROR', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.EXPORT_TRIFACTA_WORKPAPER_ERROR.action
    );
    expect(state).toEqual(workpaperProcessMock.EXPORT_TRIFACTA_WORKPAPER_ERROR.expectedState);
  });

  it('child workpapers status request', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.GET_CHILD_WORKPAPERS_STATUS_REQUEST.action
    );
    expect(state).toEqual(workpaperProcessMock.GET_CHILD_WORKPAPERS_STATUS_REQUEST.expectedState);
  });

  it('Child workpapers status success', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS.action
    );
    expect(state).toEqual(workpaperProcessMock.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS.expectedState);
  });

  it('child workpapers status error', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR.action
    );
    expect(state).toEqual(workpaperProcessMock.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR.expectedState);
  });

  it('should clone bundles from input datarequest', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.cloneBundleFromInputDataRequest.action
    );
    expect(state).toEqual(workpaperProcessMock.cloneBundleFromInputDataRequest.expectedState);
  });

  it('should clone bundles from input datarequest success', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.cloneBundleFromInputDataRequestSuccess.action
    );
    expect(state).toEqual(workpaperProcessMock.cloneBundleFromInputDataRequestSuccess.expectedState);
  });

  it('should clone bundles from input datarequest error', () => {
    const state = reducer(
      workpaperProcessMock.initialState,
      workpaperProcessMock.cloneBundleFromInputDataRequestError.action
    );
    expect(state).toEqual(workpaperProcessMock.cloneBundleFromInputDataRequestError.expectedState);
  });
});
