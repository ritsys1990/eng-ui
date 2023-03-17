import clientService from '../../services/client.service';
import securityService from '../../services/security.service';
import stagingService from '../../services/staging.service';
import informaticaService from '../../services/informatica.service';
import dataRequestService from '../../services/data-request.service';
import { generateAddClientCSAError } from '../../utils/errorHelper';
import { addAddClientError, addGlobalError } from '../errors/actions';
import { ClientActionTypes } from './actionTypes';
import { isEmpty } from 'lodash';
import engagementService from 'src/services/engagement.service';
import bundleService from 'src/services/bundles.service';
import { getTranslation } from '../../hooks/useTranslation';
import { EngagementActionTypes } from '../engagement/actionTypes';

export function getClientList(name, limit, offset, updatePerm = true, infinite = false) {
  return async dispatch => {
    try {
      dispatch({
        type: infinite ? ClientActionTypes.GET_INFINITE_LIST_REQUEST : ClientActionTypes.GET_LIST_REQUEST,
      });
      const clients = await clientService.getPaginationList(name, limit, offset, updatePerm);
      dispatch({
        type: infinite ? ClientActionTypes.GET_INFINITE_LIST_SUCCESS : ClientActionTypes.GET_LIST_SUCCESS,
        payload: clients,
      });
    } catch (e) {
      dispatch(addGlobalError(e));
      dispatch({ type: ClientActionTypes.GET_LIST_ERROR, payload: { e } });
    }
  };
}

export function getMyClientList() {
  return async dispatch => {
    try {
      dispatch({
        type: ClientActionTypes.GET_MY_LIST_REQUEST,
      });
      const clients = await clientService.getMyClientsList();
      dispatch({
        type: ClientActionTypes.GET_MY_LIST_SUCCESS,
        payload: clients,
      });

      return clients;
    } catch (e) {
      dispatch(addGlobalError(e));
      dispatch({ type: ClientActionTypes.GET_MY_LIST_ERROR, payload: { e } });

      return false;
    }
  };
}

export function getMatClientsSearch(query, count, memberFirmCode, globalClient, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_MAT_SEARCH_REQUEST });
      const matClients = await clientService.searchMatClients(query, count, memberFirmCode, globalClient);
      dispatch({
        type: ClientActionTypes.GET_MAT_SEARCH_SUCCESS,
        payload: matClients,
      });
    } catch (e) {
      dispatch(errorAction(e));
      dispatch({
        type: ClientActionTypes.GET_MAT_SEARCH_ERROR,
        payload: { e },
      });
    }
  };
}

export function createClient(client) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_REQUEST });
      const newClient = await clientService.createClient(client);
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_SUCCESS });

      return newClient;
    } catch (err) {
      let csaUsers = [];
      const content = getState().settings.get('content');
      const { t } = getTranslation(content);

      try {
        csaUsers = await clientService.getCSAUsers(client.name);
        if (csaUsers.length > 0) {
          err.message = generateAddClientCSAError(err, csaUsers, t);
        }
      } catch (err2) {
        dispatch(addAddClientError(err2));
      }
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_ERROR, payload: err });
      dispatch(addAddClientError(err));
    }

    return false;
  };
}

export function createClientUser(clientId, user, isExternal) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_USER_REQUEST });
      if (isExternal) {
        await securityService.createClientExternalUser(clientId, user);
      } else {
        await securityService.createClientUser(clientId, user);
      }
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_USER_SUCCESS });

      return true;
    } catch (err) {
      dispatch({
        type: ClientActionTypes.CREATE_CLIENT_USER_ERROR,
        payload: err,
      });
      dispatch(addAddClientError(err));
    }

    return false;
  };
}

export function loadAgents(orgId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.ORG_AGENTS_GET_REQUEST });

      let agents = await informaticaService.getAgents(orgId);
      const dataRequestsBySecureAgents = await Promise.all(
        agents.map(subOrg => dataRequestService.dataRequestsByAgentId(subOrg.id))
      ).then(response => {
        const final = [];
        response.forEach(req => {
          req.forEach(element => final.push(element));
        });

        return final;
      });

      if (agents?.length > 0) {
        agents = await Promise.all(
          agents.map(async agent => {
            const result = { ...agent };
            result.subOrg = await informaticaService.getOrg(agent.orgId);

            return result;
          })
        );
      }

      dispatch({
        type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_SUCCESS,
        payload: { agents, dataRequestsBySecureAgents },
      });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function loadOrgWithSubOrgTokens(orgId) {
  return async dispatch => {
    try {
      if (!orgId) {
        return dispatch({ type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: { org: null } });
      }
      dispatch({ type: ClientActionTypes.ORG_GET_REQUEST });
      const org = await informaticaService.getOrgWithSubOrgTokens(orgId);
      dispatch({ type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: org });
      await dispatch(loadAgents(orgId));

      return org;
    } catch (err) {
      dispatch({ type: ClientActionTypes.ORG_GET_REQUEST_ERROR, payload: err });
      dispatch(addGlobalError(err));
    }

    return false;
  };
}

