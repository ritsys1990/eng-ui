import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import bundleService from '../../../../services/bundles.service';
import workpaperService from '../../../../services/workpaper.service';
import stagingService from '../../../../services/staging.service';
import FileSaver from 'file-saver';
import {
  postAddGuidance,
  getAllDataModels,
  getPublishedDatamodels,
  getDatamodelFromId,
  deleteDMField,
  getDMFieldTypes,
  updateDMField,
  updateDataModel,
  switchDMToDraft,
  submitDMForReview,
  deleteDM,
  redirectToDMValidations,
  getDMTsFromDM,
  createDMT,
  renameDMT,
  exportDataModels,
  uploadExampleDatamodel,
  getDatamodelMappings,
  getEnvironments,
  getPublishedDatamodelsByEnv,
  clearModalContent,
  ingestDataModel,
  getDMTsOfDMByEnv,
  ingestDMT,
  getDMTIngestionStatus,
  validateDMTName,
  clearDMTsOfDMByEnv,
  getSBTIngestionStatus,
  getDMTFromEnvironment,
  ingestDMTAction,
  ingestSBTAction,
  getDatamodelVersionsHistoryById,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { CLDataModelsActionTypes } from '../actionTypes';
import { CLCDMActionTypes } from '../../commonDataModels/actionTypes';
import { ErrorActionTypes } from '../../../errors/actionTypes';
import { BundlesActionTypes } from '../../../bundles/actionTypes';

import {
  datamodelsMock,
  fieldTypes,
  dmtsList,
  dmMappingMock,
  allEnvironmentsMock,
  environmentContentMock,
  dmtsIngestionMock,
} from './datamodels.mock';

import { commonDMsMock } from '../../commonDataModels/tests/commonDMs.mock';
import { v4 as uuidv4 } from 'uuid';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

window.scrollTo = jest.fn();

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';
userError.code = 409;

const parseError = error => {
  const parsedError = error;
  parsedError.key = parsedError.key || uuidv4();

  return parsedError;
};

describe('content library datamodels actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.clearActions();
  });

  it('fetches the list of all datamodels', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: commonDMsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
    ];
    bundleService.getAllCommonDataModels = jest.fn().mockImplementation(() => {
      return commonDMsMock;
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });

    await mockStore.dispatch(getAllDataModels());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--getAllDataModels', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getAllCommonDataModels = jest.fn().mockImplementation(() => {
      throw userError;
    });

    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(getAllDataModels());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('fetches the list of published datamodels', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_REQUEST },
      { type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_SUCCESS, payload: datamodelsMock.datamodels.items },
    ];

    bundleService.getPublishedDatamodelList = jest.fn().mockImplementation(() => {
      return datamodelsMock.datamodels;
    });
    await mockStore.dispatch(getPublishedDatamodels());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--getPublishedDatamodelList', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_REQUEST },
      { type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getPublishedDatamodelList = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(getPublishedDatamodels());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('fetches the details of datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_SUCCESS, payload: datamodelsMock.datamodels.items[0] },
    ];

    bundleService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      return datamodelsMock.datamodels.items[0];
    });
    await mockStore.dispatch(getDatamodelFromId(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--getDatamodelFromId', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(getDatamodelFromId(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('deletes the DM field', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD },
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_SUCCESS, payload: true },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_SUCCESS, payload: datamodelsMock.datamodels.items[0] },
    ];

    bundleService.deleteField = jest.fn().mockImplementation(() => {
      return true;
    });
    bundleService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      return datamodelsMock.datamodels.items[0];
    });
    await mockStore.dispatch(deleteDMField(datamodelsMock.datamodels.items[0].id, '12345'));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--deleting DM field', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD },
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.deleteField = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(deleteDMField(datamodelsMock.datamodels.items[0].id, '12345'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getsFieldTypes', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DM_FILED_TYPES },
      { type: CLDataModelsActionTypes.GET_DM_FILED_TYPES_SUCCESS, payload: fieldTypes },
    ];

    bundleService.getFieldTypes = jest.fn().mockImplementation(() => {
      return fieldTypes;
    });
    await mockStore.dispatch(getDMFieldTypes());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE-- fetching DM field types', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DM_FILED_TYPES },
      { type: CLDataModelsActionTypes.GET_DM_FIELD_TYPES_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getFieldTypes = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(getDMFieldTypes());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('updates DM Field', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.UPDATE_DM_FIELD },
      { type: CLDataModelsActionTypes.UPDATE_DM_FIELD_SUCCESS, payload: true },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_SUCCESS, payload: datamodelsMock.datamodels.items[0] },
    ];

    bundleService.updateDMField = jest.fn().mockImplementation(() => {
      return true;
    });
    bundleService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      return datamodelsMock.datamodels.items[0];
    });
    await mockStore.dispatch(updateDMField(datamodelsMock.datamodels.items[0].id, {}));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--updates DM Field', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.UPDATE_DM_FIELD },
      { type: CLDataModelsActionTypes.UPDATE_DM_FIELD_ERROR },
      {
        type: ErrorActionTypes.ADD_DM_FIELD_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.updateDMField = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(updateDMField(datamodelsMock.datamodels.items[0].id, {}));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('updates Add Guidance', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE },
      { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE_SUCCESS },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
    ];

    bundleService.postAddGuidance = jest.fn().mockImplementation(() => {
      return datamodelsMock.datamodels.items[0];
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });

    await mockStore.dispatch(
      postAddGuidance({
        id: datamodelsMock.datamodels.items[0].id,
        generalInstructions: datamodelsMock.datamodels.items[0].generalInstructions,
      })
    );
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--updates Add Guidance', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE },
      { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.postAddGuidance = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(postAddGuidance(datamodelsMock.datamodels.items[0].generalInstructions));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('updates Data Model', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.UPDATE_DATAMODEL_REQUEST },
      { type: CLDataModelsActionTypes.UPDATE_DATAMODEL_SUCCESS, payload: true },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: commonDMsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
    ];

    bundleService.updateDataModel = jest.fn().mockImplementation(() => {
      return true;
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });
    await mockStore.dispatch(updateDataModel(datamodelsMock.datamodels.items[0]));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--updates Data Model', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.UPDATE_DATAMODEL_REQUEST },
      { type: CLDataModelsActionTypes.UPDATE_DATAMODEL_ERROR },
      {
        type: ErrorActionTypes.ADD_DM_FIELD_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.updateDataModel = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(updateDataModel(datamodelsMock.datamodels.items[0]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should switch DM to draft', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_SUCCESS, payload: true },
    ];

    bundleService.switchDMToDraft = jest.fn().mockImplementation(() => {
      return true;
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });
    await mockStore.dispatch(switchDMToDraft(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--switch DM to draft', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT },
      { type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.switchDMToDraft = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(switchDMToDraft(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should submit DM for Review', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_SUCCESS, payload: true },
    ];

    bundleService.submitDMForReview = jest.fn().mockImplementation(() => {
      return true;
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });
    await mockStore.dispatch(submitDMForReview(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--submit DM for Review', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW },
      { type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.submitDMForReview = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(submitDMForReview(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should delete DataModel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_REQUEST },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_SUCCESS, payload: true },
    ];

    bundleService.deleteDM = jest.fn().mockImplementation(() => {
      return true;
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });
    await mockStore.dispatch(deleteDM(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--deleting DM', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_REQUEST },
      { type: CLDataModelsActionTypes.DELETE_DATAMODEL_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.deleteDM = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(deleteDM(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should validate DataModel redirection', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION },
      { type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_SUCCESS },
    ];

    bundleService.redirectToDMValidations = jest.fn().mockImplementation(() => {
      return true;
    });
    await mockStore.dispatch(redirectToDMValidations(datamodelsMock.datamodels.items[0]));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--while validating DataModel redirection', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION },
      { type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.redirectToDMValidations = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(redirectToDMValidations(datamodelsMock.datamodels.items[0]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should export DataModel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.EXPORT_DATAMODEL },
      { type: CLDataModelsActionTypes.EXPORT_DATAMODEL_SUCCESS },
    ];

    bundleService.exportDataModels = jest.fn().mockImplementation(() => {
      return {
        dataModels: [datamodelsMock.datamodels.items[0]],
      };
    });

    FileSaver.saveAs = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(exportDataModels(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--should export DataModel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.EXPORT_DATAMODEL },
      { type: CLDataModelsActionTypes.EXPORT_DATAMODEL_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.exportDataModels = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(exportDataModels(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should Upload Example DataModel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE },
      { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: commonDMsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock },
    ];

    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return datamodelsMock;
    });

    stagingService.ensureFolder = jest.fn().mockImplementation(() => {
      return true;
    });

    stagingService.generateDMUploadLink = jest.fn().mockImplementation(() => {
      return true;
    });

    bundleService.changeDataModelState = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(uploadExampleDatamodel('file', datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--should Upload Example DataModel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE },
      { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS, payload: parseError(userError) },
    ];

    stagingService.ensureFolder = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(uploadExampleDatamodel('file', datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get DMTs list from datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM },
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_SUCCESS, payload: dmtsList },
    ];

    workpaperService.getDMTsFromDM = jest.fn().mockImplementation(() => {
      return dmtsList;
    });
    await mockStore.dispatch(getDMTsFromDM(datamodelsMock.datamodels.items[0].id));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE--DMTs list from datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM },
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.getDMTsFromDM = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(getDMTsFromDM(datamodelsMock.datamodels.items[0]));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should create new DMT from datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT },
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT_SUCCESS, payload: true },
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM },
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_SUCCESS, payload: dmtsList },
    ];

    workpaperService.createDMT = jest.fn().mockImplementation(() => {
      return true;
    });
    workpaperService.getDMTsFromDM = jest.fn().mockImplementation(() => {
      return dmtsList;
    });
    await mockStore.dispatch(createDMT('dmName', datamodelsMock.datamodels.items[0].id, 'Test_TK_123', true, true));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--creating DMT from datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT },
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.createDMT = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(createDMT('dmName', datamodelsMock.datamodels.items[0].id, 'Test_TK_123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should rename new DMT from datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT },
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT_SUCCESS, payload: true },
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM },
      { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_SUCCESS, payload: dmtsList },
    ];

    workpaperService.renameDMT = jest.fn().mockImplementation(() => {
      return true;
    });
    workpaperService.getDMTsFromDM = jest.fn().mockImplementation(() => {
      return dmtsList;
    });
    await mockStore.dispatch(renameDMT(dmtsList[0].id, 'Test_TK_123'));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--rename DMT from datamodel', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT },
      { type: CLDataModelsActionTypes.CREATE_NEW_DMT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.renameDMT = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(renameDMT(dmtsList[0].id, 'Test_TK_123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get DM Mapping', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING },
      {
        type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_SUCCESS,
        payload: { mappingResult: dmMappingMock, datamodelName: datamodelsMock.datamodels.items[0].nameTech },
      },
    ];

    workpaperService.getDatamodelMappings = jest.fn().mockImplementation(() => {
      return dmMappingMock;
    });

    await mockStore.dispatch(
      getDatamodelMappings(
        'dmMapping',
        [datamodelsMock.datamodels.items[0].id],
        datamodelsMock.datamodels.items[0].nameTech
      )
    );

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--should get DM Mapping', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_ERROR, payload: parseError(userError) },
    ];

    workpaperService.getDatamodelMappings = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(
      getDatamodelMappings(datamodelsMock.datamodels.items[0].id, datamodelsMock.datamodels.items[0].nameTech)
    );

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get DMT Mapping', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING },
      {
        type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_SUCCESS,
        payload: { mappingResult: dmMappingMock, datamodelName: datamodelsMock.datamodels.items[0].nameTech },
      },
    ];

    bundleService.getDatamodelsByIds = jest.fn().mockImplementation(() => {
      return dmMappingMock;
    });

    await mockStore.dispatch(
      getDatamodelMappings(
        'dmtMapping',
        [datamodelsMock.datamodels.items[0].id],
        datamodelsMock.datamodels.items[0].nameTech
      )
    );

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--should get DMT Mapping', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_ERROR, payload: parseError(userError) },
    ];

    bundleService.getDatamodelsByIds = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(
      getDatamodelMappings(datamodelsMock.datamodels.items[0].id, datamodelsMock.datamodels.items[0].nameTech)
    );

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get get all environments to ingest data models from', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS },
      {
        type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_SUCCESS,
        payload: allEnvironmentsMock,
      },
    ];

    bundleService.fetchAllEnvironments = jest.fn().mockImplementation(() => {
      return allEnvironmentsMock;
    });

    await mockStore.dispatch(getEnvironments());
    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should get get all environments to ingest data models from', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS },
      { type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_ERROR, payload: parseError(userError) },
      { type: CLDataModelsActionTypes.ADD_INGEST_DMT_ERROR },
    ];

    bundleService.fetchAllEnvironments = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getEnvironments());

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get get all data models from a selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV },
      {
        type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_SUCCESS,
        payload: environmentContentMock,
      },
    ];

    bundleService.fetchContents = jest.fn().mockImplementation(() => {
      return environmentContentMock;
    });

    await mockStore.dispatch(getPublishedDatamodelsByEnv('qas1'));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--should get get all data models from a selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV },
      { type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_ERROR, payload: parseError(userError) },
    ];

    bundleService.fetchContents = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getPublishedDatamodelsByEnv('qas1'));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should clear the contents in the modals', async () => {
    const expectedActions = [{ type: CLDataModelsActionTypes.CLEAR_MODAL_CONTENT }];

    await mockStore.dispatch(clearModalContent());

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should ingest the selected data model from the selected environment', async () => {
    const mockDMs = [{ id: 0 }];
    const mockDM = { id: 1 };
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DATAMODEL_START },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      { type: CLCDMActionTypes.FETCH_CDMS_LIST_SUCCESS, payload: commonDMsMock },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: mockDMs },
      { type: CLDataModelsActionTypes.INGEST_DATAMODEL_SUCCESS, payload: { bundle: mockDM } },
    ];

    bundleService.ingestDatamodel = jest.fn().mockImplementation(() => {
      return mockDM;
    });
    bundleService.getDatamodelsList = jest.fn().mockImplementation(() => {
      return mockDMs;
    });

    await mockStore.dispatch(ingestDataModel({}));

    const result = mockStore.getActions();

    expect(result.length).toEqual(expectedActions.length);
  });

  it('FAILURE CASE--should ingest the selected data model from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DATAMODEL_START },
      { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
      {
        type: CLDataModelsActionTypes.INGEST_DATAMODEL_ERROR,
        payload: { err: parseError(userError), ingestingDatamodel: {} },
      },
    ];

    bundleService.ingestDatamodel = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(ingestDataModel({}));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get the dmts from dm from the selected environment', async () => {
    const mockDMTs = [
      { id: 'b65eade2-d2e8-4e95-9645-601448e45919', name: 'TK_DM_Test_Ingest_DMT', workpaperSource: 'Trifacta' },
    ];
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST },
      { type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_SUCCESS, payload: mockDMTs },
    ];

    workpaperService.getDMTsofDMByEnv = jest.fn().mockImplementation(() => {
      return mockDMTs;
    });

    await mockStore.dispatch(getDMTsOfDMByEnv('TK_DM_Test_Ingest_DM', 'dev1'));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('should get the dmts from the selected environment', async () => {
    const mockDMTs = [
      { id: 'b65eade2-d2e8-4e95-9645-601448e45919', name: 'TK_DM_Test_Ingest_DMT', workpaperSource: 'Trifacta' },
    ];
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT },
      { type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_SUCCESS, payload: [] },
    ];

    bundleService.fetchDMTContents = jest.fn().mockImplementation(() => {
      return mockDMTs;
    });

    await mockStore.dispatch(getDMTFromEnvironment('TK_DM_Test_Ingest_DM', 'dev1'));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE -- should get the dmts from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT },
      { type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_ERROR },
      { type: ErrorActionTypes.ADD_INGEST_DMT_ERROR, payload: parseError(userError) },
    ];

    bundleService.fetchDMTContents = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getDMTFromEnvironment('TK_DM_Test_Ingest_DM', 'dev1'));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('it should ingest DMTs action', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DMT },
      { type: CLDataModelsActionTypes.INGEST_DMT_SUCCESS, payload: {} },
    ];

    bundleService.ingestDMT = jest.fn().mockImplementation(() => {
      return {};
    });

    await mockStore.dispatch(ingestDMTAction({}, true));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE -- it should ingest DMTs action', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DMT },
      { type: CLDataModelsActionTypes.INGEST_DMT_ERROR },
      { type: ErrorActionTypes.ADD_INGEST_DMT_ERROR, payload: parseError(userError) },
    ];

    bundleService.ingestDMT = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(ingestDMTAction({}, true));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should get the dmts from dm from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT },
      { type: CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.getDMTsofDMByEnv = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getDMTsOfDMByEnv('TK_DM_Test_Ingest_DM', 'dev1'));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should queue the ingest of dmts from dm from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE },
      { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE_SUCCESS, payload: true },
    ];

    workpaperService.ingestDMT = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(ingestDMT({ dmtName: 'TK_DM_Test_Ingest_DM', pullFroSource: 'dev1' }));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should queue the ingest of dmts from dm from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE },
      { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.ingestDMT = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(ingestDMT({ dmtName: 'TK_DM_Test_Ingest_DM', pullFroSource: 'dev1' }));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get the status the ingested dmts from dm from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS },
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_SUCCESS, payload: dmtsIngestionMock },
    ];

    workpaperService.getDMTsIngestionStatus = jest.fn().mockImplementation(() => {
      return dmtsIngestionMock;
    });

    await mockStore.dispatch(getDMTIngestionStatus('TK_DM_Test_Ingest_DM'));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should get the status the ingested dmts from dm from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS },
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.getDMTsIngestionStatus = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getDMTIngestionStatus('TK_DM_Test_Ingest_DM'));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should get the check the duplicate name for DMT', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME },
      { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME_SUCCESS },
    ];

    workpaperService.validateDMTName = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(validateDMTName('TK_DM_Test_Ingest_DM'));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should get the status the ingested dmts from dm from the selected environment', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME },
      { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.validateDMTName = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getDMTIngestionStatus('TK_DM_Test_Ingest_DM'));

    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('should clear the dmts of dm list when modal closes', async () => {
    const expectedActions = [{ type: CLDataModelsActionTypes.CLEAR_DMTS_OF_DM }];

    await mockStore.dispatch(clearDMTsOfDMByEnv());

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('should get datamodel version history', async () => {
    const datamodelRes = {};
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_SUCCESS, payload: datamodelRes },
    ];

    bundleService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      return datamodelRes;
    });

    await mockStore.dispatch(getDatamodelVersionsHistoryById('TK_DM_Test_Ingest_DM'));
    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('should get datamodel version history fail', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY },
      { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_ERROR_RESET },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    bundleService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getDatamodelVersionsHistoryById('TK_DM_Test_Ingest_DM'));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('should get the bundle ingestion action done', async () => {
    const userEmail = 'ab@deloitte.com';
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DMT },
      { type: CLDataModelsActionTypes.INGEST_DMT_SUCCESS, payload: {} },
      { type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST, payload: { bundleBaseId: userEmail } },
    ];

    workpaperService.ingestBundleTransformation = jest.fn().mockImplementation(() => {
      return {};
    });

    await mockStore.dispatch(ingestSBTAction({}, userEmail, true));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should get the bundle ingestion action done', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.INGEST_DMT },
      { type: CLDataModelsActionTypes.INGEST_DMT_ERROR },
      { type: ErrorActionTypes.ADD_INGEST_DMT_ERROR, payload: parseError(userError) },
    ];

    workpaperService.ingestBundleTransformation = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(ingestSBTAction({}, '123@deloitte.com', true));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('should get the bundle ingestion status', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS },
      { type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: true },
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_SUCCESS, payload: [{}] },
      { type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: false },
    ];

    workpaperService.getSBTIngestionStatus = jest.fn().mockImplementation(() => {
      return {};
    });

    await mockStore.dispatch(getSBTIngestionStatus('datamodelName', true));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });

  it('FAILURE CASE--should get the bundle ingestion status', async () => {
    const expectedActions = [
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS },
      { type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: true },
      { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_ERROR, payload: { err: parseError(userError) } },
      { type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: false },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    workpaperService.getSBTIngestionStatus = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(getSBTIngestionStatus('datamodelName', true));

    const result = mockStore.getActions();

    expect(result).toEqual(expectedActions);
  });
});
