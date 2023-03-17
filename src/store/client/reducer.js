import { Map as ImmutableMap } from 'immutable';
import { ClientActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  list: [],
  fetchingList: false,
  myList: [],
  runtimeEnvironmentList: [],
  fetchingRuntimeData: false,
  connectionTemplateList: [],
  fetchingConnTempData: false,
  fetchingMyList: false,
  matSearch: [],
  fetchingMatSearch: false,
  createClientInProgress: false,
  createClientUserInProgress: false,
  retrieveClientUserInProgress: false,
  createStorageInProgress: false,
  client: null,
  fetchingClient: false,
  fetchingNotices: false,
  noticesBlob: null,
  isDeletingClient: false,
  dataSources: [],
  isFetchingDataSources: false,
  dSConnections: [],
  isFetchingDSConnections: false,
  matClient: null,
  isFetchingMatClient: false,
  matClientEntities: [],
  isFetchingMatClientEntities: false,
  isSavingClient: false,
  clientSavingError: false,
  isGettingOrg: false,
  org: null,
  clientSetupState: {
    isStep1Completed: false,
    isStep2Completed: false,
    isStep3Completed: false,
    isStep4Completed: false,
    isStep5Completed: false,
    isStep6Completed: false,
  },
  addingDomain: false,
  deletingDomain: false,
  domain: null,
  isDeletingOrg: false,
  isCreatingOrg: false,
  isLinkingOrg: false,
  isAddingEntity: false,
  isCreatingSubOrg: false,
  subOrg: null,
  isDeletingSubOrg: false,
  isSavingDataSource: false,
  isDeletingDataSource: false,
  saveDataSourceError: null,
  isEntitySaving: false,
  isDeletingEntity: false,
  subOrgToken: null,
  isGettingAgents: false,
  agents: null,
  isCreatingDataSourceConnection: false,
  createDataSourceConnectionError: [],
  isTestResultError: [],
  isTestingConnection: false,
  connectionList: null,
  isSettingConnectionAsDefault: false,
  isUpdatingClientUsesSecureAgent: false,
});

