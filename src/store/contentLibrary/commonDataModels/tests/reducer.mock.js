import { initialState } from '../reducer';
import { CLCDMActionTypes } from '../actionTypes';
import { commonDMsMock, datamodelsMock } from './commonDMs.mock';

export const commonDMsReducerMock = {
  initialState,
  fetchCDMs: {
    expectedState: initialState.merge({
      isFetchingCDMs: true,
    }),
    action: { type: CLCDMActionTypes.FETCH_CDMS_LIST },
  },
  fetchCDMsSuccess: {
    expectedState: initialState.merge({
      isFetchingCDMs: false,
      commonDatamodels: commonDMsMock,
      cdmsMap: commonDMsMock.reduce((acc, item) => acc.set(item.id, item.name), new Map()),
    }),
    action: { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: { items: commonDMsMock } },
  },
  fetchCDMsFailure: {
    expectedState: initialState.merge({
      isFetchingCDMs: false,
    }),
    action: { type: CLCDMActionTypes.FETCH_CDMS_LIST_ERROR },
  },
  updateCDM: {
    expectedState: initialState.merge({
      isUpdatingCDM: true,
    }),
    action: { type: CLCDMActionTypes.UPDATE_CDM_REQUEST },
  },
  updateCDMSuccess: {
    expectedState: initialState.merge({
      isUpdatingCDM: false,
    }),
    action: { type: CLCDMActionTypes.UPDATE_CDM_SUCCESS },
  },
  updateCDMFailure: {
    expectedState: initialState.merge({
      isUpdatingCDM: false,
    }),
    action: { type: CLCDMActionTypes.UPDATE_CDM_ERROR },
  },
  deleteCDM: {
    expectedState: initialState.merge({
      isDeletingCDM: true,
    }),
    action: { type: CLCDMActionTypes.DELETE_CDM_REQUEST },
  },
  deleteCDMSuccess: {
    expectedState: initialState.merge({
      isDeletingCDM: false,
    }),
    action: { type: CLCDMActionTypes.DELETE_CDM_SUCCESS },
  },
  deleteCDMFailure: {
    expectedState: initialState.merge({
      isDeletingCDM: false,
    }),
    action: { type: CLCDMActionTypes.DELETE_CDM_ERROR },
  },
  getMappedDMsofCDM: {
    expectedState: initialState.merge({
      isFetchingMappedDMs: true,
    }),
    action: { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM },
  },
  getMappedDMsofCDMSucess: {
    expectedState: initialState.merge({
      isFetchingMappedDMs: false,
      mappedDMs: datamodelsMock,
    }),
    action: { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_SUCCESS, payload: datamodelsMock },
  },
  getMappedDMsofCDMFailure: {
    expectedState: initialState.merge({
      isFetchingMappedDMs: false,
    }),
    action: { type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_ERROR },
  },
};
