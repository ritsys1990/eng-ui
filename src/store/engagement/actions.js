import engagementService from '../../services/engagement.service';
import securityService from '../../services/security.service';
import analyticsUIService from '../../services/analytics-ui.service';
import { addGlobalError } from '../errors/actions';
import { EngagementActionTypes } from './actionTypes';
import { NETWORK_ERROR, ROLLFORWARD_TIMEOUT } from './constants';

export function getEngagementById(id) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_ENGAGEMENT_REQUEST });
      const engagement = await engagementService.getEngagementById(id);
      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_SUCCESS,
        payload: engagement,
      });

      return engagement;
    } catch (err) {
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getMyEngagementsByClient(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_ENGAGEMENT_LIST_REQUEST });
      const list = await engagementService.getMyEngagementsByClient(clientId);
      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_LIST_SUCCESS,
        payload: list,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_LIST_ERROR,
        payload: { err },
      });
    }
  };
}

export function getMyEngagementsUserRole(engagementId) {
  return async dispatch => {
    try {
      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_REQUEST,
      });
      const list = await securityService.getMyEngagementsUserRole(engagementId);
      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_SUCCESS,
        payload: list,
      });

      return list;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_ERROR,
        payload: { err },
      });

      return false;
    }
  };
}

export function getDMTDetails(workPaperId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_DMT_DATA });

      const inputs = await analyticsUIService.getWorkPaperInputs(workPaperId);

      dispatch({
        type: EngagementActionTypes.GET_DMT_DATA_SUCCESS,
        payload: inputs,
      });

      return inputs;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: EngagementActionTypes.GET_DMT_DATA_ERROR });

      return false;
    }
  };
}

export function initiateLegalhold(engagementId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.INITIATE_LEGAL_HOLD });
      await engagementService.initiateLegalhold(engagementId);

      return true;
    } catch (err) {
      dispatch({ type: EngagementActionTypes.INITIATE_LEGAL_HOLD_ERROR, payload: { err } });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function setEngagement(engagement) {
  return async dispatch => {
    dispatch({
      type: EngagementActionTypes.SET_ENGAGEMENT,
      payload: engagement,
    });
  };
}

export function getEngagementsByClient(clientId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST });
      const { items } = await engagementService.getEngagementsByClient(clientId);
      const areEngagementsReconciled = items?.every(engagement => engagement.matId);
      const areEngagementsSynchedToOmnia = items?.every(engagement => engagement?.linkedOmniaEngagements.length);
      dispatch({
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS,
        payload: { engagements: items, areEngagementsReconciled, areEngagementsSynchedToOmnia },
      });
    } catch (err) {
      dispatch(errorAction(err));
      dispatch({
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_ERROR,
        payload: err,
      });
    }
  };
}

export function getMatClientEngagements(matClientId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS });
      const matClientEngagements = await engagementService.getMatClientEngagements(matClientId);
      dispatch({ type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_SUCCESS, payload: matClientEngagements });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_ERROR, payload: error });
    }
  };
}

export function getMatGlobalClientEngagements(matCustomerNumber, matClientId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_MAT_GLOBAL_CLIENT_ENGAGEMENTS });
      const matGlobalClientEngagements = await engagementService.getMatGlobalClientEngagements(
        matCustomerNumber,
        matClientId
      );
      dispatch({ type: EngagementActionTypes.GET_MAT_GLOBAL_CLIENT_ENGAGEMENTS, payload: matGlobalClientEngagements });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: EngagementActionTypes.GET_MAT_GLOBAL_CLIENT_ENGAGEMENTS_ERROR, payload: error });
    }
  };
}

export function addNewEngagement(payload, editMode = false, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.ADD_NEW_ENGAGEMENTS });
      let selectedEngagement = null;

      if (editMode) {
        const engagementDetails = await engagementService.getEngagementById(payload?.id);
        selectedEngagement = {
          ...engagementDetails,
          ...payload,
        };
      } else {
        selectedEngagement = payload;
      }

      const engagement = await engagementService.addNewEngagement(selectedEngagement);
      dispatch({ type: EngagementActionTypes.ADD_NEW_ENGAGEMENTS_SUCCESS, payload: engagement });
      dispatch(getEngagementsByClient(payload?.clientId));

      return engagement;
    } catch (error) {
      dispatch({ type: EngagementActionTypes.ADD_NEW_ENGAGEMENTS_ERROR, payload: error });
      dispatch(errorAction(error));

      return false;
    }
  };
}

export function createEngagementUser(engagementId, user, isExternal, editMode = false, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_REQUEST });
      if (!isExternal && !editMode) {
        await securityService.createEngagementUser(engagementId, user);
      }
      dispatch({ type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_SUCCESS });

      return true;
    } catch (error) {
      dispatch({
        type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_ERROR,
        payload: error,
      });
      dispatch(errorAction(error));
    }

    return false;
  };
}