export function resetOrg() {
  return async dispatch => {
    dispatch({ type: ClientActionTypes.ORG_RESET });
  };
}

export function getClientById(id, showGlobalError = true) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_CLIENT_REQUEST });
      const client = await clientService.getClientById(id);
      dispatch({ type: ClientActionTypes.GET_CLIENT_SUCCESS, payload: client });
      await dispatch(loadOrgWithSubOrgTokens(client.orgId));

      return client;
    } catch (err) {
      dispatch({ type: ClientActionTypes.GET_CLIENT_ERROR, payload: { id } });
      if (showGlobalError) {
        dispatch(addGlobalError(err));
      } else {
        throw err;
      }

      return false;
    }
  };
}

/**
 * Get a client based on it's id, checking the myClientsList first
 *
 * @param {*} id
 */
export function getMyClientById(id) {
  return async (dispatch, getState) => {
    try {
      let myClients = getState().client.get('myList');
      const storeClient = getState().client.get('client');

      if (storeClient?.id === id) return storeClient;

      dispatch({ type: ClientActionTypes.GET_CLIENT_REQUEST });

      if (isEmpty(myClients)) {
        myClients = await dispatch(getMyClientList());
      }

      let client = null;

      if (isEmpty(myClients)) {
        client = await dispatch(getClientById(id));
      } else {
        const currentClient = myClients.find(e => e.id === id);
        if (currentClient) {
          client = currentClient;
        } else {
          client = await dispatch(getClientById(id));
        }
      }

      dispatch({ type: ClientActionTypes.GET_CLIENT_SUCCESS, payload: client });

      return client;
    } catch (err) {
      dispatch({ type: ClientActionTypes.GET_CLIENT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function setClient(client) {
  return async dispatch => {
    dispatch({
      type: ClientActionTypes.SET_CLIENT,
      payload: client,
    });
  };
}

export function downloadNotices(clear, link, component, type = 'application/pdf') {
  return async dispatch => {
    try {
      if (clear) {
        dispatch({
          type: ClientActionTypes.GET_NOTICES_BLOB_SUCCESS,
          payload: { caller: component },
        });
      } else {
        dispatch({ type: ClientActionTypes.GET_NOTICES_BLOB_REQUEST });
        const buffer = await stagingService.stagingGetFileDL(link);
        const blob = new Blob([buffer], { type });
        dispatch({
          type: ClientActionTypes.GET_NOTICES_BLOB_SUCCESS,
          payload: { file: blob, caller: component },
        });
      }
    } catch (err) {
      dispatch({
        type: ClientActionTypes.GET_NOTICES_BLOB_ERROR,
        payload: { caller: component },
      });
      dispatch(addGlobalError(err));
    }
  };
}

export function deleteClient(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_REQUEST });
      await clientService.deleteClient(clientId);
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_SUCCESS, payload: clientId });
    } catch (err) {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ERROR, payload: err });
      dispatch(addGlobalError(err));
    }

    return true;
  };
}

export function createClientStorage(clientId, showError) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_STORAGE });
      await clientService.createStorage(clientId);
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_STORAGE_SUCCESS });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_STORAGE_ERROR, payload: err });
      if (showError) {
        dispatch(addAddClientError(err));
      } else {
        throw err;
      }
    }

    return false;
  };
}

