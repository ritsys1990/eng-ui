import reducer, { initialState } from '../reducer';
import { WPProcessStep2ActionTypes } from '../actionTypes';

describe('client reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('handle auto run workpaper', () => {
    const expectedState = initialState.merge({
      didFinishAutoRun: false,
      isFetchingAutoRun: true,
    });

    const state = reducer(initialState, { type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle auto run workpaper success', () => {
    const workpaperStatus = { id: '123' };
    const expectedState = initialState.merge({
      didFinishAutoRun: true,
      isFetchingAutoRun: false,
      workpaperStatus: { id: '123' },
    });

    const state = reducer(initialState, {
      type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_SUCCESS,
      payload: workpaperStatus,
    });
    expect(state).toEqual(expectedState);
  });

  it('handle auto run workpaper error', () => {
    const expectedState = initialState.merge({
      didFinishAutoRun: false,
      isFetchingAutoRun: false,
    });

    const state = reducer(initialState, { type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_ERROR });
    expect(state).toEqual(expectedState);
  });
});
