import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import analyticsUIService from '../../../services/analytics-ui.service';
import dataWranglerService from '../../../services/data-wrangler.service';
import WorkpaperService from '../../../services/workpaper.service';
import bundlesService from '../../../services/bundles.service';

import { v4 as uuidv4 } from 'uuid';
import * as TelemetryService from '../../../app/appInsights/TelemetryService';
import { initialState as step2InitialState } from '../step2/reducer';

import {
  uploadNewInput,
  updateRequiredStatus,
  deleteTrifactaDataset,
  renameTrifactaDataset,
  getExistingMappings,
  clearInputData,
  uploadZipFile,
  checkforZipfile,
  connectDataSetToFlow,
  retryInputFileCopy,
  getInputDetails,
  refreshCentralizedData,
  triggerDMVForZipUploads,
  downloadInputFileExample,
  uploadNewDataModel,
  setBundleToInput,
  getTrifactaBundles,
  decoupleDataRequest,
  setAutoDmtFlag,
  getAutoDmtFlag,
} from './actions';

import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep1ActionTypes } from './actionTypes';
import { ErrorActionTypes } from '../../errors/actionTypes';
import stagingService from '../../../services/staging.service';
import { WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';

const mockInputId = '136483d2-8d2c-45f3-b224-6d68ed475386';
const mockFileUrl = '/cortexfilesystem/engagement/mockPath';
const mockWorkpaperId = '0fb503d7-1119-462d-8t87-a4edef1d4df9';
const mockUpdatedWorkpaper = {
  id: mockWorkpaperId,
  status: 'Published',
};

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  wpProcess: {
    step1: ImmutableMap({
      inputs: [
        {
          id: mockInputId,
          nodeId: '5ecba93d8b92e80163dd2f93',
          fileSchema: [],
          error: null,
          fileName: 'Table_Upload',
          fileHistory: ['Table_Upload'],
          status: 'done',
          name: 'Table_Upload',
          fileUrl: mockFileUrl,
          file: { url: mockFileUrl },
          required: false,
          TrifactaInputId: 645,
          centralizedData: { lastUpdated: '2020-11-02T18:57:32.790Z', status: 'inprogress' },
        },
      ],
    }),
    step2: step2InitialState,
  },
});

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';

window.scrollTo = jest.fn();

const inputMock = {
  input: {
    id: mockInputId,
    fileUrl: mockFileUrl,
    name: 'Table_Upload',
  },
  inputs: [
    {
      id: mockInputId,
      nodeId: '5ecba93d8b92e80163dd2f93',
      fileSchema: [],
      error: null,
      fileName: 'Table_Upload',
      fileHistory: ['Table_Upload'],
      status: 'done',
      name: 'Table_Upload',
      fileUrl: mockFileUrl,
      required: false,
      TrifactaInputId: 645,
    },
  ],
  centralizedinputs: [
    {
      id: mockInputId,
      nodeId: '5ecba93d8b92e80163dd2f93',
      fileSchema: [],
      error: null,
      fileName: 'Table_Upload',
      fileHistory: ['Table_Upload'],
      status: 'done',
      name: 'Table_Upload',
      fileUrl: mockFileUrl,
      required: false,
      TrifactaInputId: 645,
      centralizedData: { lastUpdated: '2020-11-02T18:57:32.790Z', status: 'inprogress' },
    },
  ],
};

const inputDetailsMock = {
  data: [
    { tax_1: '1', tax_2: '10' },
    { tax_1: '2', tax_2: '11' },
  ],
  rowCount: 2,
  table_id: 'tbldhdsjjlsdldsjdk9898493849',
  schema: [
    {
      name: 'tax_1',
      type: 'string',
      isCurrency: false,
      dateFormat: '',
      isInternal: false,
      separator: false,
      ActualName: '',
    },
    {
      name: 'tax_2',
      type: 'string',
      isCurrency: false,
      dateFormat: '',
      isInternal: false,
      separator: false,
      ActualName: '',
    },
  ],
};

const zipValidate = {
  hasZipMeta: true,
  meta: {
    zipAction: 'overwrite',
    zipStructure: 'folderNames',
    Status: 'Completed',
    zipUploadResponse: [],
    lastUpdated: '2020-07-24T20:50:24.894Z',
  },
};