export function rollforwardEngagement(payload, confirmed = false, errorAction = addGlobalError) {
  return async dispatch => {
    const startTime = Date.now();
    try {
      dispatch({ type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT });

      const engagement = await engagementService.rollforwardEngagement(payload, confirmed);
      dispatch({ type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_SUCCESS, payload: engagement });
      dispatch(getEngagementsByClient(payload?.clientId));

      return true;
    } catch (error) {
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      // This will pass if the timeout is equals or bigger than the azure timeout for the roll forward so the user
      // knows that the roll forward is still in progress
      if (error.message === NETWORK_ERROR && elapsedTime >= ROLLFORWARD_TIMEOUT) {
        dispatch({ type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_SUCCESS, payload: {} });
        dispatch(getEngagementsByClient(payload?.clientId));

        return true;
      }
      dispatch({ type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_ERROR, payload: error });
      dispatch(errorAction(error));

      return false;
    }
  };
}

export function editEngagementDetails(payload) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.EDIT_NEW_ENGAGEMENT });
      const engagement = await engagementService.getMatClientEngagements(payload);
      dispatch({ type: EngagementActionTypes.EDIT_NEW_ENGAGEMENT_SUCCESS, payload: engagement });
      dispatch(getEngagementsByClient(payload.clientId));
    } catch (error) {
      dispatch({ type: EngagementActionTypes.EDIT_NEW_ENGAGEMENT_ERROR, payload: error });
    }
  };
}

export function reconcileEngagements(engagements, clientId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.RECONCILE_ENGAGEMENTS });
      await engagementService.reconсileEngagements(engagements);
      dispatch({ type: EngagementActionTypes.RECONCILE_ENGAGEMENTS_SUCCESS });
      dispatch(getEngagementsByClient(clientId));

      return true;
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: EngagementActionTypes.RECONCILE_ENGAGEMENTS_ERROR, payload: error });

      return false;
    }
  };
}

export function updateIsReconcileModalOpen(isOpen) {
  return async dispatch => {
    dispatch({ type: EngagementActionTypes.UPDATE_IS_RECONCILE_MODAL_OPEN, payload: isOpen });
  };
}

export function provisionEngagements(engagements) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.PROVISION_ENGAGEMENTS });
      const engagementIds = [];
      engagements.forEach(eng => engagementIds.push(eng.id));
      await engagementService.provisionEngagement(engagementIds);
      dispatch({ type: EngagementActionTypes.PROVISION_ENGAGEMENTS_SUCCESS });

      return true;
    } catch (err) {
      dispatch({ type: EngagementActionTypes.PROVISION_ENGAGEMENTS_ERROR });

      return err;
    }
  };
}

export function deleteEngagement(engagementId, clientId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.DELETE_ENGAGEMENT });
      await engagementService.deleteEngagement(engagementId);
      dispatch({ type: EngagementActionTypes.DELETE_ENGAGEMENT_SUCCESS });
      dispatch(getEngagementsByClient(clientId));
    } catch (err) {
      dispatch({ type: EngagementActionTypes.DELETE_ENGAGEMENT_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function approveDataSourceSubscription(dataSourceId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION });
      await engagementService.approveDataSourceSubscription(dataSourceId);
      dispatch({ type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_SUCCESS });

      return true;
    } catch (err) {
      dispatch({ type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function rejectDataSourceSubscription(dataSource, rejectionReason) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION });
      const payload = {
        ...dataSource,
        rejectionReason,
      };
      await engagementService.rejectDataSourceSubscription(payload);
      dispatch({ type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_SUCCESS });
    } catch (err) {
      dispatch({ type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function configureDataSourceExtractionScript(dataSourceId, schemaName, databaseType) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT });
      await engagementService.configureDataSourceExtractionScript(dataSourceId, { schemaName, databaseType });
      dispatch({ type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_SUCCESS });

      return true;
    } catch (err) {
      dispatch({ type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteDataSourceConfig(dataSourceId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG });
      await engagementService.deleteDataSourceConfig(dataSourceId);
      dispatch({ type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_SUCCESS });

      return true;
    } catch (err) {
      dispatch({ type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteConnection(connectionId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.DELETE_CONNECTION });
      await engagementService.deleteConnection(connectionId);
      dispatch({ type: EngagementActionTypes.DELETE_CONNECTION_SUCCESS });
    } catch (err) {
      dispatch({ type: EngagementActionTypes.DELETE_CONNECTION_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function getEngagementRenameStatus(engagementId) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.GET_ENGAGEMENT_RENAME_STATUS_REQUEST });
      const data = await engagementService.getEngagementRenameStatus(engagementId);

      dispatch({
        type: EngagementActionTypes.GET_ENGAGEMENT_RENAME_STATUS_SUCCESS,
        payload: data,
      });

      return data;
    } catch (err) {
      dispatch({ type: EngagementActionTypes.GET_ENGAGEMENT_RENAME_STATUS_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updatepathEngagementPath(engagementId, clientId, email) {
  return async dispatch => {
    try {
      dispatch({ type: EngagementActionTypes.UPDATE_ENGAGEMENT_PATH });
      await engagementService.updatepathEngagementPath(engagementId, clientId, email);
      dispatch({ type: EngagementActionTypes.UPDATE_ENGAGEMENT_PATH_SUCCESS });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: EngagementActionTypes.UPDATE_ENGAGEMENT_PATH_ERROR, payload: { err } });

      return false;
    }
  };
}
