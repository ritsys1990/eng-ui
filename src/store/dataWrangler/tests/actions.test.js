import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import dataWranglerService from '../../../services/data-wrangler.service';
import {
  addDataSetToFlow,
  updateDatasetFilePath,
  importFlow,
  getFlowIsModified,
  isUserPartOfTrifactaGroup,
  getFlowDetails,
  validateFlowRecipes,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { DataWranglerActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';
import { ErrorActionTypes } from '../../errors/actionTypes';
import { initialState } from '../reducer';

const error = new ServerError({ status: 500, message: 'Test message error', key: 123 });

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  client: initialState,
});

const mockWorkpaperId = '1234-5678-9012-3456';

describe('CRUD client actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle add data set to flow ', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW },
      { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_SUCCESS },
    ];
    const validateMock = {};

    dataWranglerService.addDatasetToFlow = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(addDataSetToFlow('1223', '/test', '234234', 'test'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle add data set to flow error', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW },
      { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    dataWranglerService.addDatasetToFlow = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(addDataSetToFlow(12345));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update data set file path', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH },
      { type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_SUCCESS },
    ];
    const validateMock = {};

    dataWranglerService.updateDatasetFilePath = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(updateDatasetFilePath('1223', '/test'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update data set file path error', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH },
      { type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    dataWranglerService.updateDatasetFilePath = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(updateDatasetFilePath(12345));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update data set file path', async () => {
    const expectedActions = [];
    const validateMock = {};

    dataWranglerService.importFlow = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(importFlow('1223', '23232'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle update data set file path error', async () => {
    const expectedActions = [{ type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error }];

    dataWranglerService.importFlow = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(importFlow());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get flow is modified', async () => {
    const validateMock = 1;
    const expectedActions = [
      { type: DataWranglerActionTypes.GET_FLOW_MODIFIED, payload: { workpaperId: mockWorkpaperId } },
      {
        type: DataWranglerActionTypes.GET_FLOW_MODIFIED_SUCCESS,
        payload: { workpaperId: mockWorkpaperId, isFlowModified: validateMock },
      },
    ];

    dataWranglerService.flowIsModified = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(getFlowIsModified(mockWorkpaperId, '1223'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get flow is modified error', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.GET_FLOW_MODIFIED, payload: { workpaperId: mockWorkpaperId } },
      { type: DataWranglerActionTypes.GET_FLOW_MODIFIED_ERROR, payload: { workpaperId: mockWorkpaperId } },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    dataWranglerService.flowIsModified = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getFlowIsModified(mockWorkpaperId, 12345));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle to check if user is part of trifacta group', async () => {
    const validateMock = 1;
    const expectedActions = [];

    dataWranglerService.isUserPartOfTrifactaGroup = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(isUserPartOfTrifactaGroup('1223'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle to check if user is part of trifacta group error', async () => {
    const expectedActions = [{ type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error }];

    dataWranglerService.isUserPartOfTrifactaGroup = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(isUserPartOfTrifactaGroup());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get flow details', async () => {
    const validateMock = { data: 'test', id: '1' };
    const expectedActions = [
      { type: DataWranglerActionTypes.GET_FLOW_DETAILS, payload: { workpaperId: mockWorkpaperId } },
      {
        type: DataWranglerActionTypes.GET_FLOW_DETAILS_SUCCESS,
        payload: { flowDetails: validateMock, workpaperId: mockWorkpaperId },
      },
    ];

    dataWranglerService.getFlowDetails = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(getFlowDetails(mockWorkpaperId, '1223'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get flow details error', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.GET_FLOW_DETAILS, payload: { workpaperId: mockWorkpaperId } },
      { type: DataWranglerActionTypes.GET_FLOW_DETAILS_ERROR, payload: { workpaperId: mockWorkpaperId } },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    dataWranglerService.getFlowDetails = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getFlowDetails(mockWorkpaperId, 12345));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle validateFlowRecipes success flow ', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES, payload: { workpaperId: mockWorkpaperId } },
      { type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_SUCCESS, payload: { workpaperId: mockWorkpaperId } },
    ];
    const validateMock = {
      hasErrors: true,
    };

    dataWranglerService.validateFlowRecipes = jest.fn().mockImplementation(() => {
      return validateMock;
    });

    await mockStore.dispatch(validateFlowRecipes(mockWorkpaperId, 1234));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle create client with error flow', async () => {
    const expectedActions = [
      { type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES, payload: { workpaperId: mockWorkpaperId } },
      { type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_ERROR, payload: { workpaperId: mockWorkpaperId } },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    dataWranglerService.validateFlowRecipes = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(validateFlowRecipes(mockWorkpaperId, 12345));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