export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case ClientActionTypes.GET_LIST_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingList: true,
          list: [],
        })
      );

    case ClientActionTypes.GET_LIST_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingList: false,
          list: action.payload || [],
        })
      );

    case ClientActionTypes.GET_INFINITE_LIST_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingList: true,
        })
      );

    case ClientActionTypes.GET_INFINITE_LIST_SUCCESS:
      const list = { ...state.get('list') };

      if (list.items && list.totalCount && list.items.length < list.totalCount && action.payload.items) {
        list.items = [...list.items, ...action.payload.items];
      }

      return state.merge(
        ImmutableMap({
          fetchingList: false,
          list: list || state.get('list'),
        })
      );

    case ClientActionTypes.GET_LIST_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingList: false,
        })
      );

    case ClientActionTypes.GET_MY_LIST_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingMyList: true,
          myList: [],
        })
      );

    case ClientActionTypes.GET_MY_LIST_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingMyList: false,
          myList: action.payload || [],
        })
      );

    case ClientActionTypes.GET_MY_LIST_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingMyList: false,
        })
      );

    case ClientActionTypes.GET_MAT_SEARCH_REQUEST:
      return state.merge(
        ImmutableMap({
          matSearch: [],
          fetchingMatSearch: true,
        })
      );

    case ClientActionTypes.GET_MAT_SEARCH_SUCCESS:
      return state.merge(
        ImmutableMap({
          matSearch: action.payload,
          fetchingMatSearch: false,
        })
      );

    case ClientActionTypes.GET_MAT_SEARCH_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingMatSearch: false,
        })
      );

    case ClientActionTypes.CREATE_CLIENT_REQUEST:
      return state.merge({
        createClientInProgress: true,
      });

    case ClientActionTypes.CREATE_CLIENT_SUCCESS:
    case ClientActionTypes.CREATE_CLIENT_ERROR:
      return state.merge({
        createClientInProgress: false,
      });

    case ClientActionTypes.CREATE_CLIENT_USER_REQUEST:
      return state.merge({
        createClientUserInProgress: true,
      });

    case ClientActionTypes.CREATE_CLIENT_USER_SUCCESS:
    case ClientActionTypes.CREATE_CLIENT_USER_ERROR:
      return state.merge({
        createClientUserInProgress: false,
      });

    case ClientActionTypes.GET_CLIENT_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingClient: true,
          retrieveClientUserInProgress: true,
        })
      );

    case ClientActionTypes.GET_CLIENT_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingClient: false,
          client: action.payload,
          retrieveClientUserInProgress: false,
        })
      );

    case ClientActionTypes.GET_CLIENT_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingClient: false,
          client: action.payload || null,
        })
      );

    case ClientActionTypes.SET_CLIENT:
      return state.merge(
        ImmutableMap({
          client: action.payload,
        })
      );

    case ClientActionTypes.GET_NOTICES_BLOB_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingNotices: true,
        })
      );

    case ClientActionTypes.GET_NOTICES_BLOB_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingNotices: false,
          noticesBlob: action.payload,
        })
      );

    case ClientActionTypes.GET_NOTICES_BLOB_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingNotices: false,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_REQUEST:
      return state.merge(
        ImmutableMap({
          isDeletingClient: true,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_SUCCESS:
      const clientIndex = state.get('list')?.items.findIndex(client => client.id === action.payload);
      const newList = { ...state.get('list') };
      if (clientIndex !== -1) {
        newList.totalCount -= 1;
        newList.items.splice(clientIndex, 1);
      }

      return state.merge(
        ImmutableMap({
          isDeletingClient: false,
          list: newList,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_ERROR:
      return state.merge(
        ImmutableMap({
          isDeletingClient: false,
        })
      );

    case ClientActionTypes.CREATE_CLIENT_STORAGE:
      return state.merge({
        createStorageInProgress: true,
      });

    case ClientActionTypes.CREATE_CLIENT_STORAGE_SUCCESS:
    case ClientActionTypes.CREATE_CLIENT_STORAGE_ERROR:
      return state.merge({
        createStorageInProgress: false,
      });

    case ClientActionTypes.GET_CLIENT_DATA_SOURCES:
      return state.merge({
        isFetchingDataSources: true,
      });
    case ClientActionTypes.GET_CLIENT_DATA_SOURCES_SUCCESS:
      return state.merge({
        isFetchingDataSources: false,
        dataSources: action.payload,
      });
    case ClientActionTypes.GET_CLIENT_DATA_SOURCES_ERROR:
      return state.merge({
        isFetchingDataSources: false,
      });

    case ClientActionTypes.GET_CLIENT_DS_CONNECTIONS:
      return state.merge({
        isFetchingDSConnections: true,
      });
    case ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_SUCCESS:
      return state.merge({
        isFetchingDSConnections: false,
        dSConnections: action.payload,
      });
    case ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_ERROR:
      return state.merge({
        isFetchingDSConnections: false,
      });

    case ClientActionTypes.ADD_DATA_SOURCE:
    case ClientActionTypes.UPDATE_DATA_SOURCE:
      return state.merge({
        isSavingDataSource: true,
        saveDataSourceError: null,
      });
    case ClientActionTypes.ADD_DATA_SOURCE_SUCCESS:
    case ClientActionTypes.ADD_DATA_SOURCE_RESET:
    case ClientActionTypes.UPDATE_DATA_SOURCE_SUCCESS:
      return state.merge({
        isSavingDataSource: false,
        saveDataSourceError: null,
      });
    case ClientActionTypes.ADD_DATA_SOURCE_ERROR:
    case ClientActionTypes.UPDATE_DATA_SOURCE_ERROR:
      return state.merge({
        isSavingDataSource: false,
        saveDataSourceError: action.payload,
      });
    case ClientActionTypes.DELETE_DATA_SOURCE:
      return state.merge(
        ImmutableMap({
          isDeletingDataSource: true,
        })
      );
    case ClientActionTypes.DELETE_DATA_SOURCE_SUCCESS:
    case ClientActionTypes.DELETE_DATA_SOURCE_ERROR:
      return state.merge(
        ImmutableMap({
          isDeletingDataSource: false,
        })
      );

    case ClientActionTypes.GET_MAT_CLIENT:
      return state.merge({
        isFetchingMatClient: true,
      });

    case ClientActionTypes.GET_MAT_CLIENT_SUCCESS:
      return state.merge({
        matClient: action.payload,
        isFetchingMatClient: false,
      });

    case ClientActionTypes.GET_MAT_CLIENT_ERROR:
      return state.merge({
        isFetchingMatClient: false,
      });

    case ClientActionTypes.RESET_MAT_CLIENT:
      return state.merge({
        matClient: null,
      });

    case ClientActionTypes.GET_MAT_CLIENT_ENTITIES:
      return state.merge({
        isFetchingMatClientEntities: true,
      });

    case ClientActionTypes.GET_MAT_CLIENT_ENTITIES_SUCCESS:
      return state.merge({
        matClientEntities: action.payload,
        isFetchingMatClientEntities: false,
      });

    case ClientActionTypes.GET_MAT_CLIENT_ENTITIES_ERROR:
      return state.merge({
        isFetchingMatClientEntities: false,
      });

    case ClientActionTypes.RESET_MAT_CLIENT_ENTITIES:
      return state.merge({
        matClientEntities: [],
      });

    case ClientActionTypes.CLIENT_PUT_REQUEST:
      return state.merge({
        isSavingClient: true,
      });

    case ClientActionTypes.CLIENT_PUT_REQUEST_SUCCESS:
      return state.merge({
        clientSavingError: false,
        isSavingClient: false,
        client: action.payload,
      });

    case ClientActionTypes.CLIENT_PUT_REQUEST_ERROR:
      return state.merge({
        clientSavingError: true,
        isSavingClient: false,
      });

    case ClientActionTypes.ADD_CLIENT_DOMAIN:
      return state.merge(
        ImmutableMap({
          addingDomain: true,
        })
      );

    case ClientActionTypes.ADD_CLIENT_DOMAIN_SUCCESS:
      return state.merge(
        ImmutableMap({
          addingDomain: false,
          domain: action.payload,
        })
      );

    case ClientActionTypes.ADD_CLIENT_DOMAIN_ERROR:
      return state.merge(
        ImmutableMap({
          addingDomain: false,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_DOMAIN:
      return state.merge(
        ImmutableMap({
          deletingDomain: true,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_DOMAIN_SUCCESS:
      return state.merge(
        ImmutableMap({
          deletingDomain: false,
          domain: action.payload,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_DOMAIN_ERROR:
      return state.merge(
        ImmutableMap({
          deletingDomain: false,
        })
      );

    case ClientActionTypes.UPDATE_CLIENT_SETUP_STATE:
      return state.merge({
        clientSetupState: action.payload,
      });

    case ClientActionTypes.ADD_CLIENT_ENTITY:
      return state.merge(
        ImmutableMap({
          isAddingEntity: true,
        })
      );

    case ClientActionTypes.ADD_CLIENT_ENTITY_SUCCESS:
      return state.merge(
        ImmutableMap({
          isAddingEntity: false,
          client: action.payload,
        })
      );

    case ClientActionTypes.ADD_CLIENT_ENTITY_ERROR:
      return state.merge({
        isAddingEntity: false,
      });

    case ClientActionTypes.EDIT_CLIENT_ENTITY:
      return state.merge(
        ImmutableMap({
          isEntitySaving: true,
        })
      );

    case ClientActionTypes.EDIT_CLIENT_ENTITY_SUCCESS:
      return state.merge(
        ImmutableMap({
          client: action.payload,
          isEntitySaving: false,
        })
      );

    case ClientActionTypes.EDIT_CLIENT_ENTITY_ERROR:
      return state.merge({
        isEntitySaving: false,
      });

    case ClientActionTypes.DELETE_CLIENT_ENTITY:
      return state.merge(
        ImmutableMap({
          isDeletingEntity: true,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_ENTITY_SUCCESS:
      return state.merge(
        ImmutableMap({
          client: action.payload,
          isDeletingEntity: false,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_ENTITY_ERROR:
      return state.merge({
        isDeletingEntity: false,
      });

    case ClientActionTypes.ORG_GET_REQUEST:
      return state.merge({
        isGettingOrg: true,
      });

    case ClientActionTypes.ORG_GET_REQUEST_SUCCESS:
      return state.merge({
        isGettingOrg: false,
        org: action.payload,
      });

    case ClientActionTypes.ORG_GET_REQUEST_ERROR:
      return state.merge({
        isGettingOrg: false,
      });

    case ClientActionTypes.ORG_RESET:
      return state.merge({
        org: null,
      });

    case ClientActionTypes.DELETE_CLIENT_ORG:
      return state.merge(
        ImmutableMap({
          isDeletingOrg: true,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_ORG_SUCCESS:
      return state.merge(
        ImmutableMap({
          isDeletingOrg: false,
          org: action.payload,
        })
      );

    case ClientActionTypes.DELETE_CLIENT_ORG_ERROR:
      return state.merge(
        ImmutableMap({
          isDeletingOrg: false,
        })
      );

    case ClientActionTypes.CREATE_CLIENT_ORG:
      return state.merge(
        ImmutableMap({
          isCreatingOrg: true,
        })
      );

    case ClientActionTypes.CREATE_CLIENT_ORG_SUCCESS:
      return state.merge(
        ImmutableMap({
          isCreatingOrg: false,
          org: action.payload.org,
          client: action.payload.client,
        })
      );

    case ClientActionTypes.CREATE_CLIENT_ORG_ERROR:
      return state.merge(
        ImmutableMap({
          isCreatingOrg: false,
        })
      );

    case ClientActionTypes.SUBORG_CREATE_REQUEST:
      return state.merge(
        ImmutableMap({
          isLinkingOrg: true,
        })
      );

    case ClientActionTypes.SUBORG_CREATE_REQUEST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isLinkingOrg: false,
          org: action.payload,
        })
      );

    case ClientActionTypes.SUBORG_CREATE_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isLinkingOrg: false,
        })
      );

    case ClientActionTypes.NEW_SUBORG_CREATE_REQUEST:
      return state.merge(
        ImmutableMap({
          isCreatingSubOrg: true,
        })
      );

    case ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isCreatingSubOrg: false,
          subOrg: action.payload,
        })
      );

    case ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isCreatingSubOrg: false,
        })
      );

    case ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST:
      return state.merge(
        ImmutableMap({
          isUpdatingSubOrg: true,
        })
      );

    case ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isUpdatingSubOrg: false,
          subOrg: action.payload,
        })
      );

    case ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isUpdatingSubOrg: false,
        })
      );

    case ClientActionTypes.DELETE_SUBORG_REQUEST:
      return state.merge(
        ImmutableMap({
          isDeletingSubOrg: true,
        })
      );

    case ClientActionTypes.DELETE_SUBORG_REQUEST_SUCCESS:
    case ClientActionTypes.DELETE_SUBORG_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isDeletingSubOrg: false,
        })
      );

    case ClientActionTypes.SUBORG_TOKEN_REQUEST:
      return state.merge(
        ImmutableMap({
          isGeneratingToken: true,
        })
      );

    case ClientActionTypes.SUBORG_TOKEN_REQUEST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isGeneratingToken: false,
          subOrgToken: action.payload,
        })
      );

    case ClientActionTypes.SUBORG_TOKEN_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isGeneratingToken: false,
        })
      );
    case ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT:
      return state.merge(
        ImmutableMap({
          fetchingRuntimeData: true,
          runtimeEnvironmentList: [],
        })
      );

    case ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingRuntimeData: false,
          runtimeEnvironmentList: action.payload || [],
        })
      );

    case ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingRuntimeData: false,
        })
      );

    case ClientActionTypes.GET_CON_TEMP_PUBLISHED:
      return state.merge(
        ImmutableMap({
          fetchingConnTempData: true,
          connectionTemplateList: [],
        })
      );

    case ClientActionTypes.GET_CON_TEMP_PUBLISHED_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingConnTempData: false,
          connectionTemplateList: action.payload || [],
        })
      );

    case ClientActionTypes.GET_CON_TEMP_PUBLISHED_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingConnTempData: false,
        })
      );

    case ClientActionTypes.ORG_AGENTS_GET_REQUEST:
      return state.merge(
        ImmutableMap({
          isGettingAgents: true,
        })
      );

    case ClientActionTypes.ORG_AGENTS_GET_REQUEST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isGettingAgents: false,
          agents: action.payload,
        })
      );

    case ClientActionTypes.ORG_AGENTS_GET_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isGettingAgents: false,
        })
      );

    case ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION:
      return state.merge(
        ImmutableMap({
          isCreatingDataSourceConnection: true,
          createDataSourceConnectionError: [],
        })
      );

    case ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_SUCCESS:
      return state.merge(
        ImmutableMap({
          isCreatingDataSourceConnection: false,
          createDataSourceConnectionError: [],
        })
      );

    case ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_ERROR:
      return state.merge(
        ImmutableMap({
          isCreatingDataSourceConnection: false,
          createDataSourceConnectionError: [action.payload],
        })
      );

    case ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_REMOVE_ERROR:
      return state.merge(
        ImmutableMap({
          createDataSourceConnectionError: [],
        })
      );

    case ClientActionTypes.TEST_CONNECTION_REQUEST:
      return state.merge(
        ImmutableMap({
          isTestingConnection: true,
          isTestResultError: [],
        })
      );

    case ClientActionTypes.TEST_CONNECTION_REQUEST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isTestingConnection: false,
          connectionList: action.payload,
          isTestResultError: [],
        })
      );

    case ClientActionTypes.TEST_CONNECTION_REQUEST_ERROR:
      return state.merge(
        ImmutableMap({
          isTestingConnection: false,
          isTestResultError: action.payload,
        })
      );

    case ClientActionTypes.TEST_CONNECTION_REMOVE_ERROR:
      return state.merge(
        ImmutableMap({
          isTestResultError: [],
        })
      );

    case ClientActionTypes.SET_CONNECTION_AS_DEFAULT:
      return state.merge(
        ImmutableMap({
          isSettingConnectionAsDefault: true,
        })
      );

    case ClientActionTypes.SET_CONNECTION_AS_DEFAULT_SUCCESS:
    case ClientActionTypes.SET_CONNECTION_AS_DEFAULT_ERROR:
      return state.merge(
        ImmutableMap({
          isSettingConnectionAsDefault: false,
        })
      );

    case ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT:
      return state.merge(
        ImmutableMap({
          isUpdatingClientUsesSecureAgent: true,
        })
      );

    case ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_SUCCESS:
      return state.merge(
        ImmutableMap({
          isUpdatingClientUsesSecureAgent: false,
          client: action.payload,
        })
      );

    case ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_ERROR:
      return state.merge(
        ImmutableMap({
          isUpdatingClientUsesSecureAgent: false,
        })
      );

    default:
      return state;
  }
}
