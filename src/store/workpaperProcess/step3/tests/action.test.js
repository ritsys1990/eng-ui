import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import workpaperService from '../../../../services/workpaper.service';
import analyticsService from '../../../../services/analytics-ui.service';
import dataWranglerService from '../../../../services/data-wrangler.service';
import stagingService from '../../../../services/staging.service';
import {
  saveTrifactaOutputToJE,
  saveOutputToJE,
  downloadAllOutputs,
  downloadOutputAsCSV,
  generateWorkbooks,
  getGenWBStatus,
  addDMToOutput,
  getAndSyncFlowOutputs,
  getConnectedDMInfo,
  clearConnectedDMInfo,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep3ActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../../errors/actionTypes';
import * as FilesHelper from '../../../../utils/fileHelper';
import { GenWBStatus, GenWBStep } from 'src/utils/workbooks.const';
import { v4 as uuidv4 } from 'uuid';
import ServerError from '../../../../utils/serverError';
import bundlesService from '../../../../services/bundles.service';

const mockWorkpaperId = '11111111-8d2c-45f3-b224-6d68ed475386';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  wpProcess: {
    step3: ImmutableMap({
      outputs: {},
      syncingOutputs: false,
    }),
    general: ImmutableMap({
      workpaper: {
        id: mockWorkpaperId,
      },
    }),
  },
});

const mockErrorMessage = 'some error';

window.scrollTo = jest.fn();

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';

const workpaperId = '11111111-8d2c-45f3-b224-6d68ed475386';

