import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import engagementService from '../../../services/engagement.service';
import securityService from '../../../services/security.service';
import analyticsUIService from '../../../services/analytics-ui.service';
import {
  getEngagementById,
  getMyEngagementsByClient,
  getMyEngagementsUserRole,
  getDMTDetails,
  initiateLegalhold,
  approveDataSourceSubscription,
  configureDataSourceExtractionScript,
  deleteDataSourceConfig,
  deleteEngagement,
  getEngagementsByClient,
  getMatClientEngagements,
  provisionEngagements,
  reconcileEngagements,
  rejectDataSourceSubscription,
  rollforwardEngagement,
  updateIsReconcileModalOpen,
  deleteConnection,
  createEngagementUser,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { EngagementActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';
import { ErrorActionTypes } from '../../errors/actionTypes';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

const MOCK_ID = '1234-5678-9012-3456';
const MOCK_DETAIL_ID = 'f1531b1a-855f-451d-87c6-4d7b467cbbc8';
const error = new ServerError({ status: 500, message: 'Test message error', key: 123 });
const matEngagements = [
  { id: '1234', name: 'Test Entity' },
  { id: '5678', name: 'Test Entity 2' },
];
const engagementDetails = {
  id: MOCK_DETAIL_ID,
  legalHoldStatus: 'None',
  linkedOmniaEngagements: [],
  matId: null,
};

describe('clientEngagement actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle getEngagementById with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_ENGAGEMENT_REQUEST },
      {
        type: EngagementActionTypes.GET_ENGAGEMENT_SUCCESS,
        payload: engagementDetails,
      },
    ];
    const id = MOCK_ID;

    engagementService.getEngagementById = jest.fn().mockImplementation(() => {
      return engagementDetails;
    });

    await mockStore.dispatch(getEngagementById(id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getEngagementById with error flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_ENGAGEMENT_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];

    engagementService.getEngagementById = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getEngagementById());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMyEngagementsByClient with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_ENGAGEMENT_LIST_REQUEST },
      {
        type: EngagementActionTypes.GET_ENGAGEMENT_LIST_SUCCESS,
        payload: engagementDetails,
      },
    ];

    engagementService.getMyEngagementsByClient = jest.fn().mockImplementation(() => {
      return engagementDetails;
    });

    await mockStore.dispatch(getMyEngagementsByClient(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMyEngagementsByClient with error flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_ENGAGEMENT_LIST_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: EngagementActionTypes.GET_ENGAGEMENT_LIST_ERROR,
        payload: { err: error },
      },
    ];

    engagementService.getMyEngagementsByClient = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getMyEngagementsByClient(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMyEngagementsUserRole with success flow ', async () => {
    const list = {
      id: MOCK_DETAIL_ID,
      legalHoldStatus: 'None',
      linkedOmniaEngagements: [],
      matId: null,
    };

    const expectedActions = [
      { type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_REQUEST },
      {
        type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_SUCCESS,
        payload: list,
      },
    ];
    const engagementId = MOCK_ID;

    securityService.getMyEngagementsUserRole = jest.fn().mockImplementation(() => {
      return list;
    });

    await mockStore.dispatch(getMyEngagementsUserRole(engagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMyEngagementsUserRole with error flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_ERROR,
        payload: { err: error },
      },
    ];
    const engagementId = MOCK_ID;

    securityService.getMyEngagementsUserRole = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getMyEngagementsUserRole(engagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getDMTDetails with success flow ', async () => {
    const inputs = {
      id: MOCK_DETAIL_ID,
      legalHoldStatus: 'None',
      linkedOmniaEngagements: [],
      matId: null,
    };

    const expectedActions = [
      { type: EngagementActionTypes.GET_DMT_DATA },
      {
        type: EngagementActionTypes.GET_DMT_DATA_SUCCESS,
        payload: inputs,
      },
    ];
    const workPaperId = MOCK_ID;

    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return inputs;
    });

    await mockStore.dispatch(getDMTDetails(workPaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getDMTDetails with error flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_DMT_DATA },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: EngagementActionTypes.GET_DMT_DATA_ERROR,
      },
    ];
    const workPaperId = MOCK_ID;

    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getDMTDetails(workPaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle initiateLegalhold with success flow ', async () => {
    const expectedActions = [{ type: EngagementActionTypes.INITIATE_LEGAL_HOLD }];
    const engagementId = MOCK_ID;

    engagementService.initiateLegalhold = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(initiateLegalhold(engagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle initiateLegalhold with error flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.INITIATE_LEGAL_HOLD },
      {
        type: EngagementActionTypes.INITIATE_LEGAL_HOLD_ERROR,
        payload: { err: error },
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];
    const engagementId = MOCK_ID;

    engagementService.initiateLegalhold = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(initiateLegalhold(engagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getEngagementsByClient with success flow ', async () => {
    const list = {
      items: [
        {
          id: MOCK_DETAIL_ID,
          legalHoldStatus: 'None',
          linkedOmniaEngagements: [],
          matId: null,
        },
      ],
    };
    const { items } = list;
    const areEngagementsReconciled = items?.every(engagement => engagement.matId);
    const areEngagementsSynchedToOmnia = items?.every(engagement => engagement?.linkedOmniaEngagements.length);
    const expectedActions = [
      { type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST },
      {
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS,
        payload: {
          areEngagementsReconciled,
          areEngagementsSynchedToOmnia,
          engagements: items,
        },
      },
    ];

    engagementService.getEngagementsByClient = jest.fn().mockImplementation(() => {
      return list;
    });

    await mockStore.dispatch(getEngagementsByClient(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getEngagementsByClient with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_ERROR,
        payload: error,
      },
    ];

    engagementService.getEngagementsByClient = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getEngagementsByClient(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getMatClientEngagements with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS },
      { type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_SUCCESS, payload: matEngagements },
    ];

    engagementService.getMatClientEngagements = jest.fn().mockImplementation(() => {
      return matEngagements;
    });

    await mockStore.dispatch(getMatClientEngagements(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it.skip('handle getMatClientEngagements with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_ERROR,
        payload: error,
      },
    ];

    engagementService.getMatClientEngagements = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getMatClientEngagements(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle reconcileEngagements with success flow ', async () => {
    const list = {
      items: [
        {
          id: MOCK_DETAIL_ID,
          legalHoldStatus: 'None',
          linkedOmniaEngagements: [],
          matId: null,
        },
      ],
    };
    const { items } = list;
    const areEngagementsReconciled = items?.every(engagement => engagement.matId);
    const areEngagementsSynchedToOmnia = items?.every(engagement => engagement?.linkedOmniaEngagements.length);
    const expectedActions = [
      { type: EngagementActionTypes.RECONCILE_ENGAGEMENTS },
      { type: EngagementActionTypes.RECONCILE_ENGAGEMENTS_SUCCESS },
      { type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST },
      {
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS,
        payload: {
          areEngagementsReconciled,
          areEngagementsSynchedToOmnia,
          engagements: items,
        },
      },
    ];

    engagementService.reconсileEngagements = jest.fn().mockImplementation(() => {});
    engagementService.getEngagementsByClient = jest.fn().mockImplementation(() => {
      return list;
    });

    await mockStore.dispatch(reconcileEngagements(MOCK_ID));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle reconcileEngagements with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.RECONCILE_ENGAGEMENTS },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: EngagementActionTypes.RECONCILE_ENGAGEMENTS_ERROR,
        payload: error,
      },
    ];

    engagementService.reconсileEngagements = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(reconcileEngagements(matEngagements));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle updateIsReconcileModalOpen', async () => {
    const expectedActions = [
      {
        type: EngagementActionTypes.UPDATE_IS_RECONCILE_MODAL_OPEN,
        payload: true,
      },
    ];

    mockStore.dispatch(updateIsReconcileModalOpen(true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle provisionEngagements with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.PROVISION_ENGAGEMENTS },
      {
        type: EngagementActionTypes.PROVISION_ENGAGEMENTS_SUCCESS,
      },
    ];

    engagementService.provisionEngagement = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(provisionEngagements([]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle provisionEngagements with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.PROVISION_ENGAGEMENTS },
      {
        type: EngagementActionTypes.PROVISION_ENGAGEMENTS_ERROR,
      },
    ];

    engagementService.provisionEngagement = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(provisionEngagements([]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle rollforwardEngagement with success flow ', async () => {
    const list = {
      items: [
        {
          id: MOCK_DETAIL_ID,
          legalHoldStatus: 'None',
          linkedOmniaEngagements: [],
          matId: null,
        },
      ],
    };
    const { items } = list;
    const areEngagementsReconciled = items?.every(engagement => engagement.matId);
    const areEngagementsSynchedToOmnia = items?.every(engagement => engagement?.linkedOmniaEngagements.length);

    const expectedActions = [
      { type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT },
      {
        payload: true,
        type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_SUCCESS,
      },
      {
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST,
      },
      {
        payload: {
          areEngagementsReconciled,
          areEngagementsSynchedToOmnia,
          engagements: items,
        },
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS,
      },
    ];

    engagementService.rollforwardEngagement = jest.fn().mockImplementation(() => {
      return true;
    });
    engagementService.getEngagementsByClient = jest.fn().mockImplementation(() => {
      return list;
    });

    await mockStore.dispatch(rollforwardEngagement([]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle rollforwardEngagement with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT },
      {
        payload: error,
        type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.rollforwardEngagement = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(rollforwardEngagement([]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteEngagement with success flow ', async () => {
    const list = {
      items: [
        {
          id: MOCK_DETAIL_ID,
          legalHoldStatus: 'None',
          linkedOmniaEngagements: [],
          matId: null,
        },
      ],
    };
    const { items } = list;
    const areEngagementsReconciled = items?.every(engagement => engagement.matId);
    const areEngagementsSynchedToOmnia = items?.every(engagement => engagement?.linkedOmniaEngagements.length);

    const expectedActions = [
      { type: EngagementActionTypes.DELETE_ENGAGEMENT },
      {
        type: EngagementActionTypes.DELETE_ENGAGEMENT_SUCCESS,
      },
      {
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST,
      },
      {
        payload: {
          areEngagementsReconciled,
          areEngagementsSynchedToOmnia,
          engagements: items,
        },
        type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS,
      },
    ];

    engagementService.deleteEngagement = jest.fn().mockImplementation(() => {
      return true;
    });
    engagementService.getEngagementsByClient = jest.fn().mockImplementation(() => {
      return list;
    });

    await mockStore.dispatch(deleteEngagement('123', '234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteEngagement with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.DELETE_ENGAGEMENT },
      {
        type: EngagementActionTypes.DELETE_ENGAGEMENT_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.deleteEngagement = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(deleteEngagement('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle approveDataSourceSubscription with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION },
      {
        type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_SUCCESS,
      },
    ];

    engagementService.approveDataSourceSubscription = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(approveDataSourceSubscription('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle approveDataSourceSubscription with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION },
      {
        type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.approveDataSourceSubscription = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(approveDataSourceSubscription('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle rejectDataSourceSubscription with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION },
      {
        type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_SUCCESS,
      },
    ];

    engagementService.rejectDataSourceSubscription = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(rejectDataSourceSubscription({}, '123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle rejectDataSourceSubscription with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION },
      {
        type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.rejectDataSourceSubscription = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(rejectDataSourceSubscription({}, '123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle configureDataSourceExtractionScript with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT },
      {
        type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_SUCCESS,
      },
    ];

    engagementService.configureDataSourceExtractionScript = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(configureDataSourceExtractionScript('123', 'Test', 'DB'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle configureDataSourceExtractionScript with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT },
      {
        type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.configureDataSourceExtractionScript = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(configureDataSourceExtractionScript('123', 'Test', 'DB'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle rejectDatadeleteDataSourceConfigSourceSubscription with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG },
      {
        type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_SUCCESS,
      },
    ];

    engagementService.deleteDataSourceConfig = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(deleteDataSourceConfig('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteDataSourceConfig with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG },
      {
        type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.deleteDataSourceConfig = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(deleteDataSourceConfig('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete source connection with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.DELETE_CONNECTION },
      {
        type: EngagementActionTypes.DELETE_CONNECTION_SUCCESS,
      },
    ];

    engagementService.deleteConnection = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(deleteConnection('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete source connection with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.DELETE_CONNECTION },
      {
        type: EngagementActionTypes.DELETE_CONNECTION_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    engagementService.deleteConnection = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(deleteConnection('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create engagement user with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_REQUEST },
      {
        type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_SUCCESS,
      },
    ];

    securityService.createEngagementUser = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(createEngagementUser('123', {}, false));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create engagement user with error flow', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_REQUEST },
      {
        payload: error,
        type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_ERROR,
      },
      {
        payload: error,
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
      },
    ];

    securityService.createEngagementUser = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(createEngagementUser('123', {}, false));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create engagement user but external with success flow ', async () => {
    const expectedActions = [
      { type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_REQUEST },
      {
        type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_SUCCESS,
      },
    ];

    securityService.createEngagementUser = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(createEngagementUser('123', {}, true));
    expect(securityService.createEngagementUser).not.toHaveBeenCalled();
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
