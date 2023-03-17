import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import clientService from '../../../services/client.service';
import informaticaService from '../../../services/informatica.service';
import dataRequestService from '../../../services/data-request.service';
import {
  createClient,
  createClientStorage,
  getMatClient,
  getMatClientEntities,
  saveClient,
  updateClientSetupStepStatus,
  addClientDomain,
  deleteClientDomain,
  getClientDataSources,
  getClientDSConnections,
  resetMatClientDetails,
  addEntity,
  resetMatEntities,
  loadOrgWithSubOrgTokens,
  deleteClientOrg,
  createClientOrg,
  linkToExistingOrg,
  editEntity,
  deleteEntity,
  addDataSource,
  createSubOrg,
  updateSubOrg,
  deleteSubOrg,
  updateDataSource,
  deleteDataSource,
  loadAgents,
  generateToken,
  getAllPublishedConnTemp,
  getConnectionRuntimeEnvironments,
  createConnection,
  testConnection,
  testExistingConnection,
  setConnectionsAsDefault,
  updateClientUsesSecureAgent,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { ClientActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';
import { ErrorActionTypes } from '../../errors/actionTypes';
import { generateAddClientCSAError } from '../../../utils/errorHelper';
import engagementService from 'src/services/engagement.service';
import bundleService from 'src/services/bundles.service';
import { initialState } from '../reducer';
import { EngagementActionTypes } from '../../engagement/actionTypes';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  client: initialState,
});

const mockClientId = '1234-5678-9012-3456';
const mockClientName = 'Client Name';
const mockDuplicateClientName = 'Duplicate Client Name';
const mockErrorText = 'Test message error';
const mockDataSourceId = 'xxx-xxx-xxx-xxx';