export function getClientDataSources(clientId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ClientActionTypes.GET_CLIENT_DATA_SOURCES });
      const currentClient = getState().client.get('client');
      let dataSources = await engagementService.getDataSourcesByClient(clientId);
      if (dataSources?.length > 0) {
        const { items: sourceSystems } = await bundleService.getSourceSystemNames();
        const entities = currentClient?.entities || (await clientService.getEntities(clientId));
        dataSources = await Promise.all(
          dataSources.map(async ds => {
            const result = { ...ds };
            if (ds.sourceId && sourceSystems?.length > 0) {
              const system = sourceSystems.filter(x => x.versions?.filter(y => y.id === ds.sourceId).length > 0)[0];
              const version = system?.versions.filter(x => x.id === ds.sourceId)[0];
              result.sourceName = system?.name;
              result.sourceVersion = version?.versionName;
            }
            result.subscriptions = await engagementService.getDataSourcesSubscriptions(ds.id);
            if (ds.entityIds?.length > 0 && entities?.length > 0) {
              result.entities = entities?.filter(x => ds.entityIds.indexOf(x.id) > -1);
            }

            return result;
          })
        );
      }
      dispatch({ type: ClientActionTypes.GET_CLIENT_DATA_SOURCES_SUCCESS, payload: dataSources });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.GET_CLIENT_DATA_SOURCES_ERROR, payload: err });
      dispatch(addGlobalError(err));
    }

    return false;
  };
}

export function getClientDSConnections(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS });
      let dataSources = await engagementService.getDataSourcesByClient(clientId);
      if (dataSources?.length > 0) {
        dataSources = await Promise.all(
          dataSources.map(async ds => {
            const result = { ...ds };
            result.connections = await engagementService.getDataSourcesConnections(ds.id);

            return result;
          })
        );
      }
      dispatch({ type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_SUCCESS, payload: dataSources });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_ERROR, payload: err });
      dispatch(addGlobalError(err));
    }

    return false;
  };
}

export function getMatClient(matClientId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_MAT_CLIENT });
      const matClient = await clientService.getMatClient(matClientId);
      dispatch({ type: ClientActionTypes.GET_MAT_CLIENT_SUCCESS, payload: matClient });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: ClientActionTypes.GET_MAT_CLIENT_ERROR, payload: error });
    }
  };
}

export function resetMatClientDetails() {
  return async dispatch => {
    dispatch({ type: ClientActionTypes.RESET_MAT_CLIENT });
    dispatch({ type: ClientActionTypes.RESET_MAT_CLIENT_ENTITIES });
    dispatch({ type: EngagementActionTypes.RESET_MAT_CLIENT_ENGAGEMENTS });
  };
}

export function getMatClientEntities(matClientId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES });
      const matClientEntities = await clientService.getMatClientEntities(matClientId);
      dispatch({ type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES_SUCCESS, payload: matClientEntities });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES_ERROR, payload: error });
    }
  };
}

export function saveClient(client, errorAction = addGlobalError, matClientName = null) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ClientActionTypes.CLIENT_PUT_REQUEST });
      const updatedClient = await clientService.saveClient(client);
      dispatch({ type: ClientActionTypes.CLIENT_PUT_REQUEST_SUCCESS, payload: updatedClient });

      return updatedClient;
    } catch (err) {
      let csaUsers = [];
      const content = getState().settings.get('content');
      const { t } = getTranslation(content);

      try {
        csaUsers = await clientService.getCSAUsers(matClientName || client.name);
        if (csaUsers.length > 0) {
          err.message = generateAddClientCSAError(err, csaUsers, t);
        }
      } catch (err2) {
        dispatch(errorAction(err2));
      }
      dispatch({ type: ClientActionTypes.CLIENT_PUT_REQUEST_ERROR, payload: err });
      dispatch(errorAction(err));

      return false;
    }
  };
}

export function updateClientSetupStepStatus(step, isCompleted = false) {
  return async (dispatch, getState) => {
    const currentState = { ...getState().client.get('clientSetupState') };
    switch (step) {
      case 1:
        currentState.isStep1Completed = isCompleted;
        break;
      case 2:
        currentState.isStep2Completed = isCompleted;
        break;
      case 3:
        currentState.isStep3Completed = isCompleted;
        break;
      case 4:
        currentState.isStep4Completed = isCompleted;
        break;
      case 5:
        currentState.isStep5Completed = isCompleted;
        break;
      case 6:
        currentState.isStep6Completed = isCompleted;
        break;
      default:
    }

    dispatch({ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: currentState });
  };
}

