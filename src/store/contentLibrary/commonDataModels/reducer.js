import { Map as ImmutableMap } from 'immutable';
import { CLCDMActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  isFetchingCDMs: false,
  commonDatamodels: [],
  cdmsMap: {},
  isUpdatingCDM: false,
  isDeletingCDM: false,
  isFetchingMappedDMs: false,
  mappedDMs: [],
});

export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case CLCDMActionTypes.FETCH_CDMS_LIST:
      return state.merge({
        isFetchingCDMs: true,
      });
    case CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS: {
      const orderedCDMs = (action.payload?.items || []).sort(
        (dm1, dm2) => Date.parse(dm2.lastUpdated) - Date.parse(dm1.lastUpdated)
      );
      const cdmsInfo = orderedCDMs.reduce((acc, item) => acc.set(item.id, item.name), new Map());

      return state.merge({
        isFetchingCDMs: false,
        commonDatamodels: orderedCDMs,
        cdmsMap: cdmsInfo,
      });
    }
    case CLCDMActionTypes.FETCH_CDMS_LIST_ERROR:
      return state.merge({
        isFetchingCDMs: false,
      });
    case CLCDMActionTypes.UPDATE_CDM_REQUEST:
      return state.merge({
        isUpdatingCDM: true,
      });
    case CLCDMActionTypes.UPDATE_CDM_SUCCESS:
    case CLCDMActionTypes.UPDATE_CDM_ERROR:
      return state.merge({
        isUpdatingCDM: false,
      });

    case CLCDMActionTypes.DELETE_CDM_REQUEST:
      return state.merge({
        isDeletingCDM: true,
      });
    case CLCDMActionTypes.DELETE_CDM_SUCCESS:
    case CLCDMActionTypes.DELETE_CDM_ERROR:
      return state.merge({
        isDeletingCDM: false,
      });

    case CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM:
      return state.merge({
        isFetchingMappedDMs: true,
      });
    case CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_SUCCESS:
      return state.merge({
        isFetchingMappedDMs: false,
        mappedDMs: action.payload,
      });
    case CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_ERROR:
      return state.merge({
        isFetchingMappedDMs: false,
      });

    default:
      return state;
  }
}
