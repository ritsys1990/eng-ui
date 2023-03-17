import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import bundlesService from '../../../services/bundles.service';
import {
  fetchOnlyPublishedTagsWithGroups,
  getAllDataModelsForWB,
  getSourceSystems,
  getPublishedBundleBaseList,
  getPublishedBundlesList,
  getBundleNameDetails,
  getTemplatePropertiesList,
  getTemplateDetails,
  getDataModelListData,
  createSourceVersionFilter,
  getSourceVersionFilterDetails,
  editSourceVersionFilter,
  deleteSourceVersionFilter,
  fetchBundleContexts,
  fetchTableContexts,
  fetchFieldsContext,
  getBundleTransformationStatus,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { BundlesActionTypes } from '../actionTypes';
import { initialState } from '../reducer';
import { ErrorActionTypes } from '../../errors/actionTypes';

const mockErrorText = 'dummy error';
const expectedError = new Error(mockErrorText);

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  bundleNameDetails: initialState,
});

describe('Bundle actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('should handle fetch Only Published Tags With Groups', async () => {
    const tags = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_REQUEST },
      { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_SUCCESS, payload: tags },
    ];

    bundlesService.fetchOnlyPublishedTagsWithGroups = jest.fn().mockImplementation(() => {
      return tags;
    });

    await mockStore.dispatch(fetchOnlyPublishedTagsWithGroups(true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch Only Published Tags With Groups error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_REQUEST },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
      { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_ERROR, error: expectedError },
    ];
    bundlesService.fetchOnlyPublishedTagsWithGroups = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(fetchOnlyPublishedTagsWithGroups());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get all data models for WB', async () => {
    const datamodels = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB },
      { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_SUCCESS, payload: datamodels },
    ];

    bundlesService.getAllDataModelsForWB = jest.fn().mockImplementation(() => {
      return datamodels;
    });

    await mockStore.dispatch(getAllDataModelsForWB());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get all data models for WB error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
      { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_ERROR, error: expectedError },
    ];
    bundlesService.getAllDataModelsForWB = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getAllDataModelsForWB());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get published bundle base list', async () => {
    const existingBundleBaserList = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST },
      {
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST_SUCCESS,
        payload: { existingBundleBaserList: [], publishedBundleBaseList: existingBundleBaserList },
      },
    ];

    bundlesService.getPublishedBundleBaseList = jest.fn().mockImplementation(() => {
      return existingBundleBaserList;
    });

    await mockStore.dispatch(getPublishedBundleBaseList());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get published bundle list', async () => {
    const result = {
      totalCount: 70,
      items: [
        {
          bundleBaseId: '12345',
          bundleBaseName: '463686_bundle',
          bundlesCount: 1,
          lastUpdated: '2021-05-12T13:34:50.545Z',
          versionsCount: 55,
          tagIds: ['1234678'],
          description: null,
        },
      ],
    };
    const expectedActions = [
      {
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST,
        payload: { bundleBaseId: 'getPublishedBundleBaseList' },
      },
      {
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST_SUCCESS,
        payload: { bundleBaseId: 'getPublishedBundleBaseList', publishedBundleList: { result } },
      },
    ];

    bundlesService.fetchPublishedBundlesList = jest.fn().mockImplementation(() => {
      return { result };
    });

    await mockStore.dispatch(getPublishedBundlesList('getPublishedBundleBaseList'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get template properties list', async () => {
    const result = {
      totalCount: 70,
      items: [
        {
          id: '1234',
          name: 'Flat File',
          description: 'CSV Connector',
          kind: 'Extraction',
          type: 'CSVFile',
          currentState: {
            version: 3,
            revision: 8,
          },
        },
      ],
    };
    const expectedActions = [
      { type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST },
      { type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_SUCCESS, payload: { result } },
    ];

    bundlesService.getTemplateProperties = jest.fn().mockImplementation(() => {
      return { result };
    });

    await mockStore.dispatch(getTemplatePropertiesList());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get template details', async () => {
    const result = {
      totalCount: 70,
      items: [
        {
          id: '1234',
          name: 'Flat File',
          description: 'CSV Connector',
          kind: 'Extraction',
          type: 'CSVFile',
          currentState: {
            version: 3,
            revision: 8,
          },
        },
      ],
    };
    const expectedActions = [
      { type: BundlesActionTypes.GET_TEMPLATE_DETAILS },
      { type: BundlesActionTypes.GET_TEMPLATE_DETAILS_SUCCESS, payload: { result } },
    ];

    bundlesService.getTemplateDetails = jest.fn().mockImplementation(() => {
      return { result };
    });

    await mockStore.dispatch(getTemplateDetails());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get source systems', async () => {
    const result = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.GET_SOURCE_SYSTEMS },
      { type: BundlesActionTypes.GET_SOURCE_SYSTEMS_SUCCESS, payload: result },
    ];

    bundlesService.getSourceSystemNames = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(getSourceSystems('1234-5678', '2323-232'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle bundle names details', async () => {
    const bundlenameDetails = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS },
      { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_SUCCESS, payload: bundlenameDetails },
    ];

    bundlesService.getBundleNameDetails = jest.fn().mockImplementation(() => {
      return bundlenameDetails;
    });

    await mockStore.dispatch(getBundleNameDetails('1234-5678'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle bundle names details error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS },
      { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_ERROR, payload: 'dummy error' },
    ];
    bundlesService.getBundleNameDetails = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getBundleNameDetails('1234-5678', true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch bundle context', async () => {
    const bundleContexts = {
      totalCount: 1,
      items: [
        { id: '234f', parentId: '123', lastUpdated: '2020-05-28T09:37:43.997Z', tableContextsCount: 6, lawsCount: 0 },
      ],
    };
    const expectedActions = [
      { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT },
      { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT_SUCCESS, payload: bundleContexts },
    ];

    bundlesService.fetchBundleContexts = jest.fn().mockImplementation(() => {
      return bundleContexts;
    });

    await mockStore.dispatch(fetchBundleContexts('1234-5678', true));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch bundle context error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT },
      { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];
    bundlesService.fetchBundleContexts = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(fetchBundleContexts());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch table context', async () => {
    const tableContexts = {
      totalCount: 6,
      items: [
        {
          id: '123',
          parentId: '123',
          lastUpdated: null,
          lastUpdatedBy: null,
          nameTech: 'TEST',
          isUsed: true,
          isForExtraction: true,
        },
      ],
    };
    const expectedActions = [
      { type: BundlesActionTypes.FETCH_TABLE_CONTEXT },
      { type: BundlesActionTypes.FETCH_TABLE_CONTEXT_SUCCESS, payload: tableContexts },
    ];

    bundlesService.fetchTableContexts = jest.fn().mockImplementation(() => {
      return tableContexts;
    });

    await mockStore.dispatch(fetchTableContexts('123', '1234-5678', false));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch table context error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.FETCH_TABLE_CONTEXT },
      { type: BundlesActionTypes.FETCH_TABLE_CONTEXT_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];
    bundlesService.fetchTableContexts = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(fetchTableContexts());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch fields context', async () => {
    const fieldsContext = {
      totalCount: 1,
      items: [
        {
          id: '123',
          parentId: '123456',
          nameTech: 'TEST',
          nameNonTech: 'TEST',
          sourceFieldId: '123456',
          isFilterable: true,
        },
      ],
    };
    const expectedActions = [
      { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT },
      { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT_SUCCESS, payload: fieldsContext },
    ];

    bundlesService.fetchFieldsContext = jest.fn().mockImplementation(() => {
      return fieldsContext;
    });

    await mockStore.dispatch(fetchFieldsContext('123', '1234-5678', '1234', false));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle fetch fields context error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT },
      { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT_ERROR },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];
    bundlesService.fetchFieldsContext = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(fetchFieldsContext());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle create source version filter', async () => {
    const result = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER },
      { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_SUCCESS, payload: result },
    ];

    bundlesService.createSourceVersionFilter = jest.fn().mockImplementation(() => {
      return true;
    });

    bundlesService.getSourceVersionAllFilters = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(createSourceVersionFilter('1234-5678', { id: 1 }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle create source version filter error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER },
      { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_ERROR, payload: expectedError },
    ];
    bundlesService.createSourceVersionFilter = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(createSourceVersionFilter());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should get source version filter details', async () => {
    const result = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS },
      { type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_SUCCESS, payload: result },
    ];

    bundlesService.getSourceVersionAllFilters = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(getSourceVersionFilterDetails('1234-5678', '2345'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle edit source version filter', async () => {
    const result = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER },
      { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_SUCCESS, payload: result },
    ];

    bundlesService.editSourceVersionFilter = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(editSourceVersionFilter('1234-5678', '2323-232', { id: 1 }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle edit source version filter error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER },
      { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_ERROR, payload: expectedError },
    ];
    bundlesService.editSourceVersionFilter = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(editSourceVersionFilter());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle delete source version filter', async () => {
    const result = { id: '1234', sourceSystemNAme: 'test' };
    const expectedActions = [
      { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER },
      { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_SUCCESS, payload: result },
    ];

    bundlesService.deleteSourceVersionFilter = jest.fn().mockImplementation(() => {
      return result;
    });

    await mockStore.dispatch(deleteSourceVersionFilter('1234-5678', '2323-232'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle delete source version filter error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER },
      { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_ERROR, payload: expectedError.message },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];
    bundlesService.deleteSourceVersionFilter = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(deleteSourceVersionFilter());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle get datamodel list data success', async () => {
    const dataModelList = [{ id: '1234', sourceSystemNAme: 'test' }];
    const expectedActions = [
      { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA },
      { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_SUCCESS, payload: dataModelList },
    ];

    bundlesService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      return { id: '1234', sourceSystemNAme: 'test' };
    });

    await mockStore.dispatch(getDataModelListData(['1234']));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle get datamodel list data error', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA },
      { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_ERROR, payload: mockErrorText },
    ];
    bundlesService.getDatamodelFromId = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getDataModelListData(['1234']));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('should handle get bundle transformation status', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION, payload: '1234' },
      { type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_SUCCESS, payload: '1234' },
    ];

    bundlesService.getBundlesFromId = jest.fn().mockImplementation(() => {
      return {};
    });

    await mockStore.dispatch(getBundleTransformationStatus('1234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE -- should handle get bundle transformation status', async () => {
    const expectedActions = [
      { type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION, payload: '1234' },
      { type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_ERROR, payload: '1234' },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
    ];

    bundlesService.getBundlesFromId = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getBundleTransformationStatus('1234'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