const mappings = [
  {
    City: 'City',
  },
  {
    Frequency: 'Frequency',
  },
  {
    Key: 'Key',
  },
  {
    Lease_End_Date: 'Lease_End_Date',
  },
  {
    Lease_Id: 'Lease_Id',
  },
  {
    Lease_Start_Date: 'Lease_Start_Date',
  },
  {
    Monthly_Base_Rent: 'Monthly_Base_Rent',
  },
  {
    Rent_Amount: 'Rent_Amount',
  },
  {
    RentStep_End_Date: 'RentStep_End_Date',
  },
  {
    RentStep_Start_Date: 'RentStep_Start_Date',
  },
];

const parseError = error => {
  const parsedError = error;
  parsedError.key = parsedError.key || uuidv4();

  return parsedError;
};

describe('workpaperProcess step1 actions', () => {
  beforeEach(() => {
    jest.spyOn(TelemetryService, 'trackEvent').mockImplementation(() => {});
    mockStore.clearActions();
  });

  it('handles the upload of a new input', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT },
      {
        type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT_SUCCESS,
        payload: { hasInputChanged: true, result: inputMock },
      },
    ];

    analyticsUIService.uploadExistingInput = jest.fn().mockImplementation(() => {
      return inputMock;
    });

    analyticsUIService.uploadNewInput = jest.fn().mockImplementation(() => {
      return inputMock;
    });
    await mockStore.dispatch(
      uploadNewInput(mockInputId, false, { name: 'test.txt', size: 20 }, [], [], ',', 'folder', 'Table_Upload', '')
    );

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('handles the upload of an existing input', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT },
      {
        type: WPProcessStep1ActionTypes.CREATE_NEW_INPUT_SUCCESS,
        payload: { hasInputChanged: true, result: inputMock },
      },
    ];

    analyticsUIService.uploadExistingInput = jest.fn().mockImplementation(() => {
      return inputMock;
    });
    await mockStore.dispatch(
      uploadNewInput(mockInputId, false, {}, [], [], ',', 'folder', 'Table_Upload', '5ecba93d8b92e80163dd2f93')
    );

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('handles the update required of input', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS },
      {
        type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_SUCCESS,
        payload: {
          inputId: mockInputId,
          isRequired: false,
          returnUpdatedStatus: true,
        },
      },
    ];

    analyticsUIService.updateInputRequiredOptional = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(updateRequiredStatus(mockInputId, false, ''));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--handles the update required of input', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS },
      {
        type: ErrorActionTypes.ADD_INPUT_OPTIONS_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.UPDATE_INPUT_REQUIRED_STATUS_ERROR },
    ];

    analyticsUIService.updateInputRequiredOptional = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(updateRequiredStatus(mockInputId, false, ''));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should delete the trifacta workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET },
      {
        type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_SUCCESS,
        payload: inputMock.inputs[0],
      },
    ];
    analyticsUIService.deleteTrifactaInput = jest.fn().mockImplementation(() => {
      return inputMock.inputs[0];
    });
    analyticsUIService.sendWorkpaperMessage = jest.fn().mockImplementation(() => {
      return true;
    });
    dataWranglerService.deleteDataSet = jest.fn().mockImplementation(() => {
      return true;
    });
    WorkpaperService.removeDMTSourceOutput = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(
      deleteTrifactaDataset(
        mockInputId,
        '5ecba93d8b92e80163dd2f93',
        '5ecba93d8b92e80163dd2f93',
        WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS,
        mockInputId
      )
    );
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--should delete the trifacta workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET },
      {
        type: ErrorActionTypes.ADD_INPUT_OPTIONS_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.DELETE_TRICAFTA_DATASET_ERROR },
    ];
    analyticsUIService.deleteTrifactaInput = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(
      deleteTrifactaDataset(mockInputId, '5ecba93d8b92e80163dd2f93', '5ecba93d8b92e80163dd2f93')
    );
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should rename the trifacta workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET },
      {
        type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_SUCCESS,
        payload: inputMock.inputs[0],
      },
    ];

    analyticsUIService.renameTrifactaInput = jest.fn().mockImplementation(() => {
      return inputMock.inputs[0];
    });
    dataWranglerService.renameDataSet = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(renameTrifactaDataset(mockInputId, 'Table_Upload_Renamed', ''));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--should rename the trifacta workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET },
      {
        type: ErrorActionTypes.ADD_INPUT_OPTIONS_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.RENAME_TRIFACTA_DATASET_ERROR },
    ];

    analyticsUIService.renameTrifactaInput = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(renameTrifactaDataset(mockInputId, 'Table_Upload_Renamed', ''));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get the existing mappings', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS },
      {
        type: WPProcessStep1ActionTypes.GET_EXISTING_MAPPINGS_SUCCESS,
        payload: mappings,
      },
    ];

    analyticsUIService.getExistingMappings = jest.fn().mockImplementation(() => {
      return mappings;
    });
    await mockStore.dispatch(getExistingMappings(mockInputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should clear Input data', async () => {
    const inputId = mockInputId;
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA },
      {
        type: WPProcessStep1ActionTypes.CLEAR_INPUT_DATA_SUCCESS,
        payload: true,
      },
    ];

    analyticsUIService.clearInputData = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(clearInputData(mockInputId, inputId));

    const result = mockStore.getActions();
    expect(result).toEqual(expectedActions);
  });

  it('should upload  zip file', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE },
      {
        type: WPProcessStep1ActionTypes.UPLOAD_ZIP_FILE_SUCCESS,
        payload: true,
      },
    ];

    analyticsUIService.uploadZipFile = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(uploadZipFile(mockInputId, { name: 'fileName.csv', size: 1024 }, [], false));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('should validate  zip file', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE },
      {
        type: WPProcessStep1ActionTypes.CHECK_ZIP_FILE_SUCCESS,
        payload: zipValidate,
      },
    ];

    analyticsUIService.checkforZipfile = jest.fn().mockImplementation(() => {
      return zipValidate;
    });
    await mockStore.dispatch(checkforZipfile(mockInputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should connect dataset to flow', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_REQUEST },
      {
        type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_SUCCESS,
        payload: {
          allInputs: inputMock.inputs,
        },
      },
    ];

    analyticsUIService.connectDataSetToFlow = jest.fn().mockImplementation(() => {
      return true;
    });
    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return inputMock.inputs;
    });
    await mockStore.dispatch(connectDataSetToFlow(mockInputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--should connect dataset to flow', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_REQUEST },
      {
        type: ErrorActionTypes.ADD_INPUT_FILE_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.CONNECT_DATA_SET_TO_FLOW_ERROR },
    ];

    analyticsUIService.connectDataSetToFlow = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(connectDataSetToFlow(mockInputId));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should retry copy input file', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.RETRY_COPY },
      {
        type: WPProcessStep1ActionTypes.RETRY_COPY_SUCCESS,
        payload: {
          allInputs: inputMock.inputs,
        },
      },
    ];

    analyticsUIService.retryInputFileCopy = jest.fn().mockImplementation(() => {
      return true;
    });
    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return inputMock.inputs;
    });
    await mockStore.dispatch(retryInputFileCopy(mockInputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Failur Case - retry copy input file', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.RETRY_COPY },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.RETRY_COPY_ERROR },
    ];

    analyticsUIService.retryInputFileCopy = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(retryInputFileCopy(mockInputId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get the input data set', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.GET_INPUT_DATA },
      {
        type: WPProcessStep1ActionTypes.GET_INPUT_DATA_SUCCESS,
        payload: [
          ['tax_1', 'tax_2'],
          ['1', '10'],
          ['2', '11'],
        ],
      },
    ];

    analyticsUIService.getTrifactaInputDetails = jest.fn().mockImplementation(() => {
      return inputDetailsMock;
    });
    await mockStore.dispatch(getInputDetails(mockInputId, mockWorkpaperId));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Refresh modified centralized data- Failure', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT },
      {
        type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_INPROGRESS,
        payload: {
          allInputs: inputMock.centralizedinputs,
        },
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_ERROR },
    ];

    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return inputMock.centralizedinputs;
    });
    analyticsUIService.updateInputStatus = jest.fn().mockImplementation(() => {
      return true;
    });
    analyticsUIService.updateCentralizedInput = jest.fn().mockImplementation(() => {
      throw userError;
    });
    WorkpaperService.updateWorkpaperTemplate = jest.fn().mockImplementation(() => {
      return mockUpdatedWorkpaper;
    });

    await mockStore.dispatch(
      refreshCentralizedData(mockInputId, {
        id: mockWorkpaperId,
        status: 'Published',
      })
    );
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Refresh modified centralized data', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT },
      {
        type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_INPROGRESS,
        payload: {
          allInputs: inputMock.centralizedinputs,
        },
      },
      {
        type: WPProcessStep1ActionTypes.UPDATE_CENTRALIZED_INPUT_SUCCESS,
        payload: {
          allInputs: inputMock.centralizedinputs,
        },
      },
    ];

    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return inputMock.centralizedinputs;
    });
    analyticsUIService.updateInputStatus = jest.fn().mockImplementation(() => {
      return true;
    });
    analyticsUIService.updateCentralizedInput = jest.fn().mockImplementation(() => {
      return true;
    });
    WorkpaperService.updateWorkpaperTemplate = jest.fn().mockImplementation(() => {
      return mockUpdatedWorkpaper;
    });

    await mockStore.dispatch(
      refreshCentralizedData(mockInputId, {
        id: mockWorkpaperId,
        status: 'Published',
      })
    );
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should triggerDMVs for zip uploads', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT },
      {
        type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_SUCCESS,
        payload: inputMock.inputs,
      },
    ];

    analyticsUIService.triggerDMVForZipUploads = jest.fn().mockImplementation(() => {
      return inputMock.inputs;
    });

    await mockStore.dispatch(triggerDMVForZipUploads(mockInputId, 10879, inputMock.inputs));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Failur Case - triggerDMVs for zip uploads', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.TRIGGER_DMV_FOR_ZIP_INPUT_ERROR },
    ];

    analyticsUIService.triggerDMVForZipUploads = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(triggerDMVForZipUploads(mockInputId, 10879, inputMock.inputs));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should download input file example', async () => {
    const filepath = { item: '/path' };
    const node = { id: '1' };
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE },
      {
        type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE_SUCCESS,
      },
    ];

    stagingService.getFilePath = jest.fn().mockImplementation(() => {
      return filepath;
    });

    stagingService.getTempLink = jest.fn().mockImplementation(() => {
      return node;
    });
    await mockStore.dispatch(downloadInputFileExample('123', 'file name'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should download input file example error', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.DOWNLOAD_INPUT_EXAMPLE_FILE_ERROR },
    ];

    stagingService.getFilePath = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(downloadInputFileExample('123', 'file name'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should upload new data model for Workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT },
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_SUCCESS, payload: inputMock.inputs },
    ];

    analyticsUIService.uploadDataModel = jest.fn().mockImplementation(() => {
      return inputMock.inputs;
    });
    await mockStore.dispatch(uploadNewDataModel(mockInputId, [], null, '987654', {}, {}, '1234', false, true, true, 2));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE --should upload new data model for Workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT },
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    analyticsUIService.uploadDataModel = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(uploadNewDataModel(mockInputId, [], null, '987654', {}, {}, '1234', false, true, true, 2));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should upload new data model for DMT', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT },
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_SUCCESS, payload: inputMock.inputs },
    ];

    WorkpaperService.addDMTSourceOutput = jest.fn().mockImplementation(() => {
      return inputMock.inputs[0];
    });

    analyticsUIService.uploadDataModel = jest.fn().mockImplementation(() => {
      return inputMock.inputs;
    });
    await mockStore.dispatch(uploadNewDataModel(mockInputId, [], null, '987654', {}, {}, '1234', true, true, true, 6));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE --should upload new data model for DMT', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT },
      { type: WPProcessStep1ActionTypes.CREATE_NEW_DATAMODEL_INPUT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    WorkpaperService.addDMTSourceOutput = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(uploadNewDataModel(mockInputId, [], null, '987654', {}, {}, '1234', true, true, true, 6));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get all published trifacta Bundles', async () => {
    bundlesService.getTrifactaBundles = jest.fn().mockImplementation(() => {
      return [
        {
          id: '17de0a6c-1f8e-4667-9770-e0b2d6b85e8e',
          name: 'Lawson',
          children: [
            {
              id: '019a6c3d-e19f-4e56-a410-0db9b64ea077',
              name: 'Oracle_IN patch ',
              children: [
                {
                  id: '5bb3dcc0-9f15-4da4-9969-9a5d7cc0158e',
                  name: '00samplle',
                  parentId: '961cbaef-049b-41a0-bb29-e48f24771c25',
                  sourceSystemId: '17de0a6c-1f8e-4667-9770-e0b2d6b85e8e',
                  sourceSystemName: 'Lawson',
                  sourceVersionId: '019a6c3d-e19f-4e56-a410-0db9b64ea077',
                  sourceVersionName: 'Oracle_IN patch ',
                },
              ],
            },
          ],
        },
      ];
    });

    const expectedActions = [
      { type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES },
      { type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_SUCCESS, payload: {} },
    ];

    await mockStore.dispatch(getTrifactaBundles());
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE --should get all published trifacta Bundles', async () => {
    bundlesService.getTrifactaBundles = jest.fn().mockImplementation(() => {
      throw userError;
    });

    const expectedActions = [
      { type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES },
      { type: WPProcessStep1ActionTypes.GET_TRIFACTA_BUNDLES_ERROR },
      {
        type: ErrorActionTypes.ADD_CONNECT_BUNDLE_ERRORS,
        payload: parseError(userError),
      },
    ];

    await mockStore.dispatch(getTrifactaBundles());
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should upload bundle info to Input', async () => {
    analyticsUIService.connectToBundle = jest.fn().mockImplementation(() => {
      return true;
    });

    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return [];
    });

    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES },
      { type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_SUCCESS, payload: { allInputs: [] } },
    ];

    await mockStore.dispatch(setBundleToInput('1234567890', '0987654321', [{ parentId: '1', id: '2', name: '3' }]));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE --should upload bundle info to Input', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES },
      { type: WPProcessStep1ActionTypes.CONNECT_TO_TRIFACTA_BUNDLES_ERROR },
      {
        type: ErrorActionTypes.ADD_CONNECT_BUNDLE_ERRORS,
        payload: parseError(userError),
      },
    ];

    analyticsUIService.connectToBundle = jest.fn().mockImplementation(() => {
      throw userError;
    });

    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(setBundleToInput('1234567890', '0987654321', [{ parentId: '1', id: '2', name: '3' }]));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should decouple data request from input data table', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST },
      {
        type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST_SUCCESS,
        payload: true,
      },
      { type: WPProcessStep1ActionTypes.GET_DATA },
      {
        type: WPProcessStep1ActionTypes.GET_DATA_SUCCESS,
        payload: { inputs: null, outdatedDatamodels: null },
      },
    ];

    analyticsUIService.decoupleDataRequest = jest.fn().mockImplementation(() => {
      return true;
    });
    analyticsUIService.getWorkPaperInputs = jest.fn().mockImplementation(() => {
      return null;
    });

    await mockStore.dispatch(
      decoupleDataRequest('testWorkpaperId', 'testInputId', 'testWorkpaperType', 'testTrifactaFlowId')
    );

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE -- should decouple data request from input data table', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST },
      {
        type: ErrorActionTypes.ADD_INPUT_OPTIONS_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep1ActionTypes.DECOUPLE_DATA_REQUEST_ERROR },
    ];

    analyticsUIService.decoupleDataRequest = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(
      decoupleDataRequest('testWorkpaperId', 'testInputId', 'testWorkpaperType', 'testTrifactaFlowId')
    );
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should set the automatic run DMT flag', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST },
      { type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST_SUCCESS, payload: true },
    ];

    analyticsUIService.setAutoDmtFlag = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(setAutoDmtFlag('mock id', true));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE -- should set the automatic run DMT flag', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST },
      {
        type: ErrorActionTypes.ADD_WORKPAPER_PROCESSING_ERROR,
        payload: { error: parseError(userError), workpaperId: undefined },
      },
      { type: WPProcessStep1ActionTypes.SET_AUTO_DMF_FLAG_REQUEST_ERROR },
    ];

    analyticsUIService.setAutoDmtFlag = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(setAutoDmtFlag('mock id', true));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get the automatic run DMT flag', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST },
      { type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_SUCCESS, payload: true },
    ];

    analyticsUIService.getAutoDmtFlag = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(getAutoDmtFlag('mock id'));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE -- should retrieve the automatic run DMT flag', async () => {
    const expectedActions = [
      { type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST },
      {
        type: ErrorActionTypes.ADD_WORKPAPER_PROCESSING_ERROR,
        payload: { error: parseError(userError), workpaperId: undefined },
      },
      { type: WPProcessStep1ActionTypes.GET_AUTO_DMT_FLAG_REQUEST_ERROR },
    ];

    analyticsUIService.getAutoDmtFlag = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getAutoDmtFlag('mock id'));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