export function addClientDomain(clientId, domainName) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.ADD_CLIENT_DOMAIN });
      const domain = await clientService.addDomain(clientId, domainName);
      dispatch({ type: ClientActionTypes.ADD_CLIENT_DOMAIN_SUCCESS, payload: domain });

      return domain;
    } catch (err) {
      dispatch({ type: ClientActionTypes.ADD_CLIENT_DOMAIN_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteClientDomain(clientId, domainName) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_DOMAIN });
      const domain = await clientService.deleteDomain(clientId, domainName);
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_DOMAIN_SUCCESS, payload: domain });

      return domain;
    } catch (err) {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_DOMAIN_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function addEntity(clientId, entity) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.ADD_CLIENT_ENTITY });
      await clientService.addEntity(clientId, entity);
      const client = await clientService.getClientById(clientId);
      dispatch({ type: ClientActionTypes.ADD_CLIENT_ENTITY_SUCCESS, payload: client });
    } catch (err) {
      dispatch({ type: ClientActionTypes.ADD_CLIENT_ENTITY_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function editEntity(clientId, entity) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.EDIT_CLIENT_ENTITY });
      await clientService.saveEntity(clientId, entity);
      const client = await clientService.getClientById(clientId);
      dispatch({ type: ClientActionTypes.EDIT_CLIENT_ENTITY_SUCCESS, payload: client });
    } catch (err) {
      dispatch({ type: ClientActionTypes.EDIT_CLIENT_ENTITY_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function deleteEntity(clientId, entityId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ENTITY });
      await clientService.deleteEntity(clientId, entityId);
      const client = await clientService.getClientById(clientId);
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ENTITY_SUCCESS, payload: client });
    } catch (err) {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ENTITY_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function resetMatEntities() {
  return async dispatch => {
    dispatch({ type: ClientActionTypes.RESET_MAT_CLIENT_ENTITIES });
  };
}

export function deleteClientOrg(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ORG });
      await clientService.deleteClientOrg(clientId);
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ORG_SUCCESS, payload: [] });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.DELETE_CLIENT_ORG_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function createClientOrg(clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_ORG });
      const client = await clientService.createClientOrg(clientId);

      const org = await informaticaService.getOrgWithSubOrgTokens(client.orgId);
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_ORG_SUCCESS, payload: { org, client } });

      return org;
    } catch (err) {
      dispatch({ type: ClientActionTypes.CREATE_CLIENT_ORG_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function linkToExistingOrg(orgId, clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.SUBORG_CREATE_REQUEST });
      const org = await informaticaService.getOrg(orgId);

      await clientService.mapClientToOrg(clientId, orgId);

      await dispatch(getClientById(clientId));
      dispatch({ type: ClientActionTypes.SUBORG_CREATE_REQUEST_SUCCESS, payload: org });

      return org;
    } catch (err) {
      dispatch({ type: ClientActionTypes.SUBORG_CREATE_REQUEST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function addDataSource(dataSource) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.ADD_DATA_SOURCE });
      await engagementService.updateDataSource(dataSource);
      dispatch({ type: ClientActionTypes.ADD_DATA_SOURCE_SUCCESS });
      dispatch(getClientDataSources(dataSource.clientId));

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.ADD_DATA_SOURCE_ERROR, payload: err });
    }

    return false;
  };
}

export function addDataSourceReset() {
  return async dispatch => {
    dispatch({ type: ClientActionTypes.ADD_DATA_SOURCE_RESET });
  };
}

export function createSubOrg(name, entityIds, clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST });
      const subOrg = await clientService.postSubOrg(clientId, { name });
      const token = await informaticaService.getToken(subOrg.id);
      if (token) {
        subOrg.installToken = token;
      }
      await clientService.updateSubOrg(clientId, subOrg.id, { name, entityIds });

      dispatch(getClientById(clientId));
      dispatch({ type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_SUCCESS, payload: subOrg });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updateSubOrg(clientId, subOrgId, name, entityIds) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST });
      const subOrg = await clientService.updateSubOrg(clientId, subOrgId, { name, entityIds });
      dispatch(getClientById(clientId));
      dispatch({ type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_SUCCESS, payload: subOrg });

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteSubOrg(clientId, subOrgId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.DELETE_SUBORG_REQUEST });
      await clientService.deleteSubOrg(clientId, subOrgId);
      dispatch(getClientById(clientId));
      dispatch({ type: ClientActionTypes.DELETE_SUBORG_REQUEST_SUCCESS });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: ClientActionTypes.DELETE_SUBORG_REQUEST_ERROR });
    }
  };
}

