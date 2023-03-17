import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import pipelineService from '../../../../services/pipeline.service';
import {
  getPipelineList,
  createPipeline,
  removePipeline,
  updatePipeline,
  getCLPipelineList,
  submitCLPipeline,
  pipelineNameExists,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { EngPipelinesActionTypes } from '../actionTypes';
import ServerError from '../../../../utils/serverError';
import { ErrorActionTypes } from '../../../errors/actionTypes';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  errors: ImmutableMap({
    errors: [],
  }),
});

const mockEngagementId = '1234-5678-9012-3456';
const mockErrorMessage = 'Test message error';
const mockPipelineName = 'new pi5 plan';
const mockPipelineId = '1234-5432-1234-9877';

describe('EngagementPipeline actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle getPipelineList with success flow ', async () => {
    const result = {
      items: [
        {
          additionalComment: null,
          clients: [],
          createdDate: '2021-05-26T15:30:15.024Z',
          engagementId: '9f82ccff-35bc-462f-b203-dc073cc786df',
          id: 'd671d232-deb5-4927-be5b-d2a7c624aa38',
          isAutoMode: false,
          isDeleted: false,
          isLatest: true,
          modifiedDate: null,
          pipelineDescription: '',
          pipelineName: 'Hello test 123',
          pipelineSource: 'Cortex',
          status: 'Draft',
          templateId: null,
          versionNumber: 1,
          cloningStatus: 'Success',
          workpapersInformation: [],
        },
      ],
      totalCount: 2,
    };
    const expectedActions = [
      { type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_REQUEST },
      {
        type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_SUCCESS,
        payload: result,
      },
    ];
    const engagementId = mockEngagementId;

    pipelineService.getPipelineList = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(getPipelineList(engagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getPipelineList with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const engagementId = mockEngagementId;
    const expectedActions = [
      { type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_REQUEST },
      { type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    pipelineService.getPipelineList = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getPipelineList(engagementId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle createPipeline with success flow ', async () => {
    const data = [{ pipelineName: mockPipelineName, pipelineDescription: '', pipelineSource: 'Trifacta', id: '' }];
    const engagementId = mockEngagementId;

    const expectedActions = [
      { type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_REQUEST },
      {
        type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_SUCCESS,
        payload: data,
      },
    ];

    pipelineService.createPipeline = jest.fn().mockImplementation(() => {
      return data;
    });

    await mockStore.dispatch(createPipeline(engagementId, data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle createPipeline with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const data = [{ pipelineName: mockPipelineName, pipelineDescription: '', pipelineSource: 'Trifacta', id: '' }];
    const engagementId = mockEngagementId;
    const expectedActions = [
      { type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_REQUEST },
      { type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_PIPELINE_ERROR, payload: error },
    ];

    pipelineService.createPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(createPipeline(engagementId, data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle removePipeline with success flow ', async () => {
    const result = [{ pipelineId: '123', engagementId: mockEngagementId }];

    const expectedActions = [
      { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_REQUEST },
      { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_SUCCESS, payload: result },
    ];

    pipelineService.removePipeline = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(removePipeline(result));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle removePipeline with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_REQUEST },
      { type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    pipelineService.removePipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(removePipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle updatePipeline with success flow ', async () => {
    const data = [{ pipelineName: mockPipelineName, pipelineDescription: '', pipelineSource: 'Trifacta', id: '' }];
    const engagementId = mockEngagementId;

    const expectedActions = [
      { type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_REQUEST },
      {
        type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_SUCCESS,
        payload: data,
      },
    ];

    pipelineService.updatePipeline = jest.fn().mockImplementation(() => {
      return data;
    });

    await mockStore.dispatch(updatePipeline(engagementId, data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle updatePipeline with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const data = [{ pipelineName: mockPipelineName, pipelineDescription: '', pipelineSource: 'Trifacta', id: '' }];
    const engagementId = mockEngagementId;
    const expectedActions = [
      { type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_REQUEST },
      { type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_ERROR },
      { type: ErrorActionTypes.UPDATE_PIPELINE_ERROR, payload: error },
    ];

    pipelineService.updatePipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(updatePipeline(engagementId, data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getCLPipelineList with success flow ', async () => {
    const result = {
      items: [
        {
          additionalComment: null,
          clients: [],
          cloningStatus: 'None',
          createdDate: '2021-05-26T15:30:15.024Z',
          engagementId: '9f82ccff-35bc-462f-b203-dc073cc786df',
          id: 'd671d232-deb5-4927-be5b-d2a7c624aa38',
          isAutoMode: false,
          isDeleted: false,
          isLatest: true,
          modifiedDate: null,
          pipelineDescription: '',
          pipelineName: 'Hello test 123',
          pipelineSource: 'Cortex',
          status: 'Draft',
          templateId: null,
          versionNumber: 1,
          workpapersInformation: [],
        },
      ],
      totalCount: 1,
      clear: true,
    };
    const expectedActions = [
      { type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST },
      {
        type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS,
        payload: result,
      },
    ];

    pipelineService.getCLPipelineList = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(getCLPipelineList());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle getCLPipelineList with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST },
      { type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR },
      { type: ErrorActionTypes.ADD_PIPELINE_ERROR, payload: error },
    ];

    pipelineService.getCLPipelineList = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getCLPipelineList());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle submitCLPipeline with success flow ', async () => {
    const data = [{ pipelineName: mockPipelineName, pipelineId: mockPipelineId }];
    const engagementId = mockEngagementId;

    const expectedActions = [
      { type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_REQUEST },
      {
        type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_SUCCESS,
        payload: data,
      },
    ];

    pipelineService.submitCLPipeline = jest.fn().mockImplementation(() => {
      return data;
    });

    await mockStore.dispatch(submitCLPipeline(engagementId, data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle submitCLPipeline with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const data = [{ pipelineName: mockPipelineName, pipelineId: mockPipelineId }];
    const engagementId = mockEngagementId;
    const expectedActions = [
      { type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_REQUEST },
      { type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];

    pipelineService.submitCLPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(submitCLPipeline(engagementId, data));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle pipelineNameExists with success flow ', async () => {
    const data = [{ pipelineName: mockPipelineName, pipelineId: mockPipelineId }];
    const engagementId = mockEngagementId;
    const pipelineName = mockPipelineName;

    const expectedActions = [];

    pipelineService.pipelineNameExists = jest.fn().mockImplementation(() => {
      return data;
    });

    await mockStore.dispatch(pipelineNameExists(engagementId, pipelineName));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle pipelineNameExists with error flow ', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const engagementId = mockEngagementId;
    const pipelineName = mockPipelineName;
    const expectedActions = [{ type: ErrorActionTypes.ADD_PIPELINE_ERROR, payload: error }];

    pipelineService.pipelineNameExists = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(pipelineNameExists(engagementId, pipelineName));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
