import reducer from '../reducer';
import { commonDMsReducerMock } from './reducer.mock';

describe('content library common datamodels reducer', () => {
  it('fetch common datamodels', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.fetchCDMs.action);
    expect(state).toEqual(commonDMsReducerMock.fetchCDMs.expectedState);
  });

  it('fetch common datamodels success', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.fetchCDMsSuccess.action);
    expect(state).toEqual(commonDMsReducerMock.fetchCDMsSuccess.expectedState);
  });

  it('fetch common datamodels failure', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.fetchCDMsFailure.action);
    expect(state).toEqual(commonDMsReducerMock.fetchCDMsFailure.expectedState);
  });
  it('update common datamodel', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.updateCDM.action);
    expect(state).toEqual(commonDMsReducerMock.updateCDM.expectedState);
  });

  it('update common datamodel success', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.updateCDMSuccess.action);
    expect(state).toEqual(commonDMsReducerMock.updateCDMSuccess.expectedState);
  });

  it('update common datamodel failure', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.updateCDMFailure.action);
    expect(state).toEqual(commonDMsReducerMock.updateCDMFailure.expectedState);
  });

  it('delete common datamodel', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.deleteCDM.action);
    expect(state).toEqual(commonDMsReducerMock.deleteCDM.expectedState);
  });

  it('delete common datamodel success', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.deleteCDMSuccess.action);
    expect(state).toEqual(commonDMsReducerMock.deleteCDMSuccess.expectedState);
  });

  it('delete common datamodel failure', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.deleteCDMFailure.action);
    expect(state).toEqual(commonDMsReducerMock.deleteCDMFailure.expectedState);
  });

  it('get mapped DMs of common datamodel', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.getMappedDMsofCDM.action);
    expect(state).toEqual(commonDMsReducerMock.getMappedDMsofCDM.expectedState);
  });

  it('get mapped DMs of common datamodel success', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.getMappedDMsofCDMSucess.action);
    expect(state).toEqual(commonDMsReducerMock.getMappedDMsofCDMSucess.expectedState);
  });

  it('get mapped DMs of common datamodel failure', () => {
    const state = reducer(commonDMsReducerMock.initialState, commonDMsReducerMock.getMappedDMsofCDMFailure.action);
    expect(state).toEqual(commonDMsReducerMock.getMappedDMsofCDMFailure.expectedState);
  });
});
