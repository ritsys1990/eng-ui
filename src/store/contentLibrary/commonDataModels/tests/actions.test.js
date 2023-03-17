import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import bundleService from '../../../../services/bundles.service';
import * as cdmActions from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { CLCDMActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../../errors/actionTypes';
import { v4 as uuidv4 } from 'uuid';
import { datamodelsMock, commonDMsMock } from './commonDMs.mock';

window.scrollTo = jest.fn();

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';
userError.code = 409;

const parseError = error => {
  const parsedError = error;
  parsedError.key = parsedError.key || uuidv4();

  return parsedError;
};

describe('content library common datamodels actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.clearActions();
  });

  it('fetches the list of all common datamodels', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.FETCH_CDMS_LIST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: commonDMsMock },
    ];

    bundleService.getAllCommonDataModels = jest.fn().mockImplementation(() => {
      return commonDMsMock;
    });
    await mockStore.dispatch(cdmActions.getAllCommonDataModels());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--get all common datamodels', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.FETCH_CDMS_LIST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getAllCommonDataModels = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(cdmActions.getAllCommonDataModels());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('adds or updates the cdm', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.UPDATE_CDM_REQUEST },
      { type: CLCDMActionTypes.UPDATE_CDM_SUCCESS, payload: commonDMsMock[0] },
    ];

    bundleService.updateCommonDataModel = jest.fn().mockImplementation(() => {
      return commonDMsMock[0];
    });
    await mockStore.dispatch(cdmActions.updateCommonDataModel(commonDMsMock[0]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--adds or updates the cdm ', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.UPDATE_CDM_REQUEST },
      { type: CLCDMActionTypes.UPDATE_CDM_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.updateCommonDataModel = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(cdmActions.updateCommonDataModel(commonDMsMock[0]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('deletes the cdm', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.DELETE_CDM_REQUEST },
      { type: CLCDMActionTypes.DELETE_CDM_SUCCESS },
    ];

    bundleService.deleteCommonDataModel = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(cdmActions.deleteCommonDataModel(commonDMsMock[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--while deleting the cdm ', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.DELETE_CDM_REQUEST },
      { type: CLCDMActionTypes.DELETE_CDM_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.deleteCommonDataModel = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(cdmActions.deleteCommonDataModel(commonDMsMock[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('gets the mappedDMs info of cdm', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM },
      { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_SUCCESS, payload: datamodelsMock },
    ];

    bundleService.getMappedDMsofCDM = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });
    await mockStore.dispatch(cdmActions.getMappedDMsofCDM(commonDMsMock[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--while getting mapped DMs info of the cdm ', async () => {
    const expectedActions = [
      { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM },
      { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getMappedDMsofCDM = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(cdmActions.getMappedDMsofCDM(commonDMsMock[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
