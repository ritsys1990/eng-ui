import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import dataExchangeService from '../../../services/data-exchange.service';
import {
  linkOmniaEngagement,
  submitFileSharingRequest,
  checkFileSharingRequestStatusById,
  getSendToOmniaOutputHistory,
  getBriefLinkedOmniaEngagements,
  unlinkOmniaEngagement,
} from '../actions';
import { WPProcessStep3ActionTypes } from '../../workpaperProcess/step3/actionTypes';
import AnalyticsUIService from '../../../services/analytics-ui.service';
import { DataExchangeActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';
import { ErrorActionTypes } from '../../errors/actionTypes';
import { Map as ImmutableMap } from 'immutable';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

const mockEngagementId = '99b6ffad-7f52-4297-a212-553c9352be52';
const mockOmniaEngagementId = 'b67bf524-3fc1-4467-9719-94c21bc83ffe';
const mockOutputId = '4321-8765-2198-7654';
const mockToken = '1234-5678-9012-3456';
const mockErrorMessage = 'Test message error';
const mockFileName = 'file_example_XLSX_100 – 10';
const mockOmniaEngagementFileId = '9638-5274-1963-8527';

describe('OmniaEngagements actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle linkOmniaEngagement with success flow', async () => {
    const result = {
      clientId: 'c8337373-2494-41b3-beef-74a256d77002',
      engagementId: mockEngagementId,
      linkFailReason: null,
      omniaHomeUrl: 'https://d3omniause2.aaps.deloitte.com',
    };
    const expectedActions = [
      { type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT },
      {
        type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_SUCCESS,
        payload: result,
      },
    ];
    const token = mockToken;

    dataExchangeService.linkOmniaEngagement = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(linkOmniaEngagement(token));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle linkOmniaEngagement with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT },
      { type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];
    const token = mockToken;

    dataExchangeService.linkOmniaEngagement = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(linkOmniaEngagement(token));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle submitFileSharingRequest with success flow', async () => {
    const data = {
      cortexEngagementId: mockEngagementId,
      omniaEngagementId: mockOmniaEngagementId,
      filePath:
        '/dev/cortex/filesystem/US/c8337373-2494-41b3-beef-74a256d77002_Elite Running _ Co. _ Omnia/Engagement/DEV Cortex Testing 20/Workitems/Omnia_ab16f136-916e-40ff-b4e9-7d872cab5284/Workpaper Outputs/tblbd71783cnbe15n4c76n96denf75e26969d55.csv',
      outputId: mockOutputId,
      fileName: mockFileName,
      isTrialBalance: false,
    };
    const result = {
      status: 'InProgress',
      failedReason: null,
      errorCode: null,
      outputId: mockOutputId,
      fileName: mockFileName,
      omniaEngagementFileId: '6fc67fc0-7154-462e-bbaf-17d6fea99d0f',
    };
    const { outputId, omniaEngagementFileId } = result;
    const expectedActions = [
      { type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST },
      {
        type: WPProcessStep3ActionTypes.UPDATE_OUTPUTS,
        payload: { outputId, omniaEngagementFileId },
      },
      {
        type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_SUCCESS,
        payload: result,
      },
    ];

    dataExchangeService.submitFileSharingRequest = jest.fn().mockImplementation(() => {
      return result;
    });

    AnalyticsUIService.addOmniaEngagementFileId = jest.fn().mockImplementation(() => {});

    await mockStore.dispatch(submitFileSharingRequest(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle submitFileSharingRequest with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const data = {
      cortexEngagementId: mockEngagementId,
      omniaEngagementId: mockOmniaEngagementId,
      filePath:
        '/dev/cortex/filesystem/US/c8337373-2494-41b3-beef-74a256d77002_Elite Running _ Co. _ Omnia/Engagement/DEV Cortex Testing 20/Workitems/Omnia_ab16f136-916e-40ff-b4e9-7d872cab5284/Workpaper Outputs/tblbd71783cnbe15n4c76n96denf75e26969d55.csv',
      outputId: mockOutputId,
      fileName: mockFileName,
      isTrialBalance: false,
    };
    const expectedActions = [
      { type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST },
      { type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];

    dataExchangeService.submitFileSharingRequest = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(submitFileSharingRequest(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle checkFileSharingRequestStatusById with success flow', async () => {
    const result = {
      status: 'InProgress',
      failedReason: null,
      errorCode: null,
      outputId: mockOutputId,
      fileName: mockFileName,
      omniaEngagementFileId: 'cda5a8a8-7dcb-415c-a76f-1ccd2ca1028d',
    };
    const expectedActions = [
      { type: DataExchangeActionTypes.FILE_SHARING_REQUEST_SATUS },
      {
        type: DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_SUCCESS,
        payload: result,
      },
    ];
    const omniaEngagementFileId = mockOmniaEngagementFileId;

    dataExchangeService.checkFileSharingRequestStatusById = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(checkFileSharingRequestStatusById(omniaEngagementFileId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle checkFileSharingRequestStatusById with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: DataExchangeActionTypes.FILE_SHARING_REQUEST_SATUS },
      { type: DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];
    const omniaEngagementFileId = mockOmniaEngagementFileId;

    dataExchangeService.checkFileSharingRequestStatusById = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(checkFileSharingRequestStatusById(omniaEngagementFileId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getSendToOmniaOutputHistory with success flow', async () => {
    const result = [
      {
        omniaEngagementFileId: 'dc5f0b01-5551-4ebd-84c9-1e5c34aedbd3',
        fileName: 'file_example_XLSX_100 – 10-03-17-2021-23-25-07.xlsx',
        createdDate: '2021-03-17T23:25:07.108Z',
        createBy: 'depanchal@deloitte.com',
        lastUpdatedDate: '2021-03-17T23:25:50.194Z',
        status: 'Failed',
      },
      {
        omniaEngagementFileId: 'a373209e-2c9e-4b0b-965b-ec59ec37c343',
        fileName: 'file_example_XLSX_100 – 10-03-18-2021-02-28-06.csv',
        createdDate: '2021-03-18T02:28:06.719Z',
        createBy: 'depanchal@deloitte.com',
        lastUpdatedDate: '2021-03-18T02:29:00.358Z',
        status: 'Success',
      },
    ];
    const expectedActions = [
      { type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_REQUEST },
      {
        type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_SUCCESS,
        payload: result,
      },
    ];
    const outputId = mockOutputId;

    dataExchangeService.getSendToOmniaOutputHistory = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(getSendToOmniaOutputHistory(outputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getSendToOmniaOutputHistory with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_REQUEST },
      { type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];
    const outputId = mockOutputId;

    dataExchangeService.getSendToOmniaOutputHistory = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getSendToOmniaOutputHistory(outputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getBriefLinkedOmniaEngagements with success flow', async () => {
    const result = [
      {
        omniaEngagementId: 'e214d6f0-ab97-4ff0-84e5-590fdd720ab4',
        omniaEngagementName: 'Cortex Testing',
        isReadyForDeletion: true,
      },
    ];
    const expectedActions = [
      { type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_STATUS },
      {
        type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_SUCCESS,
        payload: result,
      },
    ];
    const cortexEngagementId = mockEngagementId;

    dataExchangeService.getBriefLinkedOmniaEngagements = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(getBriefLinkedOmniaEngagements(cortexEngagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getBriefLinkedOmniaEngagements with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_STATUS },
      { type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];
    const cortexEngagementId = mockEngagementId;

    dataExchangeService.getBriefLinkedOmniaEngagements = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getBriefLinkedOmniaEngagements(cortexEngagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle unlinkOmniaEngagement with success flow', async () => {
    const data = {
      cortexEngagementId: mockEngagementId,
      omniaEngagementId: mockOmniaEngagementId,
      matNumber: 'MAT-E122396-20',
    };
    const result = true;
    const expectedActions = [
      { type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_STATUS },
      {
        type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_SUCCESS,
      },
    ];

    dataExchangeService.unlinkOmniaEngagement = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(unlinkOmniaEngagement(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle unlinkOmniaEngagement with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const data = {
      cortexEngagementId: mockEngagementId,
      omniaEngagementId: mockOmniaEngagementId,
      matNumber: 'MAT-E122396-20',
    };

    const expectedActions = [
      { type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_STATUS },
      { type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];

    dataExchangeService.unlinkOmniaEngagement = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(unlinkOmniaEngagement(data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