describe('Trifacta workpaper SaveToJe actions', () => {
  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle Trifacta workpaper SaveToJe with success flow ', async () => {
    const filePath = 'testfilePath';
    const nodeId = '1234';
    const outputType = 'JE';
    const outputId = 'output1234';
    const engagementId = 'eng1234';
    const outputListMock = {
      outputs: [
        {
          jeStatus: 'Completed',
        },
      ],
    };
    const saveToJEResponseMock = {
      name: 'SaveToJEResponse',
    };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE },
      { type: WPProcessStep3ActionTypes.GET_DATA },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: {
          type: 'success',
          key: uuidv4(),
          message: 'Request has been submitted to save content from Cortex to JE',
        },
      },
      { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_SUCCESS },
      { payload: undefined, type: WPProcessStep3ActionTypes.GET_DATA_SUCCESS },
    ];
    analyticsService.getWorkPapersOutputs = jest.fn().mockImplementationOnce(() => {
      return outputListMock;
    });
    analyticsService.triggerSaveToJEWithStandardDateFormat = jest.fn().mockImplementationOnce(() => {
      return saveToJEResponseMock;
    });
    await mockStore.dispatch(saveTrifactaOutputToJE(workpaperId, filePath, nodeId, outputType, outputId, engagementId));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });
  it('handle Trifacta workpaper SaveToJe with error flow ', async () => {
    const filePath = 'testfilePath';
    const nodeId = '1234';
    const outputType = 'JE';
    const outputId = 'output1234';
    const engagementId = 'eng1234';
    const outputListMock = {
      outputs: [
        {
          jeStatus: 'Failed',
        },
      ],
    };
    const saveToJEResponseMock = {
      name: 'SaveToJEResponse',
      isError: 'Error occured during the Data Load Process',
    };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE },
      { type: WPProcessStep3ActionTypes.GET_DATA },
      { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR },
      { payload: undefined, type: WPProcessStep3ActionTypes.GET_DATA_SUCCESS },
    ];
    analyticsService.getWorkPapersOutputs = jest.fn().mockImplementationOnce(() => {
      return outputListMock;
    });
    workpaperService.saveToJEOutputRequest = jest.fn().mockImplementationOnce(() => {
      return saveToJEResponseMock;
    });
    await mockStore.dispatch(saveTrifactaOutputToJE(workpaperId, filePath, nodeId, outputType, outputId, engagementId));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });
  it('handle Legacy workpaper SaveToJe with success flow ', async () => {
    const filePath = 'testfilePath';
    const nodeId = '1234';
    const outputType = 'JE';
    const outputId = 'output1234';
    const engagementId = 'eng1234';
    const outputListMock = {
      outputs: [
        {
          jeStatus: 'Completed',
        },
      ],
    };
    const saveToJEResponseMock = {
      name: 'SaveToJEResponse',
    };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.GET_DATA },
      { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_SUCCESS },
      { payload: undefined, type: WPProcessStep3ActionTypes.GET_DATA_SUCCESS },
    ];
    analyticsService.getWorkPapersOutputs = jest.fn().mockImplementationOnce(() => {
      return outputListMock;
    });
    workpaperService.saveToJEOutputRequest = jest.fn().mockImplementationOnce(() => {
      return saveToJEResponseMock;
    });
    await mockStore.dispatch(saveOutputToJE(workpaperId, filePath, nodeId, outputType, outputId, engagementId));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });
  it('handle Legacy workpaper SaveToJe with error flow ', async () => {
    const filePath = 'testfilePath';
    const nodeId = '1234';
    const outputType = 'JE';
    const outputId = 'output1234';
    const engagementId = 'eng1234';
    const outputListMock = {
      outputs: [
        {
          jeStatus: 'Failed',
        },
      ],
    };
    const saveToJEResponseMock = {
      name: 'SaveToJEResponse',
      isError: 'Error occured during the Data Load Process',
    };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.GET_DATA },
      { type: WPProcessStep3ActionTypes.SAVE_OUTPUT_TO_JE_ERROR },
      { payload: undefined, type: WPProcessStep3ActionTypes.GET_DATA_SUCCESS },
    ];
    analyticsService.getWorkPapersOutputs = jest.fn().mockImplementationOnce(() => {
      return outputListMock;
    });
    workpaperService.saveToJEOutputRequest = jest.fn().mockImplementationOnce(() => {
      return saveToJEResponseMock;
    });
    await mockStore.dispatch(saveOutputToJE(workpaperId, filePath, nodeId, outputType, outputId, engagementId));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should handle download all outputs', async () => {
    const workpaperName = 'Workpaper Test';
    const outputType = {
      id: 'dqc',
      name: 'DQC',
    };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS },
      { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_SUCCESS },
    ];

    analyticsService.downloadAllOutputsInZip = jest.fn().mockImplementation(() => {
      return { path: '/test' };
    });
    stagingService.stagingGetFileDL = jest.fn().mockImplementation(() => {
      return false;
    });
    jest.spyOn(FilesHelper, 'downloadFileFromStream').mockImplementation(() => {});

    await mockStore.dispatch(downloadAllOutputs(workpaperId, workpaperName, outputType));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle download all outputs error', async () => {
    const workpaperName = 'Workpaper Test';
    const outputType = {
      id: 'dqc',
      name: 'DQC',
    };
    const expectedError = new Error('dummy error');
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
      { type: WPProcessStep3ActionTypes.DOWNLOAD_ALL_OUTPUTS_ERROR },
    ];
    analyticsService.downloadAllOutputsInZip = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(downloadAllOutputs(workpaperId, workpaperName, outputType));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle download file as .csv', async () => {
    const fileName = 'Test Filename';
    const outputId = 'Test Id';

    const expectedActions = [
      { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV },
      { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_SUCCESS },
    ];

    analyticsService.downloadOutputInZip = jest.fn().mockImplementation(() => {
      return { path: '/test' };
    });
    stagingService.stagingGetFileDL = jest.fn().mockImplementation(() => {
      return false;
    });
    jest.spyOn(FilesHelper, 'downloadFileFromStream').mockImplementation(() => {});

    await mockStore.dispatch(downloadOutputAsCSV(fileName, outputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle download file as .csv error', async () => {
    const fileName = 'Test Filename';
    const outputId = 'Test Id';
    const expectedError = new ServerError('test error');

    const expectedActions = [
      { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
      { type: WPProcessStep3ActionTypes.DOWNLOAD_OUTPUT_CSV_ERROR },
    ];

    analyticsService.downloadOutputInZip = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(downloadOutputAsCSV(fileName, outputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle GenerateWorkbooks', async () => {
    const response = { status: GenWBStatus.Progress, step: GenWBStep.Queueing };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS },
      { type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_STATE, payload: response },
    ];
    analyticsService.generateWorkbooks = jest.fn().mockImplementationOnce(() => {
      return response;
    });
    await mockStore.dispatch(generateWorkbooks(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
  it('handle GenerateWorkbooks Error', async () => {
    const errorMessage = mockErrorMessage;
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: new Error(errorMessage) },
      { type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_ERROR, payload: errorMessage },
    ];
    analyticsService.generateWorkbooks = jest.fn().mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    await mockStore.dispatch(generateWorkbooks(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
  it('handle GenerateWorkbooksState', async () => {
    const response = { status: GenWBStatus.Progress, step: GenWBStep.Cloning };
    const expectedActions = [{ type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_STATE, payload: response }];
    analyticsService.getGenWBStatus = jest.fn().mockImplementationOnce(() => {
      return response;
    });
    await mockStore.dispatch(getGenWBStatus(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
  it('handle GenerateWorkbooksState Fetch Error', async () => {
    const errorMessage = mockErrorMessage;
    const expectedActions = [
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: new Error(errorMessage) },
      { type: WPProcessStep3ActionTypes.GENERATE_WORKBOOKS_FETCH_ERROR, payload: errorMessage },
    ];
    analyticsService.getGenWBStatus = jest.fn().mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    await mockStore.dispatch(getGenWBStatus(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('connect datamodel to output', async () => {
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_REQUEST },
      { type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_SUCCESS, payload: { workpaperId, outputs: [] } },
    ];
    analyticsService.addDMToOutput = jest.fn().mockImplementationOnce(() => {
      return true;
    });

    dataWranglerService.getAndSyncFlowOutputs = jest.fn().mockImplementationOnce(() => {
      return [];
    });

    await mockStore.dispatch(addDMToOutput(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('get outputs for dmts', async () => {
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT, payload: { workpaperId } },
      { type: WPProcessStep3ActionTypes.GET_FLOW_OUTPUT_SUCCESS, payload: { [workpaperId]: [] } },
    ];
    dataWranglerService.getAndSyncFlowOutputs = jest.fn().mockImplementationOnce(() => {
      return [];
    });

    await mockStore.dispatch(getAndSyncFlowOutputs(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE --connect datamodel to output', async () => {
    const errorMessage = mockErrorMessage;
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_REQUEST },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: new Error(errorMessage) },
      { type: WPProcessStep3ActionTypes.ADD_DATAMODEL_OUTPUT_ERROR },
    ];
    analyticsService.addDMToOutput = jest.fn().mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    await mockStore.dispatch(addDMToOutput());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('validates if the DM connected to output is latest version', async () => {
    const dmInfo = { nameTech: 'testDM', isLatest: true };
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE },
      { type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_SUCCESS, payload: dmInfo },
    ];
    bundlesService.getDatamodelFromId = jest.fn().mockImplementationOnce(() => {
      return dmInfo;
    });

    await mockStore.dispatch(getConnectedDMInfo(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE --validates if the DM connected to output is latest version', async () => {
    const errorMessage = mockErrorMessage;
    const expectedActions = [
      { type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE },
      { type: WPProcessStep3ActionTypes.VALIDATE_CONNECTED_DM_STATE_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: new Error(errorMessage) },
    ];
    bundlesService.getDatamodelFromId = jest.fn().mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    await mockStore.dispatch(getConnectedDMInfo(workpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('clears the connected DM Info', async () => {
    const expectedActions = [{ type: WPProcessStep3ActionTypes.CLEAR_CONNECTED_DM_STATE }];

    await mockStore.dispatch(clearConnectedDMInfo());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