describe('CRUD client actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle create client with success flow ', async () => {
    const expectedActions = [
      { type: ClientActionTypes.CREATE_CLIENT_REQUEST },
      { type: ClientActionTypes.CREATE_CLIENT_SUCCESS },
    ];
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    clientService.createClient = jest.fn().mockImplementation(() => {
      return clientMock;
    });

    await mockStore.dispatch(createClient(clientMock));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create client with error flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockDuplicateClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };
    const csaUsersMock = [
      {
        email: 'email1@deloitte.com',
        firstName: 'User',
        lastName: 'One',
      },
      {
        email: 'email2@deloitte.com',
        firstName: 'User',
        lastName: 'Two',
      },
    ];
    const error = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedError = new ServerError({
      status: 500,
      message: generateAddClientCSAError(error, csaUsersMock, () => {}),
      key: 123,
    });
    const expectedActions = [
      { type: ClientActionTypes.CREATE_CLIENT_REQUEST },
      { type: ClientActionTypes.CREATE_CLIENT_ERROR, payload: expectedError },
      { type: ErrorActionTypes.ADD_ADD_CLIENT_ERROR, payload: expectedError },
    ];

    clientService.createClient = jest.fn().mockImplementation(() => {
      throw error;
    });
    clientService.getCSAUsers = jest.fn().mockImplementation(() => {
      return csaUsersMock;
    });

    await mockStore.dispatch(createClient(clientMock));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle createClientStorage with success flow ', async () => {
    const expectedActions = [
      { type: ClientActionTypes.CREATE_CLIENT_STORAGE },
      { type: ClientActionTypes.CREATE_CLIENT_STORAGE_SUCCESS },
    ];
    const clientId = mockClientId;

    clientService.createStorage = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(createClientStorage(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle createClientStorage with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.CREATE_CLIENT_STORAGE },
      {
        type: ClientActionTypes.CREATE_CLIENT_STORAGE_ERROR,
        payload: error,
      },
      {
        type: ErrorActionTypes.ADD_ADD_CLIENT_ERROR,
        payload: error,
      },
    ];
    const clientId = mockClientId;

    clientService.createStorage = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(createClientStorage(clientId, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create data source connection success', async () => {
    const expectedObj = { id: '123' };
    const dataSources = [{ id: 'xx', type: 'xx' }];

    const expectedActions = [
      { type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION },
      { type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_SUCCESS, payload: expectedObj },
      { type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS },
    ];

    engagementService.createDataSourceConnection = jest.fn().mockImplementation(() => {
      return expectedObj;
    });

    engagementService.getDataSourcesByClient = jest.fn().mockImplementation(() => dataSources);
    engagementService.getDataSourcesConnections = jest.fn().mockImplementation(() => {});

    await mockStore.dispatch(createConnection({}));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create data source connection error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION },
      {
        type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_ERROR,
        payload: expectedError,
      },
    ];

    engagementService.createDataSourceConnection = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(createConnection({}));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle set connection as default success', async () => {
    const dataSources = [{ id: 'xx', type: 'xx' }];

    const expectedActions = [
      { type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT },
      { type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT_SUCCESS },
      { type: ClientActionTypes.GET_CLIENT_DS_CONNECTIONS },
    ];

    engagementService.setConnectionsAsDefault = jest.fn().mockImplementation(() => {});

    engagementService.getDataSourcesByClient = jest.fn().mockImplementation(() => dataSources);
    engagementService.getDataSourcesConnections = jest.fn().mockImplementation(() => {});

    await mockStore.dispatch(setConnectionsAsDefault('123', '123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle set connection as default error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT },
      { type: ClientActionTypes.SET_CONNECTION_AS_DEFAULT_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];

    engagementService.setConnectionsAsDefault = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(setConnectionsAsDefault('123', '123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});

describe('reconcile client to MAT actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle getMatClient with success flow ', async () => {
    const matClient = { id: '1234', name: 'Test Client' };
    const expectedActions = [
      { type: ClientActionTypes.GET_MAT_CLIENT },
      { type: ClientActionTypes.GET_MAT_CLIENT_SUCCESS, payload: matClient },
    ];
    const clientId = mockClientId;

    clientService.getMatClient = jest.fn().mockImplementation(() => {
      return matClient;
    });

    await mockStore.dispatch(getMatClient(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMatClient with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.GET_MAT_CLIENT },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: ClientActionTypes.GET_MAT_CLIENT_ERROR,
        payload: error,
      },
    ];
    const clientId = mockClientId;

    clientService.getMatClient = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getMatClient(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMatClientEntities with success flow ', async () => {
    const matEntities = [
      { id: '1234', name: 'Test Entity' },
      { id: '5678', name: 'Test Entity 2' },
    ];
    const expectedActions = [
      { type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES },
      { type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES_SUCCESS, payload: matEntities },
    ];
    const clientId = mockClientId;

    clientService.getMatClientEntities = jest.fn().mockImplementation(() => {
      return matEntities;
    });

    await mockStore.dispatch(getMatClientEntities(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMatClientEntities with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: ClientActionTypes.GET_MAT_CLIENT_ENTITIES_ERROR,
        payload: error,
      },
    ];
    const clientId = mockClientId;

    clientService.getMatClientEntities = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getMatClientEntities(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetMatClientDetails', async () => {
    const expectedActions = [
      { type: ClientActionTypes.RESET_MAT_CLIENT },
      { type: ClientActionTypes.RESET_MAT_CLIENT_ENTITIES },
      { type: EngagementActionTypes.RESET_MAT_CLIENT_ENGAGEMENTS },
    ];

    await mockStore.dispatch(resetMatClientDetails());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update client with success flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const expectedActions = [
      { type: ClientActionTypes.CLIENT_PUT_REQUEST },
      { type: ClientActionTypes.CLIENT_PUT_REQUEST_SUCCESS, payload: clientMock },
    ];

    clientService.saveClient = jest.fn().mockImplementation(() => {
      return clientMock;
    });

    await mockStore.dispatch(saveClient(clientMock));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update client with error flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockDuplicateClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const csaUsersMock = [
      {
        email: 'email1@deloitte.com',
        firstName: 'User',
        lastName: 'One',
      },
      {
        email: 'email2@deloitte.com',
        firstName: 'User',
        lastName: 'Two',
      },
    ];

    const error = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedError = new ServerError({
      status: 500,
      message: generateAddClientCSAError(error, csaUsersMock, () => 'Error'),
      key: 123,
    });
    const expectedActions = [
      { type: ClientActionTypes.CLIENT_PUT_REQUEST },
      { type: ClientActionTypes.CLIENT_PUT_REQUEST_ERROR, payload: expectedError },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];

    clientService.saveClient = jest.fn().mockImplementation(() => {
      throw error;
    });
    clientService.getCSAUsers = jest.fn().mockImplementation(() => {
      return csaUsersMock;
    });

    await mockStore.dispatch(saveClient(clientMock));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for step 1', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    updatedStatus.isStep1Completed = true;
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(1, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for step 2', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    updatedStatus.isStep2Completed = true;
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(2, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for step 3', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    updatedStatus.isStep3Completed = true;
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(3, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for step 4', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    updatedStatus.isStep4Completed = true;
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(4, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for step 5', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    updatedStatus.isStep5Completed = true;
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(5, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for step 6', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    updatedStatus.isStep6Completed = true;
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(6, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle client setup status for default', async () => {
    const updatedStatus = { ...initialState.get('clientSetupState') };
    const expectedActions = [{ type: ClientActionTypes.UPDATE_CLIENT_SETUP_STATE, payload: updatedStatus }];

    await mockStore.dispatch(updateClientSetupStepStatus(null, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should add client Domain Success', async () => {
    const domain = {
      id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
      name: '01_SpartanClient',
      matClientId: 101,
      matCustomerNumber: null,
      orgId: '0100FG',
      industries: ['PUBLIC SECTOR'],
      countries: ['US'],
      domains: ['abc.com'],
    };

    const expectedActions = [
      { type: ClientActionTypes.ADD_CLIENT_DOMAIN },
      {
        type: ClientActionTypes.ADD_CLIENT_DOMAIN_SUCCESS,
        payload: domain,
      },
    ];
    clientService.addDomain = jest.fn().mockImplementation(() => {
      return domain;
    });
    await mockStore.dispatch(addClientDomain(mockClientId, 'abc.com'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should add client Domain error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.ADD_CLIENT_DOMAIN },
      {
        type: ClientActionTypes.ADD_CLIENT_DOMAIN_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    clientService.addDomain = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(addClientDomain(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should delete client Domain Success', async () => {
    const domain = {
      id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
      name: '01_SpartanClient',
      matClientId: 101,
      matCustomerNumber: null,
      orgId: '0100FG',
      industries: ['PUBLIC SECTOR'],
      countries: ['US'],
      domains: [],
    };

    const expectedActions = [
      { type: ClientActionTypes.DELETE_CLIENT_DOMAIN },
      {
        type: ClientActionTypes.DELETE_CLIENT_DOMAIN_SUCCESS,
        payload: domain,
      },
    ];

    clientService.deleteDomain = jest.fn().mockImplementation(() => {
      return domain;
    });
    await mockStore.dispatch(deleteClientDomain(mockClientId, 'abc.com'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should delete client Domain error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.DELETE_CLIENT_DOMAIN },
      {
        type: ClientActionTypes.DELETE_CLIENT_DOMAIN_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    clientService.deleteDomain = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(deleteClientDomain(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client datasouces and report sucess', async () => {
    const expectedActions = [
      ClientActionTypes.GET_CLIENT_DATA_SOURCES,
      ClientActionTypes.GET_CLIENT_DATA_SOURCES_SUCCESS,
    ].map(x => ({ type: x }));
    engagementService.getDataSourcesByClient = jest.fn();
    clientService.getEntities = jest.fn();
    engagementService.getDataSourcesSubscriptions = jest.fn();
    bundleService.getSourceSystemNames = jest.fn();

    await mockStore.dispatch(getClientDataSources(mockDataSourceId));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client datasouces and report error', async () => {
    const expectedError = new Error(mockErrorText);
    const expectedActions = [
      ClientActionTypes.GET_CLIENT_DATA_SOURCES,
      ClientActionTypes.GET_CLIENT_DATA_SOURCES_ERROR,
      ErrorActionTypes.ADD_GLOBAL_ERROR,
    ]
      .map(x => ({ type: x }))
      .map((x, i) => (i === 0 ? x : { ...x, payload: expectedError }));

    engagementService.getDataSourcesByClient = jest.fn().mockImplementation(() => {
      throw expectedError;
    });
    clientService.getEntities = jest.fn();
    engagementService.getDataSourcesSubscriptions = jest.fn();
    bundleService.getSourceSystemNames = jest.fn();

    await mockStore.dispatch(getClientDataSources(mockDataSourceId));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client datasouces data correctly', async () => {
    const dataSources = [
      {
        id: 'a8ca06e4-c245-421d-a7ef-5a30a8ea1315',
        type: 'ClientSource',
        fileTransferMode: 'SecureAgent',
        clientId: '9d05bdf9-02e9-4aff-bb4c-61d68cc89d08',
        name: 'oracle',
        sourceId: '3b145899-89e0-4dc7-96c5-4880f85d840b',
        entityIds: ['207ac55c-d4ca-4be9-9c15-e99e050ed545'],
      },
    ];

    const subscriptions = [
      {
        id: 'e50c1112-20c0-4d89-9493-813e1cff337b',
        status: 'Subscribed',
      },
    ];

    const sourceSystems = [
      {
        id: 'df1cbe2b-76fe-4cfe-bb2b-2ba77936a315',
        name: 'Oracle Financials',
        versions: [
          {
            id: '3b145899-89e0-4dc7-96c5-4880f85d840b',
            versionName: 'R12',
          },
        ],
      },
    ];

    const entities = [
      {
        id: '207ac55c-d4ca-4be9-9c15-e99e050ed545',
        name: 'Barclays Africa',
      },
    ];

    const expectedPayload = [
      {
        ...dataSources[0],
        sourceName: sourceSystems[0].name,
        sourceVersion: sourceSystems[0].versions[0].versionName,
        subscriptions,
        entities,
      },
    ];

    engagementService.getDataSourcesByClient = jest.fn().mockImplementation(() => dataSources);
    clientService.getEntities = jest.fn().mockImplementation(() => entities);
    engagementService.getDataSourcesSubscriptions = jest.fn().mockImplementation(() => subscriptions);
    bundleService.getSourceSystemNames = jest.fn().mockImplementation(() => ({ items: sourceSystems }));

    await mockStore.dispatch(getClientDataSources(mockDataSourceId));

    const action = mockStore.getActions().filter(x => x.type === ClientActionTypes.GET_CLIENT_DATA_SOURCES_SUCCESS)[0];
    expect(action).toBeTruthy();
    expect(action.payload).toMatchObject(expectedPayload);
  });

  it('handle add entity with success flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const expectedActions = [
      { type: ClientActionTypes.ADD_CLIENT_ENTITY },
      { type: ClientActionTypes.ADD_CLIENT_ENTITY_SUCCESS, payload: clientMock },
    ];

    clientService.addEntity = jest.fn().mockImplementation(() => {
      return null;
    });

    clientService.getClientById = jest.fn().mockImplementation(() => {
      return clientMock;
    });

    await mockStore.dispatch(addEntity(clientMock.id, {}));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update entity with success flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const expectedActions = [
      { type: ClientActionTypes.EDIT_CLIENT_ENTITY },
      { type: ClientActionTypes.EDIT_CLIENT_ENTITY_SUCCESS, payload: clientMock },
    ];

    clientService.saveEntity = jest.fn().mockImplementation(() => {
      return null;
    });

    clientService.getClientById = jest.fn().mockImplementation(() => {
      return clientMock;
    });

    await mockStore.dispatch(editEntity(clientMock.id, {}));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete entity with success flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const expectedActions = [
      { type: ClientActionTypes.DELETE_CLIENT_ENTITY },
      { type: ClientActionTypes.DELETE_CLIENT_ENTITY_SUCCESS, payload: clientMock },
    ];

    clientService.deleteEntity = jest.fn().mockImplementation(() => {
      return null;
    });

    clientService.getClientById = jest.fn().mockImplementation(() => {
      return clientMock;
    });

    await mockStore.dispatch(deleteEntity(clientMock.id, '45'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update client with error flow', async () => {
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockDuplicateClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const error = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.ADD_CLIENT_ENTITY },
      { type: ClientActionTypes.ADD_CLIENT_ENTITY_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    clientService.addEntity = jest.fn().mockImplementation(() => {
      throw error;
    });

    clientService.getClientById = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(addEntity(clientMock.id, {}));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetMatClientDetails', async () => {
    const expectedActions = [{ type: ClientActionTypes.RESET_MAT_CLIENT_ENTITIES }];

    await mockStore.dispatch(resetMatEntities());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client datasouces connections and report sucess', async () => {
    const expectedActions = [
      ClientActionTypes.GET_CLIENT_DS_CONNECTIONS,
      ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_SUCCESS,
    ].map(x => ({ type: x }));
    engagementService.getDataSourcesByClient = jest.fn();
    engagementService.getDataSourcesConnections = jest.fn();

    await mockStore.dispatch(getClientDSConnections(mockDataSourceId));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client datasouces connections and report error', async () => {
    const expectedError = new Error(mockErrorText);
    const expectedActions = [
      ClientActionTypes.GET_CLIENT_DS_CONNECTIONS,
      ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_ERROR,
      ErrorActionTypes.ADD_GLOBAL_ERROR,
    ]
      .map(x => ({ type: x }))
      .map((x, i) => (i === 0 ? x : { ...x, payload: expectedError }));
    engagementService.getDataSourcesByClient = jest.fn().mockImplementation(() => {
      throw expectedError;
    });
    engagementService.getDataSourcesConnections = jest.fn();
    await mockStore.dispatch(getClientDSConnections(mockDataSourceId));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client datasouces connections data correctly', async () => {
    const dataSources = [{ id: 'xx', type: 'xx' }];
    const connections = [{ id: 'yy', status: 'Subscribed' }];
    const expectedPayload = [{ ...dataSources[0], connections }];

    engagementService.getDataSourcesByClient = jest.fn().mockImplementation(() => dataSources);
    engagementService.getDataSourcesConnections = jest.fn().mockImplementation(() => connections);

    await mockStore.dispatch(getClientDSConnections(mockDataSourceId));

    const action = mockStore
      .getActions()
      .filter(x => x.type === ClientActionTypes.GET_CLIENT_DS_CONNECTIONS_SUCCESS)[0];
    expect(action).toBeTruthy();
    expect(action.payload).toMatchObject(expectedPayload);
  });

  it('handle load subOrg Tokens Success', async () => {
    const subOrg = {
      orgId: '0003MH',
      orgUUID: '7kEDjVi1BroeXwdjxMZ9Mz',
      name: 'Org_4ca38e57-301e-4ef2-9c0a-4ce732d14af0_BALLY TECHNOLOGIES INC',
      subOrgs: [
        {
          id: '0003MI',
          orgUUID: null,
          name: 'suborg_0003MH_sm',
        },
      ],
    };

    const orgId = '0003MH';
    const mockAgents = [];

    const expectedActions = [
      { type: ClientActionTypes.ORG_GET_REQUEST },
      {
        type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS,
        payload: subOrg,
      },
      { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST },
      {
        type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_SUCCESS,
        payload: { agents: mockAgents, dataRequestsBySecureAgents: mockAgents },
      },
    ];

    informaticaService.getOrgWithSubOrgTokens = jest.fn().mockImplementation(() => {
      return subOrg;
    });
    informaticaService.getAgents = jest.fn().mockImplementation(() => {
      return mockAgents;
    });

    await mockStore.dispatch(loadOrgWithSubOrgTokens(orgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle load subOrg Tokens error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const orgId = '0003MH';
    const expectedActions = [
      { type: ClientActionTypes.ORG_GET_REQUEST },
      {
        type: ClientActionTypes.ORG_GET_REQUEST_ERROR,
        payload: expectedError,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    informaticaService.getOrgWithSubOrgTokens = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(loadOrgWithSubOrgTokens(orgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete client Org', async () => {
    const clientId = mockClientId;

    const expectedActions = [
      { type: ClientActionTypes.DELETE_CLIENT_ORG },
      {
        type: ClientActionTypes.DELETE_CLIENT_ORG_SUCCESS,
        payload: [],
      },
    ];

    clientService.deleteClientOrg = jest.fn().mockImplementation(() => {
      return [];
    });

    await mockStore.dispatch(deleteClientOrg(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete client Org error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const clientId = mockClientId;
    const expectedActions = [
      { type: ClientActionTypes.DELETE_CLIENT_ORG },
      {
        type: ClientActionTypes.DELETE_CLIENT_ORG_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    clientService.deleteClientOrg = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(deleteClientOrg(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create client Org', async () => {
    const clientId = mockClientId;
    const orgDetails = { orgUUID: '010ELX', orgId: '010ELX', name: 'SubOrg_1xsYmGDxqStdgTjnFd9VkE_rwew' };
    const org = { orgUUID: '010ELV', orgId: '010ELV', name: 'rwew' };

    const expectedActions = [
      { type: ClientActionTypes.CREATE_CLIENT_ORG },
      { type: ClientActionTypes.CREATE_CLIENT_ORG_SUCCESS, payload: { org, client: orgDetails } },
    ];
    clientService.createClientOrg = jest.fn().mockImplementation(() => {
      return orgDetails;
    });
    informaticaService.getOrgWithSubOrgTokens = jest.fn().mockImplementation(() => {
      return org;
    });

    await mockStore.dispatch(createClientOrg(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create client Org error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const clientId = mockClientId;
    const expectedActions = [
      { type: ClientActionTypes.CREATE_CLIENT_ORG },
      {
        type: ClientActionTypes.CREATE_CLIENT_ORG_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    clientService.createClientOrg = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(createClientOrg(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle link to existing Org', async () => {
    const clientId = mockClientId;
    const orgId = '1023H';

    const org = { orgUUID: '010ELV', orgId: '010ELV', name: 'rwew' };
    const mockAgents = [];

    const expectedActions = [
      { type: ClientActionTypes.SUBORG_CREATE_REQUEST },
      { type: ClientActionTypes.GET_CLIENT_REQUEST },
      { type: ClientActionTypes.GET_CLIENT_SUCCESS, payload: org },
      { type: ClientActionTypes.ORG_GET_REQUEST },
      { type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: org },
      { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST },
      {
        type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_SUCCESS,
        payload: { agents: mockAgents, dataRequestsBySecureAgents: mockAgents },
      },
      { type: ClientActionTypes.SUBORG_CREATE_REQUEST_SUCCESS, payload: org },
    ];

    informaticaService.getOrg = jest.fn().mockImplementation(() => {
      return org;
    });
    clientService.mapClientToOrg = jest.fn().mockImplementation(() => {
      return org;
    });

    clientService.getClientById = jest.fn().mockImplementation(() => {
      return org;
    });

    await mockStore.dispatch(linkToExistingOrg(orgId, clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle link to existing error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const clientId = mockClientId;
    const org = {
      orgId: '1023H',
    };
    const expectedActions = [
      { type: ClientActionTypes.SUBORG_CREATE_REQUEST },
      { type: ClientActionTypes.SUBORG_CREATE_REQUEST_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    informaticaService.getOrg = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(linkToExistingOrg(org.orgId, clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle handle create sub org', async () => {
    const clientId = mockClientId;
    const subOrgMock = { id: '111111', orgId: '00000', name: 'test' };
    const subOrg = { id: '010ELV', orgId: '010ELV', name: 'rwew' };
    const token = {
      installTokenUpdateTime: '2021-01-26T15:07:42.5877554Z',
      result: 'dg32ggerger23434',
      userName: 'sdfsf@test.com',
    };
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const expectedActions = [
      { type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST },
      { type: ClientActionTypes.GET_CLIENT_REQUEST },
      { type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_SUCCESS, payload: subOrgMock },
      { type: ClientActionTypes.GET_CLIENT_SUCCESS, payload: clientMock },
      { type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: { org: null } },
    ];

    clientService.postSubOrg = jest.fn().mockImplementation(() => {
      return subOrgMock;
    });
    informaticaService.getToken = jest.fn().mockImplementation(() => {
      return token;
    });
    clientService.updateSubOrg = jest.fn().mockImplementation(() => {
      return subOrg;
    });
    clientService.getClientById = jest.fn().mockImplementation(() => {
      return clientMock;
    });

    await mockStore.dispatch(createSubOrg('test', [], clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create sub org error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const clientId = mockClientId;
    const expectedActions = [
      { type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST },
      {
        type: ClientActionTypes.NEW_SUBORG_CREATE_REQUEST_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    clientService.postSubOrg = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(createSubOrg(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update sub org', async () => {
    const clientId = mockClientId;
    const subOrg = { id: '010ELV', orgId: '010ELV', name: 'rwew' };
    const clientMock = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };

    const expectedActions = [
      { type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST },
      { type: ClientActionTypes.GET_CLIENT_REQUEST },
      { type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_SUCCESS, payload: subOrg },
      { type: ClientActionTypes.GET_CLIENT_SUCCESS, payload: clientMock },
      { type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: { org: null } },
    ];

    clientService.updateSubOrg = jest.fn().mockImplementation(() => {
      return subOrg;
    });

    await mockStore.dispatch(updateSubOrg(clientId, '010ELV', { name: 'test', entityIds: [] }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update sub org error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const clientId = mockClientId;
    const expectedActions = [
      { type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST },
      {
        type: ClientActionTypes.NEW_SUBORG_UPDATE_REQUEST_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];

    clientService.updateSubOrg = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(updateSubOrg(clientId, '010ELV', { name: 'test', entityIds: [] }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete sub org', async () => {
    const clientId = mockClientId;
    const client = {
      fiscalYearEnd: { month: 1, day: 1 },
      name: mockClientName,
      industries: [''],
      countries: [''],
      GeoCode: 'AME',
      ContainerCode: 'US',
      ContainerId: 1,
      MemberFirmCode: 'US',
      CountryCode: 'US',
    };
    const expectedActions = [
      { type: ClientActionTypes.DELETE_SUBORG_REQUEST },
      { type: ClientActionTypes.GET_CLIENT_REQUEST },
      { type: ClientActionTypes.DELETE_SUBORG_REQUEST_SUCCESS },
      { type: ClientActionTypes.GET_CLIENT_SUCCESS, payload: client },
      { type: ClientActionTypes.ORG_GET_REQUEST_SUCCESS, payload: { org: null } },
    ];

    clientService.deleteSubOrg = jest.fn().mockImplementation(() => {
      return [];
    });

    await mockStore.dispatch(deleteSubOrg(clientId, '010ELV'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete sub org error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const clientId = mockClientId;
    const expectedActions = [
      { type: ClientActionTypes.DELETE_SUBORG_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
      {
        type: ClientActionTypes.DELETE_SUBORG_REQUEST_ERROR,
      },
    ];
    clientService.deleteSubOrg = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(deleteSubOrg(clientId, '010ELV'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle generate token for sub org', async () => {
    const subOrgId = '1034KL';
    const orgId = '1023KL';
    const org = {
      orgId: '23434',
      orgUUID: '3243ssg234',
      name: 'tet',
      subOrgs: [
        {
          id: '010EPX',
          orgUUID: '2A4ttXL3OyTe5nsMx6ObmR',
          name: 'Test 2',
          installToken: {
            userName: 'wrwer@tst.com',
            result: 'sdfsf34234gg32353453453453',
            installTokenUpdateTime: '2020-11-10T17:03:40.809Z',
          },
        },
      ],
    };
    const expectedActions = [
      { type: ClientActionTypes.SUBORG_TOKEN_REQUEST },
      { type: ClientActionTypes.SUBORG_TOKEN_REQUEST_SUCCESS },
    ];

    informaticaService.getToken = jest.fn().mockImplementation(() => {
      return [];
    });

    informaticaService.getOrgWithSubOrgTokens = jest.fn().mockImplementation(() => {
      return org;
    });

    await mockStore.dispatch(generateToken(subOrgId, orgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle generate token for sub org error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const subOrgId = '1034KL';
    const orgId = '1023KL';
    const expectedActions = [
      { type: ClientActionTypes.SUBORG_TOKEN_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
      {
        type: ClientActionTypes.SUBORG_TOKEN_REQUEST_ERROR,
      },
    ];
    informaticaService.getToken = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(generateToken(subOrgId, orgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle add data source', async () => {
    const payload = {};
    const expectedActions = [
      ClientActionTypes.ADD_DATA_SOURCE,
      ClientActionTypes.ADD_DATA_SOURCE_SUCCESS,
      ClientActionTypes.GET_CLIENT_DATA_SOURCES,
    ].map(x => ({
      type: x,
    }));
    engagementService.updateDataSource = jest.fn();

    await mockStore.dispatch(addDataSource(payload));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle add data source error', async () => {
    const payload = {};
    const expectedError = new Error(mockErrorText);
    const expectedActions = [ClientActionTypes.ADD_DATA_SOURCE, ClientActionTypes.ADD_DATA_SOURCE_ERROR]
      .map(x => ({ type: x }))
      .map((x, i) => (i === 0 ? x : { ...x, payload: expectedError }));
    engagementService.updateDataSource = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(addDataSource(payload));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle update data source', async () => {
    const payload = {};
    const expectedActions = [
      ClientActionTypes.UPDATE_DATA_SOURCE,
      ClientActionTypes.UPDATE_DATA_SOURCE_SUCCESS,
      ClientActionTypes.GET_CLIENT_DATA_SOURCES,
    ].map(x => ({
      type: x,
    }));
    engagementService.updateDataSource = jest.fn();

    await mockStore.dispatch(updateDataSource(payload));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle update data source error', async () => {
    const payload = {};
    const expectedError = new Error(mockErrorText);
    const expectedActions = [ClientActionTypes.UPDATE_DATA_SOURCE, ClientActionTypes.UPDATE_DATA_SOURCE_ERROR]
      .map(x => ({ type: x }))
      .map((x, i) => (i === 0 ? x : { ...x, payload: expectedError }));
    engagementService.updateDataSource = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(updateDataSource(payload));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle delete data source', async () => {
    const payload = {};
    const expectedActions = [
      ClientActionTypes.DELETE_DATA_SOURCE,
      ClientActionTypes.DELETE_DATA_SOURCE_SUCCESS,
      ClientActionTypes.GET_CLIENT_DATA_SOURCES,
    ].map(x => ({
      type: x,
    }));
    engagementService.deleteDataSource = jest.fn();

    await mockStore.dispatch(deleteDataSource(payload));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle delete data source error', async () => {
    const payload = {};
    const expectedError = new Error(mockErrorText);
    const expectedActions = [
      ClientActionTypes.DELETE_DATA_SOURCE,
      ClientActionTypes.DELETE_DATA_SOURCE_ERROR,
      ErrorActionTypes.ADD_GLOBAL_ERROR,
    ]
      .map(x => ({ type: x }))
      .map((x, i) => (i !== 2 ? x : { ...x, payload: expectedError }));
    engagementService.deleteDataSource = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(deleteDataSource(payload));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle load agent', async () => {
    const orgId = '010ELV';
    const subOrg = {
      type: 'org',
      address1: '123 test',
      employees: '12121',
      id: '12121',
      ipAddressRanges: [],
      minPasswordCharMix: 3,
      minPasswordLength: 12,
      name: 'New',
    };
    const agents = [
      {
        active: true,
        agentVersion: '58.24',
        id: '010EUP08000000000002',
        lastUpgraded: '2020-11-16T11:46:11Z',
        name: 'cldedemerspe11',
        platform: 'win64',
        orgId,
        subOrg: {
          address1: '123 test',
          employees: '12121',
          id: '12121',
          ipAddressRanges: [],
          minPasswordCharMix: 3,
          minPasswordLength: 12,
          name: 'New',
          type: 'org',
        },
      },
    ];

    const dataRequestsBySecureAgents = [];

    const expectedActions = [
      { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST },
      { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_SUCCESS, payload: { agents, dataRequestsBySecureAgents } },
    ];

    informaticaService.getAgents = jest.fn().mockImplementation(() => {
      return agents;
    });
    dataRequestService.dataRequestsByAgentId = jest.fn().mockImplementation(() => {
      return dataRequestsBySecureAgents;
    });
    informaticaService.getOrg = jest.fn().mockImplementation(() => {
      return subOrg;
    });

    await mockStore.dispatch(loadAgents(orgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle load agent error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const orgId = '010ELV';
    const expectedActions = [
      { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST },
      { type: ClientActionTypes.ORG_AGENTS_GET_REQUEST_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];

    informaticaService.getAgents = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(loadAgents(orgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get connection template list', async () => {
    const expectedList = {
      totalCount: 2,
      items: [
        {
          id: '49dfe66b-7cdf-45b9-88c0-c02f301d3ee2',
          name: 'Flat File',
          description: 'CSV Connector',
          kind: 'Extraction',
          type: 'CSVFile',
          tagIds: ['39674b86-2b2a-4854-aa02-59857ac3aadb'],
          propertiesCount: 5,
          currentState: {
            version: 2,
            revision: 5,
            publishState: 'Published',
            timestamp: '2020-11-05T14:25:56.691Z',
            createdBy: 'dhshinde@deloitte.com',
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
        },
        {
          id: 'e1f9a673-04ca-4236-9967-d77d6483cd97',
          name: 'NetSuite System',
          description: 'NetSuite System',
          kind: 'Source',
          type: 'TOOLKIT',
          tagIds: ['12543743-2cd1-483e-84f1-b7ee99c0bf1f'],
          propertiesCount: 14,
          currentState: {
            version: 1,
            revision: 2,
            publishState: 'Published',
            timestamp: '2019-01-17T14:18:49.589Z',
            createdBy: 'azhashaik@deloitte.com',
            comment: null,
            sourceEnv: null,
            sourceEnvVersion: 0,
          },
        },
      ],
    };
    const expectedActions = [
      { type: ClientActionTypes.GET_CON_TEMP_PUBLISHED },
      { type: ClientActionTypes.GET_CON_TEMP_PUBLISHED_SUCCESS, payload: expectedList },
    ];
    bundleService.fetchAllPublishedConTemp = jest.fn().mockImplementation(() => {
      return expectedList;
    });

    await mockStore.dispatch(getAllPublishedConnTemp());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get connection template list error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const expectedActions = [
      { type: ClientActionTypes.GET_CON_TEMP_PUBLISHED },
      { type: ClientActionTypes.GET_CON_TEMP_PUBLISHED_ERROR, payload: expectedError },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];
    bundleService.fetchAllPublishedConTemp = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getAllPublishedConnTemp());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get run time environment list', async () => {
    const entity = {
      id: 'df1f00ae-89d5-48b7-b38e-256a12199f7c',
      name: 'Entity_sm',
      isFromMat: false,
      matEntityId: null,
      subOrgId: '0003MI',
    };
    const envList = [
      {
        id: '0003MI25000000000002',
        orgId: '0003MI',
        name: 'USCLDsmola01',
        agentCount: 1,
      },
      {
        id: '0003MI25000000000003',
        orgId: '0003MI',
        name: 'USPRNDEELANCHE3',
        agentCount: 1,
      },
    ];

    const expectedActions = [
      { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT },
      { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_SUCCESS, payload: envList },
    ];

    clientService.getEntity = jest.fn().mockImplementation(() => {
      return entity;
    });
    informaticaService.getRuntimeEnvironments = jest.fn().mockImplementation(() => {
      return envList;
    });
    await mockStore.dispatch(getConnectionRuntimeEnvironments(entity.subOrgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get run time environment list error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorText, key: 123 });
    const entity = {
      id: 'df1f00ae-89d5-48b7-b38e-256a12199f7c',
      name: 'Entity_sm',
      isFromMat: false,
      matEntityId: null,
      subOrgId: '0003MI',
    };
    const expectedActions = [
      { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT },
      { type: ClientActionTypes.GET_CLIENT_RUNTIME_ENVIRONMENT_ERROR, payload: expectedError },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];
    clientService.getEntity = jest.fn().mockImplementation(() => {
      throw expectedError;
    });
    informaticaService.getRuntimeEnvironments = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getConnectionRuntimeEnvironments(entity.subOrgId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle test connection', async () => {
    const data = {};
    const expectedActions = [
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST },
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST_SUCCESS, payload: [] },
    ];

    engagementService.testConnection = jest.fn().mockImplementation(() => {
      return [];
    });

    await mockStore.dispatch(testConnection(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle test connection error', async () => {
    const data = {};
    const expectedError = new Error(mockErrorText);
    const expectedActions = [
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST },
      {
        type: ClientActionTypes.TEST_CONNECTION_REQUEST_ERROR,
        payload: expectedError,
      },
    ];
    engagementService.testConnection = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(testConnection(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle test existing connection', async () => {
    const data = '1234';
    const expectedActions = [
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST },
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST_SUCCESS, payload: [] },
    ];

    engagementService.testExistingConnection = jest.fn().mockImplementation(() => {
      return [];
    });

    await mockStore.dispatch(testExistingConnection(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle test existing connection error', async () => {
    const data = '1234';
    const expectedError = new Error(mockErrorText);
    const expectedActions = [
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST },
      { type: ClientActionTypes.TEST_CONNECTION_REQUEST_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    engagementService.testExistingConnection = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(testExistingConnection(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle update client uses secure agent', async () => {
    const client = { id: '1234' };
    const expectedActions = [
      { type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT },
      { type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_SUCCESS, payload: client },
    ];

    clientService.updateClientUsesSecureAgent = jest.fn().mockImplementation(() => {
      return client;
    });

    await mockStore.dispatch(updateClientUsesSecureAgent(client.id, true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle update client uses secure agent error', async () => {
    const expectedError = new Error(mockErrorText);
    const expectedActions = [
      { type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT },
      { type: ClientActionTypes.UPDATE_CLIENT_USES_SECURE_AGENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    clientService.updateClientUsesSecureAgent = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(updateClientUsesSecureAgent('123', true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
