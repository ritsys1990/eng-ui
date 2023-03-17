import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import securityService from '../../../services/security.service';
import {
  getClientExternalRecertificationStatus,
  getClientPermissions,
  getClientRecertificationStatus,
  getEngagementListPermissions,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { SecurityActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';
import { ErrorActionTypes } from '../../errors/actionTypes';
import { initialState } from '../reducer';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  security: initialState,
});

const mockClientId = '1234-5678-9012-3456';
const mockErrorMessage = 'Test message error';

describe('Security service actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('should get client permissions success', async () => {
    const clientId = mockClientId;
    const permissions = {};
    const expectedActions = [
      { type: SecurityActionTypes.GET_CLIENT_PERMISSIONS },
      {
        type: SecurityActionTypes.GET_CLIENT_PERMISSIONS_SUCCESS,
        payload: { permissions, clientId },
      },
    ];

    securityService.getClientPermissions = jest.fn().mockImplementation(() => {
      return permissions;
    });
    await mockStore.dispatch(getClientPermissions(clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client permissions error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: SecurityActionTypes.GET_CLIENT_PERMISSIONS },
      {
        type: SecurityActionTypes.GET_CLIENT_PERMISSIONS_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    securityService.getClientPermissions = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getClientPermissions(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client recertification success', async () => {
    const recertification = {
      status: 'Status',
    };

    const expectedActions = [
      { type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS },
      {
        type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_SUCCESS,
        payload: recertification,
      },
    ];

    securityService.getClientRecertificationStatus = jest.fn().mockImplementation(() => {
      return recertification;
    });

    await mockStore.dispatch(getClientRecertificationStatus(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client recertification error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS },
      {
        type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    securityService.getClientRecertificationStatus = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getClientRecertificationStatus(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client external recertification success', async () => {
    const recertification = {
      status: 'Status',
    };

    const expectedActions = [
      { type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS },
      {
        type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_SUCCESS,
        payload: recertification,
      },
    ];

    securityService.getClientExternalRecertificationStatus = jest.fn().mockImplementation(() => {
      return recertification;
    });

    await mockStore.dispatch(getClientExternalRecertificationStatus(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get client external recertification error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS },
      {
        type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_ERROR,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];
    securityService.getClientExternalRecertificationStatus = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getClientExternalRecertificationStatus(mockClientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get engagement list permissions success', async () => {
    const expectedActions = [
      { type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_REQUEST },
      {
        type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_SUCCESS,
        payload: [{ id: mockClientId, permissions: true }],
      },
    ];

    securityService.getEngagementPermissions = jest.fn().mockImplementation(() => {
      return { pages: true };
    });
    await mockStore.dispatch(getEngagementListPermissions([mockClientId]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get engagement list permissions error', async () => {
    const expectedError = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
      {
        type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_ERROR,
      },
    ];
    securityService.getEngagementPermissions = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getEngagementListPermissions([mockClientId]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
