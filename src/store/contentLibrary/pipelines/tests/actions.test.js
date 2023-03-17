import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import ServerError from '../../../../utils/serverError';
import { initialState } from '../reducer';
import { CLPipelinesActionTypes } from '../actionTypes';
import pipelineService from '../../../../services/pipeline.service';
import {
  getCLPipelines,
  addCLPipeline,
  updateCLPipeline,
  deleteCLPipeline,
  approvePipeline,
  rejectPipeline,
  submitPipeline,
} from '../actions';
import { ErrorActionTypes } from '../../../errors/actionTypes';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  contentLibraryPipelines: initialState,
});

const mockErrorMessage = 'Test message error';

describe('CRUD CLpipelines actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('GetPipelines success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST },
      { type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS, payload: [] },
    ];

    pipelineService.getContendLibraryPipelines = jest.fn().mockImplementation(() => {
      return [];
    });

    await mockStore.dispatch(getCLPipelines());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('GetPipelines error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST },
      { type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.getContendLibraryPipelines = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getCLPipelines());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('AddPipeline success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.POST_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.POST_CL_PIPELINE_SUCCESS },
    ];

    pipelineService.addCLPipeline = jest.fn();

    await mockStore.dispatch(addCLPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('AddPipeline error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.POST_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.POST_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.addCLPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(addCLPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('UpdatePipeline success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS },
    ];

    pipelineService.updateCLPipeline = jest.fn();

    await mockStore.dispatch(updateCLPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('UpdatePipeline error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.updateCLPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(updateCLPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('DeletePipeline success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_SUCCESS },
    ];

    pipelineService.deleteCLPipeline = jest.fn();

    await mockStore.dispatch(deleteCLPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('DeletePipeline error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.deleteCLPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(deleteCLPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('ApprovePipeline success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_SUCCESS },
    ];

    pipelineService.approvePipeline = jest.fn();

    await mockStore.dispatch(approvePipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('ApprovePipeline error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.approvePipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(approvePipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('RejectPipeline success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_SUCCESS },
    ];

    pipelineService.rejectPipeline = jest.fn();

    await mockStore.dispatch(rejectPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('RejectPipeline error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.rejectPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(rejectPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('SubmitPipeline success', async () => {
    const expectedActions = [
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS },
    ];

    pipelineService.submitPipeline = jest.fn();

    await mockStore.dispatch(submitPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('SubmitPipeline error', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST },
      { type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: error },
    ];
    pipelineService.submitPipeline = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(submitPipeline());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
