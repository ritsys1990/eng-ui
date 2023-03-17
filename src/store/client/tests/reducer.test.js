import reducer, { initialState } from '../reducer';
import { ClientActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';

describe('client reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('create client storage', () => {
    const expectedState = initialState.merge({
      createStorageInProgress: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CREATE_CLIENT_STORAGE });
    expect(state).toEqual(expectedState);
  });

  it('create client storage success', () => {
    const expectedState = initialState.merge({
      createStorageInProgress: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CREATE_CLIENT_STORAGE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('create client storage error', () => {
    const expectedState = initialState.merge({
      createStorageInProgress: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CREATE_CLIENT_STORAGE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get mat client', () => {
    const expectedState = initialState.merge({
      isFetchingMatClient: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_MAT_CLIENT });
    expect(state).toEqual(expectedState);
  });

  it('get mat client success', () => {
    const matClient = { name: 'Test Name', id: '1234' };
    const expectedState = initialState.merge({
      isFetchingMatClient: false,
      matClient,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_MAT_CLIENT_SUCCESS, payload: matClient });
    expect(state).toEqual(expectedState);
  });

  it('get mat client error', () => {
    const expectedState = initialState.merge({
      isFetchingMatClient: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_MAT_CLIENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('reset mat client', () => {
    const expectedState = initialState.merge({
      matClient: null,
    });

    const state = reducer(initialState, { type: ClientActionTypes.RESET_MAT_CLIENT });
    expect(state).toEqual(expectedState);
  });

  it('get mat entities', () => {
    const expectedState = initialState.merge({
      isFetchingMatClientEntities: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES });
    expect(state).toEqual(expectedState);
  });

  it('get mat entities success', () => {
    const matClientEntities = [{ name: 'Test Name', id: '1234' }];
    const expectedState = initialState.merge({
      isFetchingMatClientEntities: false,
      matClientEntities,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES_SUCCESS,
      payload: matClientEntities,
    });
    expect(state).toEqual(expectedState);
  });

  it('get mat entities error', () => {
    const expectedState = initialState.merge({
      isFetchingMatClientEntities: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('reset mat entities', () => {
    const expectedState = initialState.merge({
      matClientEntities: [],
    });

    const state = reducer(initialState, { type: ClientActionTypes.RESET_MAT_CLIENT_ENTITIES });
    expect(state).toEqual(expectedState);
  });

  it('update client', () => {
    const expectedState = initialState.merge({
      isSavingClient: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CLIENT_PUT_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('update client success', () => {
    const client = { name: 'Test 1', id: 123 };
    const expectedState = initialState.merge({
      clientSavingError: false,
      isSavingClient: false,
      client,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CLIENT_PUT_REQUEST_SUCCESS, payload: client });
    expect(state).toEqual(expectedState);
  });

  it('update client error', () => {
    const expectedState = initialState.merge({
      clientSavingError: true,
      isSavingClient: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CLIENT_PUT_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('update client setup state', () => {
    const payload = {
      isStep1Completed: true,
      isStep2Completed: false,
      isStep3Completed: false,
      isStep4Completed: false,
      isStep5Completed: false,
      isStep6Completed: false,
    };
    const expectedState = initialState.merge({
      clientSetupState: payload,
    });

    const state = reducer(initialState, { type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload });
    expect(state).toEqual(expectedState);
  });

  it('add client Domain', () => {
    const expectedState = initialState.merge({
      addingDomain: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_CLIENT_DOMAIN });
    expect(state).toEqual(expectedState);
  });

  it('add client Domain success', () => {
    const expectedState = initialState.merge({
      addingDomain: false,
      domain: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_CLIENT_DOMAIN_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('add client Domain error', () => {
    const expectedState = initialState.merge({
      addingDomain: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_CLIENT_DOMAIN_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('delete client Domain', () => {
    const expectedState = initialState.merge({
      deletingDomain: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_DOMAIN });
    expect(state).toEqual(expectedState);
  });

  it('delete client Domain success', () => {
    const expectedState = initialState.merge({
      deletingDomain: false,
      domain: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_DOMAIN_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('delete client Domain error', () => {
    const expectedState = initialState.merge({
      deletingDomain: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_DOMAIN_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('client data sources', () => {
    const expectedState = initialState.merge({
      isFetchingDataSources: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_DATA_SOURCES });
    expect(state).toEqual(expectedState);
  });

  it('client data sources success', () => {
    const dataSources = [{ name: 'test', id: '1234' }];
    const expectedState = initialState.merge({
      isFetchingDataSources: false,
      dataSources,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.GET_CLIENT_DATA_SOURCES_SUCCESS,
      payload: dataSources,
    });
    expect(state).toEqual(expectedState);
  });

  it('client data sources error', () => {
    const expectedState = initialState.merge({
      isFetchingDataSources: false,
    });
    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_DATA_SOURCES_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('add client entity', () => {
    const expectedState = initialState.merge({
      isAddingEntity: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_CLIENT_ENTITY });
    expect(state).toEqual(expectedState);
  });

  it('add client entity success', () => {
    const mockClient = { id: '1234', name: 'Client 1' };
    const expectedState = initialState.merge({
      isAddingEntity: false,
      client: mockClient,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_CLIENT_ENTITY_SUCCESS, payload: mockClient });
    expect(state).toEqual(expectedState);
  });

  it('add client entity error ', () => {
    const expectedState = initialState.merge({
      isAddingEntity: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_CLIENT_ENTITY_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('update client entity', () => {
    const expectedState = initialState.merge({
      isEntitySaving: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.EDIT_CLIENT_ENTITY });
    expect(state).toEqual(expectedState);
  });

  it('update client entity success', () => {
    const mockClient = { id: '1234', name: 'Client 1' };
    const expectedState = initialState.merge({
      isEntitySaving: false,
      client: mockClient,
    });

    const state = reducer(initialState, { type: ClientActionTypes.EDIT_CLIENT_ENTITY_SUCCESS, payload: mockClient });
    expect(state).toEqual(expectedState);
  });

  it('update client entity error ', () => {
    const expectedState = initialState.merge({
      isEntitySaving: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.EDIT_CLIENT_ENTITY_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('delete client entity', () => {
    const expectedState = initialState.merge({
      isDeletingEntity: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_ENTITY });
    expect(state).toEqual(expectedState);
  });

  it('delete client entity success', () => {
    const mockClient = { id: '1234', name: 'Client 1' };
    const expectedState = initialState.merge({
      isDeletingEntity: false,
      client: mockClient,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_ENTITY_SUCCESS, payload: mockClient });
    expect(state).toEqual(expectedState);
  });

  it('delete client entity error ', () => {
    const expectedState = initialState.merge({
      isDeletingEntity: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_ENTITY_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('client data sources connections', () => {
    const expectedState = initialState.merge({
      isFetchingDSConnections: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS });
    expect(state).toEqual(expectedState);
  });

  it('client data sources connections success', () => {
    const dSConnections = [{ name: 'test', id: '1234' }];
    const expectedState = initialState.merge({
      isFetchingDSConnections: false,
      dSConnections,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_SUCCESS,
      payload: dSConnections,
    });
    expect(state).toEqual(expectedState);
  });

  it('client data sources connections error', () => {
    const expectedState = initialState.merge({
      isFetchingDSConnections: false,
    });
    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('load SubOrg Token', () => {
    const expectedState = initialState.merge({
      isGettingOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ORG_GET_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('load SubOrg Token success', () => {
    const expectedState = initialState.merge({
      isGettingOrg: false,
      org: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('load SubOrg Token error', () => {
    const expectedState = initialState.merge({
      isGettingOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ORG_GET_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle delete client Org', () => {
    const expectedState = initialState.merge({
      isDeletingOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_ORG });
    expect(state).toEqual(expectedState);
  });

  it('handle delete client Org success', () => {
    const expectedState = initialState.merge({
      isDeletingOrg: false,
      org: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_ORG_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle delete client Org error', () => {
    const expectedState = initialState.merge({
      isDeletingOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_CLIENT_ORG_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle create client Org', () => {
    const expectedState = initialState.merge({
      isCreatingOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CREATE_CLIENT_ORG });
    expect(state).toEqual(expectedState);
  });

  it('handle create client Org success', () => {
    const client = { id: '123' };
    const org = { id: '234' };
    const expectedState = initialState.merge({
      isCreatingOrg: false,
      org,
      client,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.CREATE_CLIENT_ORG_SUCCESS,
      payload: { client, org },
    });
    expect(state).toEqual(expectedState);
  });

  it('handle create client Org error', () => {
    const expectedState = initialState.merge({
      isCreatingOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.CREATE_CLIENT_ORG_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle link to existing org', () => {
    const expectedState = initialState.merge({
      isLinkingOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.SUBORG_CREATE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle link to existing org success', () => {
    const expectedState = initialState.merge({
      isLinkingOrg: false,
      org: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.SUBORG_CREATE_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle link to existing org error', () => {
    const expectedState = initialState.merge({
      isLinkingOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.SUBORG_CREATE_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('should handle add data source', () => {
    const expectedState = initialState.merge({
      isSavingDataSource: true,
      saveDataSourceError: null,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_DATA_SOURCE });
    expect(state).toEqual(expectedState);
  });

  it('handle create Sub Org', () => {
    const expectedState = initialState.merge({
      isCreatingSubOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle create Sub Org success', () => {
    const expectedState = initialState.merge({
      isCreatingSubOrg: false,
      subOrg: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle create Sub Org error', () => {
    const expectedState = initialState.merge({
      isCreatingSubOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle updating Sub Org', () => {
    const expectedState = initialState.merge({
      isUpdatingSubOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle updating Sub Org success', () => {
    const expectedState = initialState.merge({
      isUpdatingSubOrg: false,
      subOrg: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle updating Sub Org error', () => {
    const expectedState = initialState.merge({
      isUpdatingSubOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle delete Sub Org', () => {
    const expectedState = initialState.merge({
      isDeletingSubOrg: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_SUBORG_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle delete Sub Org success', () => {
    const expectedState = initialState.merge({
      isDeletingSubOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_SUBORG_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle delete Sub Org error', () => {
    const expectedState = initialState.merge({
      isDeletingSubOrg: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_SUBORG_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle load agent', () => {
    const expectedState = initialState.merge({
      isGettingAgents: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle load agent success', () => {
    const expectedState = initialState.merge({
      isGettingAgents: false,
      agents: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle  load agent error', () => {
    const expectedState = initialState.merge({
      isGettingAgents: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('should handle add data source success', () => {
    const expectedState = initialState.merge({
      isSavingDataSource: false,
      saveDataSourceError: null,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_DATA_SOURCE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('should handle add data source error', () => {
    const error = new Error('dummy');
    const expectedState = initialState.merge({
      isSavingDataSource: false,
      saveDataSourceError: error,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_DATA_SOURCE_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('should handle update data source', () => {
    const expectedState = initialState.merge({
      isSavingDataSource: true,
      saveDataSourceError: null,
    });

    const state = reducer(initialState, { type: ClientActionTypes.UPDATE_DATA_SOURCE });
    expect(state).toEqual(expectedState);
  });

  it('should handle update data source success', () => {
    const expectedState = initialState.merge({
      isSavingDataSource: false,
      saveDataSourceError: null,
    });

    const state = reducer(initialState, { type: ClientActionTypes.UPDATE_DATA_SOURCE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('should handle update data source error', () => {
    const error = new Error('dummy');
    const expectedState = initialState.merge({
      isSavingDataSource: false,
      saveDataSourceError: error,
    });

    const state = reducer(initialState, { type: ClientActionTypes.UPDATE_DATA_SOURCE_ERROR, payload: error });
    expect(state).toEqual(expectedState);
  });

  it('should handle delete data source', () => {
    const expectedState = initialState.merge({
      isDeletingDataSource: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_DATA_SOURCE });
    expect(state).toEqual(expectedState);
  });

  it('should handle delete data source success', () => {
    const expectedState = initialState.merge({
      isDeletingDataSource: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_DATA_SOURCE_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('should handle delete data source error', () => {
    const expectedState = initialState.merge({
      isDeletingDataSource: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.DELETE_DATA_SOURCE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('should handle add data source reset', () => {
    const expectedState = initialState.merge({
      isSavingDataSource: false,
      saveDataSourceError: null,
    });

    const state = reducer(initialState, { type: ClientActionTypes.ADD_DATA_SOURCE_RESET });
    expect(state).toEqual(expectedState);
  });

  it('handle generate token for sub org', () => {
    const expectedState = initialState.merge({
      isGeneratingToken: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.SUBORG_TOKEN_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle generate token for sub org success', () => {
    const expectedState = initialState.merge({
      isGeneratingToken: false,
      subOrgToken: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.SUBORG_TOKEN_REQUEST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle generate token for sub org error', () => {
    const expectedState = initialState.merge({
      isGeneratingToken: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.SUBORG_TOKEN_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle get connection template list', () => {
    const expectedState = initialState.merge({
      fetchingConnTempData: true,
      connectionTemplateList: [],
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CON_TEMP_PUBLISHED });
    expect(state).toEqual(expectedState);
  });

  it('handle get connection template list success', () => {
    const connectionTemplateList = [];
    const expectedState = initialState.merge({
      fetchingConnTempData: false,
      connectionTemplateList,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.GET_CON_TEMP_PUBLISHED_SUCCESS,
      payload: connectionTemplateList,
    });
    expect(state).toEqual(expectedState);
  });

  it('handle get connection template list error', () => {
    const expectedState = initialState.merge({
      fetchingConnTempData: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CON_TEMP_PUBLISHED_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle get run time environment list', () => {
    const expectedState = initialState.merge({
      fetchingRuntimeData: true,
      runtimeEnvironmentList: [],
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT });
    expect(state).toEqual(expectedState);
  });

  it('handle get run time environment list success', () => {
    const expectedState = initialState.merge({
      fetchingRuntimeData: false,
      runtimeEnvironmentList: [],
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle get run time environment list error', () => {
    const expectedState = initialState.merge({
      fetchingRuntimeData: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle create connection success', () => {
    const expectedState = initialState.merge({
      isCreatingDataSourceConnection: false,
      createDataSourceConnectionError: [],
    });

    const state = reducer(initialState, { type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('handle create connection error', () => {
    const expectedError = new ServerError({ status: 500, message: 'Test message error', key: 123 });
    const expectedState = initialState.merge({
      isCreatingDataSourceConnection: false,
      createDataSourceConnectionError: [expectedError],
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_ERROR,
      payload: expectedError,
    });
    expect(state).toEqual(expectedState);
  });

  it('handle get connection list', () => {
    const expectedState = initialState.merge({
      isTestingConnection: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.TEST_CONNECTION_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('handle get connection list success', () => {
    const connectionList = [];
    const expectedState = initialState.merge({
      isTestingConnection: false,
      connectionList,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.TEST_CONNECTION_REQUEST_SUCCESS,
      payload: connectionList,
    });
    expect(state).toEqual(expectedState);
  });

  it('handle get connection list error', () => {
    const expectedState = initialState.merge({
      isTestResultError: undefined,
    });

    const state = reducer(initialState, { type: ClientActionTypes.TEST_CONNECTION_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('handle update client uses secure agent', () => {
    const expectedState = initialState.merge({
      isUpdatingClientUsesSecureAgent: true,
    });

    const state = reducer(initialState, { type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT });
    expect(state).toEqual(expectedState);
  });

  it('handle update client uses secure agent success', () => {
    const client = { id: '123' };
    const expectedState = initialState.merge({
      isUpdatingClientUsesSecureAgent: false,
      client,
    });

    const state = reducer(initialState, {
      type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_SUCCESS,
      payload: client,
    });
    expect(state).toEqual(expectedState);
  });

  it('handle update client uses secure agent error', () => {
    const expectedState = initialState.merge({
      isUpdatingClientUsesSecureAgent: false,
    });

    const state = reducer(initialState, { type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_ERROR });
    expect(state).toEqual(expectedState);
  });
});
