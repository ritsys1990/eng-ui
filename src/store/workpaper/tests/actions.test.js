import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import workpaperService from '../../../services/workpaper.service';
import analyticsUIService from '../../../services/analytics-ui.service';
import bundlesService from '../../../services/bundles.service';
import {
  copyWorkpaper,
  addCentralizedDataEventsToAuditLog,
  getAddWorkpaperModalList,
  configureTrifactaBundleTransformation,
  createDataRequest,
  getChildWorkpapersStatusByWorkpaperId,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { WorkpaperActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../errors/actionTypes';
import ServerError from '../../../utils/serverError';

const mockWorkpaperName = 'Workpaper';
const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  workpaper: ImmutableMap({
    latestSearch: mockWorkpaperName,
  }),
});

const mockWorkpaperId = '1234-5678-9012-3456';
const mockErrorMessage = 'Test message error';

describe('workpaper actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle copyWorkpaper with success flow ', async () => {
    const workpaperId = mockWorkpaperId;
    const workpaperCopy = {
      name: 'Workpaper Copy',
    };
    const expectedActions = [
      { type: WorkpaperActionTypes.COPY_WORKPAPER_REQUEST },
      { type: WorkpaperActionTypes.COPY_WORKPAPER_SUCCESS, payload: workpaperCopy },
    ];

    workpaperService.copyWorkpaper = jest.fn().mockImplementationOnce(() => {
      return workpaperCopy;
    });

    await mockStore.dispatch(copyWorkpaper(workpaperId));

    workpaperService.copyWorkpaper.mockReset();

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle copyWorkpaper with error flow', async () => {
    const workpaperId = mockWorkpaperId;
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: WorkpaperActionTypes.COPY_WORKPAPER_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: WorkpaperActionTypes.COPY_WORKPAPER_ERROR,
      },
    ];

    workpaperService.copyWorkpaper = jest.fn().mockImplementationOnce(() => {
      throw error;
    });

    await mockStore.dispatch(copyWorkpaper(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle adding centralized data event with success flow ', async () => {
    const workpaperId = mockWorkpaperId;
    const eventStatus = mockWorkpaperId;
    const inputName = mockWorkpaperId;
    const centralizedDataCategory = mockWorkpaperId;

    const expectedActions = [
      { type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_REQUEST },
      { type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_SUCCESS },
    ];

    workpaperService.addCentralizedDatasetEvent = jest.fn().mockImplementationOnce(() => {
      return true;
    });

    await mockStore.dispatch(
      addCentralizedDataEventsToAuditLog(workpaperId, eventStatus, inputName, centralizedDataCategory)
    );

    workpaperService.addCentralizedDatasetEvent.mockReset();

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle adding centralized data event with error flow', async () => {
    const workpaperId = mockWorkpaperId;
    const eventStatus = mockWorkpaperId;
    const inputName = mockWorkpaperId;
    const centralizedDataCategory = mockWorkpaperId;

    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_ERROR,
      },
    ];

    workpaperService.addCentralizedDatasetEvent = jest.fn().mockImplementationOnce(() => {
      throw error;
    });

    await mockStore.dispatch(
      addCentralizedDataEventsToAuditLog(workpaperId, eventStatus, inputName, centralizedDataCategory)
    );
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handles getAddWorkpaperModalList with success flow ', async () => {
    const query = mockWorkpaperName;
    const clientId = mockWorkpaperId;
    const workpaperId = '9876-5432-1987-6543';

    const workpaper = {
      id: workpaperId,
      name: mockWorkpaperName,
    };

    const workpaperResponse = {
      items: [workpaper],
      totalCount: 1,
    };
    const analyticsResponse = {};
    analyticsResponse[workpaperId] = { tags: [] };

    const expectedPayload = {
      items: [{ ...workpaper, info: analyticsResponse[workpaperId] }],
      totalCount: 1,
    };

    const expectedActions = [
      { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_REQUEST, payload: query },
      { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_SUCCESS, payload: { list: expectedPayload, clear: true } },
    ];

    workpaperService.getPaginatedList = jest.fn().mockImplementationOnce(() => {
      return workpaperResponse;
    });

    analyticsUIService.getWorkpapersInfo = jest.fn().mockImplementationOnce(() => {
      return analyticsResponse;
    });

    await mockStore.dispatch(getAddWorkpaperModalList(query, clientId));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handles getAddWorkpaperModalList with error flow', async () => {
    const query = mockWorkpaperName;
    const clientId = mockWorkpaperId;
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_REQUEST, payload: query },
      {
        type: ErrorActionTypes.ADD_ADD_WORKPAPER_ERROR,
        payload: error,
      },
      {
        type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_ERROR,
        payload: { err: error },
      },
    ];

    workpaperService.getPaginatedList = jest.fn().mockImplementationOnce(() => {
      throw error;
    });

    await mockStore.dispatch(getAddWorkpaperModalList(query, clientId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handles getAddWorkpaperModalList with error flow on analytics response', async () => {
    const query = mockWorkpaperName;
    const clientId = mockWorkpaperId;
    const workpaperId = '9876-5432-1987-6543';

    const workpaper = {
      id: workpaperId,
      name: mockWorkpaperName,
    };

    const workpaperResponse = {
      items: [workpaper],
      totalCount: 1,
    };
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_REQUEST, payload: query },
      {
        type: ErrorActionTypes.ADD_ADD_WORKPAPER_ERROR,
        payload: error,
      },
      {
        type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_ERROR,
        payload: { err: error },
      },
      { type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_SUCCESS, payload: { list: workpaperResponse, clear: true } },
    ];

    workpaperService.getPaginatedList = jest.fn().mockImplementationOnce(() => {
      return workpaperResponse;
    });

    analyticsUIService.getWorkpapersInfo = jest.fn().mockImplementationOnce(() => {
      throw error;
    });

    await mockStore.dispatch(getAddWorkpaperModalList(query, clientId));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handles configureTrifactaBundleTransformation with success flow', async () => {
    const result = {
      bundleBaseId: '12345',
      bundleBaseName: '463686_bundle',
      bundlesCount: 1,
      lastUpdated: '2021-05-12T13:34:50.545Z',
      versionsCount: 55,
      tagIds: ['1234678'],
      description: null,
    };

    bundlesService.getBundlesFromId = jest.fn().mockImplementation(() => {
      return { result };
    });
    const expectedActions = [
      {
        type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION,
      },
      {
        type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_SUCCESS,
      },
    ];

    workpaperService.configureTrifactaBundleTransformation = jest.fn().mockImplementationOnce(() => {
      return true;
    });

    await mockStore.dispatch(
      configureTrifactaBundleTransformation(mockWorkpaperId, mockWorkpaperName, 'getPublishedBundleBaseList')
    );

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handles configureTrifactaBundleTransformation with error flow', async () => {
    const mockErrorText = 'dummy error';
    const expectedError = new Error(mockErrorText);

    const expectedActions = [
      { type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION },
      { type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];

    workpaperService.configureTrifactaBundleTransformation = jest.fn().mockImplementationOnce(() => {
      throw expectedError;
    });

    await mockStore.dispatch(
      configureTrifactaBundleTransformation(mockWorkpaperId, mockWorkpaperName, 'getPublishedBundleBaseList')
    );

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handles create data request', async () => {
    const result = [
      {
        bundleId: '234234-3535',
        dataRequestId: '34634534',
        dataRequestBundleId: '345345345',
        dataRequestTableNames: {
          34234234234: 'Test',
          345435345345: 'Test',
        },
      },
    ];

    analyticsUIService.createDataRequest = jest.fn().mockImplementation(() => {
      return result;
    });
    const expectedActions = [
      {
        type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST,
      },
      {
        type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_SUCCESS,
        payload: result,
      },
    ];

    await mockStore.dispatch(createDataRequest('123', ['353453'], { 2343: '2343' }));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle create data request error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST },
      { type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];
    analyticsUIService.createDataRequest = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(createDataRequest('123', ['353453'], { 2343: '2343' }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Get ChildWorkpapers Status', async () => {
    const childWPIds = '12345';

    const expectedActions = [
      { type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST },
      {
        type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS,
      },
    ];

    workpaperService.getChildWorkpapersStatus = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(getChildWorkpapersStatusByWorkpaperId(childWPIds));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Get child workpaper status with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      {
        type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      { type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR },
    ];

    workpaperService.getChildWorkpapersStatus = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getChildWorkpapersStatusByWorkpaperId(['123456']));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
