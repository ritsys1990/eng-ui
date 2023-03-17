import { addGlobalError } from '../../errors/actions';
import { CLCDMActionTypes } from './actionTypes';
import bundleService from '../../../services/bundles.service';

export function getAllCommonDataModels() {
  return async dispatch => {
    try {
      dispatch({ type: CLCDMActionTypes.FETCH_CDMS_LIST });
      const result = await bundleService.getAllCommonDataModels();
      dispatch({ type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLCDMActionTypes.FETCH_CDMS_LIST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updateCommonDataModel(commonDM) {
  return async dispatch => {
    try {
      dispatch({ type: CLCDMActionTypes.UPDATE_CDM_REQUEST });
      const result = await bundleService.updateCommonDataModel(commonDM);
      dispatch({ type: CLCDMActionTypes.UPDATE_CDM_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLCDMActionTypes.UPDATE_CDM_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteCommonDataModel(cdmId) {
  return async dispatch => {
    try {
      dispatch({ type: CLCDMActionTypes.DELETE_CDM_REQUEST });
      await bundleService.deleteCommonDataModel(cdmId);
      dispatch({ type: CLCDMActionTypes.DELETE_CDM_SUCCESS });

      return true;
    } catch (err) {
      dispatch({ type: CLCDMActionTypes.DELETE_CDM_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getMappedDMsofCDM(cdmId) {
  return async dispatch => {
    try {
      dispatch({ type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM });
      const result = await bundleService.getMappedDMsofCDM(cdmId);
      dispatch({ type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_SUCCESS, payload: result });

      return true;
    } catch (err) {
      dispatch({ type: CLCDMActionTypes.GET_MAPPED_DMS_OF_CDM_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