export function generateToken(subOrgId, orgId, regenerate) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.SUBORG_TOKEN_REQUEST });
      let response;
      if (regenerate) {
        response = await informaticaService.getTokenWithForceRefresh(subOrgId);
      } else {
        response = await informaticaService.getToken(subOrgId);
      }
      const org = await informaticaService.getOrgWithSubOrgTokens(orgId);
      org.subOrgs.forEach(subOrg => {
        if (subOrg.id === subOrgId) {
          subOrg.installToken = response; // eslint-disable-line no-param-reassign
          dispatch({ type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: org });
        }
      });

      dispatch({ type: ClientActionTypes.SUBORG_TOKEN_REQUEST_SUCCESS });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: ClientActionTypes.SUBORG_TOKEN_REQUEST_ERROR });

      return false;
    }
  };
}

export function updateDataSource(dataSource) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.UPDATE_DATA_SOURCE });
      await engagementService.updateDataSource(dataSource);
      dispatch({ type: ClientActionTypes.UPDATE_DATA_SOURCE_SUCCESS });
      dispatch(getClientDataSources(dataSource.clientId));

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.UPDATE_DATA_SOURCE_ERROR, payload: err });
    }

    return false;
  };
}

export function deleteDataSource(dataSource) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.DELETE_DATA_SOURCE });
      await engagementService.deleteDataSource(dataSource.id);
      dispatch({ type: ClientActionTypes.DELETE_DATA_SOURCE_SUCCESS });
      dispatch(getClientDataSources(dataSource.clientId));

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.DELETE_DATA_SOURCE_ERROR });
      dispatch(addGlobalError(err));
    }

    return false;
  };
}

export function getConnectionRuntimeEnvironments(clientId, entityId, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT });
      const entity = await clientService.getEntity(clientId, entityId);
      let runtimeEnvironmentList;
      if (entity?.subOrgId) {
        runtimeEnvironmentList = await informaticaService.getRuntimeEnvironments(entity?.subOrgId);
      }
      dispatch({ type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_SUCCESS, payload: runtimeEnvironmentList });
    } catch (err) {
      dispatch({ type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_ERROR, payload: err });
      dispatch(errorAction(err));
    }
  };
}

export function getAllPublishedConnTemp() {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.GET_CON_TEMP_PUBLISHED });
      const connectionTemplateList = await bundleService.fetchAllPublishedConTemp();
      dispatch({ type: ClientActionTypes.GET_CON_TEMP_PUBLISHED_SUCCESS, payload: connectionTemplateList });
    } catch (err) {
      dispatch({ type: ClientActionTypes.GET_CON_TEMP_PUBLISHED_ERROR, payload: err });
      dispatch(addGlobalError(err));
    }
  };
}

export function createConnection(data, clientId, isUpdate) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION });
      const connection = await engagementService.createDataSourceConnection(data, isUpdate);
      dispatch({ type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_SUCCESS, payload: connection });
      dispatch(getClientDSConnections(clientId));

      return true;
    } catch (err) {
      dispatch({ type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_ERROR, payload: err });

      return false;
    }
  };
}

export function testConnection(data) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.TEST_CONNECTION_REQUEST });
      const connectionList = await engagementService.testConnection(data);
      dispatch({ type: ClientActionTypes.TEST_CONNECTION_REQUEST_SUCCESS, payload: connectionList });

      return connectionList;
    } catch (error) {
      dispatch({ type: ClientActionTypes.TEST_CONNECTION_REQUEST_ERROR, payload: error });

      return false;
    }
  };
}

export function testExistingConnection(id) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.TEST_CONNECTION_REQUEST });
      const connectionList = await engagementService.testExistingConnection(id);
      dispatch({ type: ClientActionTypes.TEST_CONNECTION_REQUEST_SUCCESS, payload: connectionList });

      return connectionList;
    } catch (error) {
      dispatch({ type: ClientActionTypes.TEST_CONNECTION_REQUEST_ERROR });
      dispatch(addGlobalError(error));

      return false;
    }
  };
}

export function setConnectionsAsDefault(id, clientId) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT });
      await engagementService.setConnectionsAsDefault(id);
      dispatch({ type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT_SUCCESS });
      dispatch(getClientDSConnections(clientId));

      return true;
    } catch (error) {
      dispatch({ type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT_ERROR });
      dispatch(addGlobalError(error));

      return false;
    }
  };
}

export function updateClientUsesSecureAgent(clientId, usesSecureAgent = false) {
  return async dispatch => {
    try {
      dispatch({ type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT });
      const client = await clientService.updateClientUsesSecureAgent(clientId, usesSecureAgent);
      dispatch({ type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_SUCCESS, payload: client });

      return true;
    } catch (error) {
      dispatch({ type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_ERROR });
      dispatch(addGlobalError(error));

      return false;
    }
  };
}
