import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import bundleService from '../../../../services/bundles.service';
import stagingService from '../../../../services/staging.service';
import analyticsService from '../../../../services/analytics-ui.service';

import { Map as ImmutableMap } from 'immutable';
import { ErrorActionTypes } from '../../../errors/actionTypes';
import { v4 as uuidv4 } from 'uuid';
import { AttachFilesActions } from '../actionTypes';
import { publishedDMs } from './mockData';

import { getRootFolder, getChildrenFolder, getDatamodelList, getDatamodelFields, previewXLSXSheet } from '../actions';
import ServerError from '../../../../utils/serverError';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

window.scrollTo = jest.fn();

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';
const error = new ServerError({ status: 500, message: 'Test message error', key: 123 });

const parseError = errors => {
  const parsedError = errors;
  parsedError.key = parsedError.key || uuidv4();

  return parsedError;
};

describe('attach files actions', () => {
  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle get root folder ', async () => {
    const rootFolder = [{ id: '1234', name: 'test1' }];
    const childFolders = [{ id: '2345', name: 'test' }];

    const expectedActions = [
      { type: AttachFilesActions.GET_ROOT_FOLDER },
      {
        type: AttachFilesActions.GET_ROOT_FOLDER_SUCCESS,
        payload: {
          id: rootFolder[0].id,
          nodes: [...childFolders],
        },
      },
    ];

    stagingService.getRootFolder = jest.fn().mockImplementation(() => {
      return rootFolder;
    });

    stagingService.getChildrenFolder = jest.fn().mockImplementation(() => {
      return childFolders;
    });

    await mockStore.dispatch(getRootFolder('1234', '3456'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get root folder error', async () => {
    const expectedActions = [
      { type: AttachFilesActions.GET_ROOT_FOLDER },
      { type: ErrorActionTypes.ADD_INPUT_FILE_ERROR, payload: error },
      { type: AttachFilesActions.GET_ROOT_FOLDER_ERROR },
    ];

    stagingService.getRootFolder = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getRootFolder('1234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get children folder ', async () => {
    let childNodes = [
      { id: '1234', name: 'test1', isMarkedForValidation: false },
      { id: '12345', name: 'test1', isMarkedForValidation: true },
    ];
    childNodes = (childNodes || []).filter(item => !item.isMarkedForValidation);

    const expectedActions = [
      { type: AttachFilesActions.GET_CHILDREN_FOLDER },
      {
        type: AttachFilesActions.GET_CHILDREN_FOLDER_SUCCESS,
        payload: {
          id: '3456',
          nodes: childNodes,
          path: './test',
        },
      },
    ];

    stagingService.getChildrenFolder = jest.fn().mockImplementation(() => {
      return childNodes;
    });

    await mockStore.dispatch(getChildrenFolder('1234', '3456', './test'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get children folder error', async () => {
    const expectedActions = [
      { type: AttachFilesActions.GET_CHILDREN_FOLDER },
      { type: ErrorActionTypes.ADD_INPUT_FILE_ERROR, payload: error },
      { type: AttachFilesActions.GET_CHILDREN_FOLDER_ERROR },
    ];

    stagingService.getChildrenFolder = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getChildrenFolder('1234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('fetches the list of all published datamodels', async () => {
    const dmListTree = {};
    publishedDMs.items.forEach(eachDM => {
      dmListTree[`${eachDM.id}`] = { ...eachDM, typeOfNode: 0, level: 1, name: eachDM.nameTech };
    });
    const expectedActions = [
      { type: AttachFilesActions.GET_ALL_DATAMODELS_REQUEST },
      { type: AttachFilesActions.GET_ALL_DATAMODELS_SUCCESS, payload: dmListTree },
    ];

    bundleService.getPublishedDatamodelList = jest.fn().mockImplementation(() => {
      return publishedDMs;
    });
    await mockStore.dispatch(getDatamodelList());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE --fetches the list of all published datamodels', async () => {
    const expectedActions = [
      { type: AttachFilesActions.GET_ALL_DATAMODELS_REQUEST },
      {
        type: ErrorActionTypes.ADD_INPUT_FILE_ERROR,
        payload: parseError(userError),
      },
      { type: AttachFilesActions.GET_ALL_DATAMODELS_ERROR },
    ];

    bundleService.getPublishedDatamodelList = jest.fn().mockImplementation(() => {
      throw userError;
    });
    await mockStore.dispatch(getDatamodelList());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get data model field ', async () => {
    const headers = { items: [{ test: 'test', id: '1234', nameTech: 'name' }] };
    const fields = [];
    headers.items.map(field => {
      fields.push({ ...field, nameTech: field.nameTech });

      return field;
    });
    const expectedActions = [
      { type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_REQUEST },
      { type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_SUCCESS, payload: { fields, fileType: 'csv', id: '1234' } },
    ];

    bundleService.getDatamodelFields = jest.fn().mockImplementation(() => {
      return headers;
    });

    await mockStore.dispatch(getDatamodelFields('1234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle get data model field error', async () => {
    const expectedActions = [
      { type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_REQUEST },
      { type: ErrorActionTypes.ADD_INPUT_FILE_ERROR, payload: error },
      { type: AttachFilesActions.GET_ALL_FIELDS_DATAMODEL_ERROR, payload: { err: error } },
    ];

    bundleService.getDatamodelFields = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(getDatamodelFields('1234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should preview sheet', async () => {
    const data = ['1', '2', '3'];
    const schema = ['4', '5', '6'];
    const item = '/path/to/file';
    const expectedActions = [
      { type: AttachFilesActions.PREVIEW_SHEET },
      {
        type: AttachFilesActions.PREVIEW_SHEET_SUCCESS,
        payload: { data, schema },
      },
    ];

    stagingService.getFilePath = jest.fn().mockImplementation(() => {
      return { item };
    });
    analyticsService.getPreviewXLSX = jest.fn().mockImplementation(() => {
      return { data, schema };
    });
    await mockStore.dispatch(previewXLSXSheet('1234', { name: 'Sheet1', sheet: 'Sheet1', sheetInfo: {} }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should preview sheet with error', async () => {
    const expectedActions = [
      { type: AttachFilesActions.PREVIEW_SHEET },
      {
        type: ErrorActionTypes.ADD_INPUT_FILE_ERROR,
        payload: error,
      },
      {
        type: AttachFilesActions.PREVIEW_SHEET_FAILURE,
        payload: error,
      },
    ];
    stagingService.getFilePath = jest.fn().mockImplementation(() => {
      throw error;
    });

    await mockStore.dispatch(previewXLSXSheet('1234', { name: 'Sheet1', sheet: 'Sheet1', sheetInfo: {} }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
