import securityService from '../../services/security.service';
import { SecurityActionTypes } from './actionTypes';
import { addGlobalError } from '../errors/actions';

export function getGlobalPermissions() {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_GLOBAL_PERMISSIONS_REQUEST });
      const permissions = await securityService.getMyGlobalPermissions();
      dispatch({
        type: SecurityActionTypes.GET_GLOBAL_PERMISSIONS_SUCCESS,
        payload: { ...permissions },
      });
    } catch (e) {
      dispatch({
        type: SecurityActionTypes.GET_GLOBAL_PERMISSIONS_ERROR,
        payload: { e },
      });
      throw new Error();
    }
  };
}

export function getEngagementPermissions(engagementId, forceFetch = false) {
  return async (dispatch, getState) => {
    try {
      const currentEngagementId = getState().security.get('currentEngagementId');
      if (forceFetch || currentEngagementId !== engagementId) {
        dispatch({
          type: SecurityActionTypes.GET_ENGAGEMENT_PERMISSIONS_REQUEST,
        });
        const permissions = await securityService.getEngagementPermissions(engagementId);
        dispatch({
          type: SecurityActionTypes.GET_ENGAGEMENT_PERMISSIONS_SUCCESS,
          payload: { permissions, engagementId },
        });
      }
    } catch (e) {
      dispatch(addGlobalError(e));
      dispatch({
        type: SecurityActionTypes.GET_ENGAGEMENT_PERMISSIONS_ERROR,
        payload: { e },
      });
    }
  };
}

export function getEngagementListPermissions(engagementIds, clientId = null) {
  return async dispatch => {
    try {
      dispatch({
        type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_REQUEST,
      });
      let permissionsList = [];
      if (engagementIds?.length > 0) {
        permissionsList = await Promise.all(
          engagementIds.map(async engagementId => {
            const result = { id: engagementId };
            const permissions = await securityService.getEngagementPermissions(engagementId, clientId);
            result.permissions = permissions.pages;

            return result;
          })
        );
      }
      dispatch({
        type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_SUCCESS,
        payload: permissionsList,
      });
    } catch (e) {
      dispatch(addGlobalError(e));
      dispatch({
        type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_ERROR,
      });
    }
  };
}

export function getMe() {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_ME_REQUEST });
      const me = await securityService.getMe();
      dispatch({
        type: SecurityActionTypes.GET_ME_SUCCESS,
        payload: me,
      });

      return me;
    } catch (e) {
      dispatch({ type: SecurityActionTypes.GET_ME_ERROR, payload: { e } });

      return false;
    }
  };
}

export function getMeRoles() {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_ME_ROLES_REQUEST });
      const me = await securityService.getMeRoles();
      dispatch({
        type: SecurityActionTypes.GET_ME_ROLES_SUCCESS,
        payload: {
          app: me.roles,
          clients: me.clients,
          engagements: me.engagements,
        },
      });
    } catch (e) {
      dispatch({
        type: SecurityActionTypes.GET_ME_ROLES_ERROR,
        payload: { e },
      });
    }
  };
}

export function getRoleList(tier) {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_ROLE_LIST_REQUEST });
      const list = await securityService.getRoleList(tier);
      dispatch({
        type: SecurityActionTypes.GET_ROLE_LIST_SUCCESS,
        payload: list,
      });
    } catch (err) {
      dispatch({
        type: SecurityActionTypes.GET_ROLE_LIST_ERROR,
        payload: { err },
      });
    }
  };
}

export function fetchCountries(memberFirmCode, geoCode, globalClient, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_COUNTRIES_REQUEST });
      const countries = await securityService.fetchCountries(memberFirmCode, geoCode, globalClient);
      dispatch({
        type: SecurityActionTypes.GET_COUNTRIES_SUCCESS,
        payload: countries,
      });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: SecurityActionTypes.GET_COUNTRIES_ERROR, error });
    }
  };
}

export function getUnacceptedTOU() {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_UNACCEPTED_TOU });
      const tou = await securityService.getUnacceptedTOU();
      dispatch({ type: SecurityActionTypes.GET_UNACCEPTED_TOU_SUCCESS, payload: tou });
    } catch (err) {
      dispatch({ type: SecurityActionTypes.GET_UNACCEPTED_TOU_ERROR, payload: err });
      dispatch(addGlobalError(err));
    }
  };
}

export function acceptTOU(touName) {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.ACCEPT_TOU });
      const tou = await securityService.acceptTOU(touName);
      dispatch({ type: SecurityActionTypes.ACCEPT_TOU_SUCCESS });

      return tou;
    } catch (err) {
      dispatch({ type: SecurityActionTypes.ACCEPT_TOU_ERROR, payload: err });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getClientPermissions(clientId, forceFetch = false) {
  return async (dispatch, getState) => {
    try {
      const currentClientId = getState().security.get('currentClientId');
      const isFetchingClientPermissions = getState().security.get('gettingClientPermissions');
      if (forceFetch || (currentClientId !== clientId && !isFetchingClientPermissions)) {
        dispatch({ type: SecurityActionTypes.GET_CLIENT_PERMISSIONS });
        const permissions = await securityService.getClientPermissions(clientId);
        dispatch({ type: SecurityActionTypes.GET_CLIENT_PERMISSIONS_SUCCESS, payload: { permissions, clientId } });

        return permissions;
      }

      return getState().security.get('clientPermission');
    } catch (err) {
      dispatch({ type: SecurityActionTypes.GET_CLIENT_PERMISSIONS_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getClientRecertificationStatus(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS });
      const recertification = await securityService.getClientRecertificationStatus(clientId);
      dispatch({ type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_SUCCESS, payload: recertification });
    } catch (err) {
      dispatch({ type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function getClientExternalRecertificationStatus(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS });
      const recertification = await securityService.getClientExternalRecertificationStatus(clientId);
      dispatch({
        type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_SUCCESS,
        payload: recertification,
      });
    } catch (err) {
      dispatch({ type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function getAlertsList() {
  return async dispatch => {
    try {
      dispatch({ type: SecurityActionTypes.GET_ALERTS_INPROGRESS });
      const list = await securityService.getAlertsList();
      dispatch({ type: SecurityActionTypes.GET_ALERTS_SUCCESS, payload: list });
    } catch (err) {
      dispatch({ type: SecurityActionTypes.GET_ALERTS_ERROR, payload: { err } });
      dispatch(addGlobalError(err));
    }
  };
}
