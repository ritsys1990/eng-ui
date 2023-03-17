import reducer, { initialState } from '../reducer';
import { BundlesActionTypes } from '../actionTypes';

describe('bundle reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('get all tag requets', () => {
    const expectedState = initialState.merge({
      fetchingTags: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_TAGS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get all tag requets success', () => {
    const expectedState = initialState.merge({
      fetchingTags: false,
      tagsList: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_TAGS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get all tag requets error', () => {
    const expectedState = initialState.merge({
      fetchingTags: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_TAGS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get all published tag requets', () => {
    const expectedState = initialState.merge({
      fetchingTagsPublished: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get all published tag requets success', () => {
    const expectedState = initialState.merge({
      fetchingTagsPublished: false,
      tagsPublishedList: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get all published tag requets error', () => {
    const expectedState = initialState.merge({
      fetchingTagsPublished: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get all data models for WB requets', () => {
    const expectedState = initialState.merge({
      isFetchingDataModelsForWB: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB });
    expect(state).toEqual(expectedState);
  });

  it('get all data models for WB success', () => {
    const expectedState = initialState.merge({
      isFetchingDataModelsForWB: false,
      datamodelsListForWB: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get all data models for WB error', () => {
    const expectedState = initialState.merge({
      isFetchingDataModelsForWB: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('clone data model for WB requets', () => {
    const expectedState = initialState.merge({
      isDataModelCloning: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.CLONE_DATAMODEL_FOR_WB });
    expect(state).toEqual(expectedState);
  });

  it('clone data model for WB success', () => {
    const expectedState = initialState.merge({
      isDataModelCloning: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.CLONE_DATAMODEL_FOR_WB_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('clone data model for WB error', () => {
    const expectedState = initialState.merge({
      isDataModelCloning: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.CLONE_DATAMODEL_FOR_WB_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get all bundle base list requets', () => {
    const expectedState = initialState.merge({
      isBundleBaseFetching: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST });
    expect(state).toEqual(expectedState);
  });

  it('get all bundle base list error', () => {
    const expectedState = initialState.merge({
      isBundleBaseFetching: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get all bundle base list requets', () => {
    const expectedState = initialState.merge({
      isFetchingSourceSystems: true,
      sourceSystems: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_SOURCE_SYSTEMS });
    expect(state).toEqual(expectedState);
  });

  it('get all bundle base list success', () => {
    const expectedState = initialState.merge({
      isFetchingSourceSystems: false,
      sourceSystems: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_SOURCE_SYSTEMS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get all bundle base list error', () => {
    const expectedState = initialState.merge({
      isFetchingSourceSystems: false,
      sourceSystems: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_SOURCE_SYSTEMS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get bundle name details', () => {
    const expectedState = initialState.merge({
      isFetchingBundleNameDetails: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS });
    expect(state).toEqual(expectedState);
  });

  it('get bundle name details success', () => {
    const expectedState = initialState.merge({
      isFetchingBundleNameDetails: false,
      bundleNameDetails: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get template properties requets', () => {
    const expectedState = initialState.merge({
      isFetchingTemplatePropertiesList: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST });
    expect(state).toEqual(expectedState);
  });

  it('get template properties success', () => {
    const expectedState = initialState.merge({
      isFetchingTemplatePropertiesList: false,
      templatePropertiesList: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get template properties error', () => {
    const expectedState = initialState.merge({
      isFetchingTemplatePropertiesList: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get template properties requets', () => {
    const expectedState = initialState.merge({
      isFetchingTemplateDetails: true,
      templateDetails: null,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_TEMPLATE_DETAILS });
    expect(state).toEqual(expectedState);
  });

  it('get template properties success', () => {
    const expectedState = initialState.merge({
      isFetchingTemplateDetails: false,
      templateDetails: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_TEMPLATE_DETAILS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get template properties error', () => {
    const expectedState = initialState.merge({
      isFetchingTemplateDetails: false,
      templateDetails: null,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_TEMPLATE_DETAILS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get bundle name details error', () => {
    const expectedState = initialState.merge({
      isFetchingBundleNameDetails: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('fetch bundle Context', () => {
    const expectedState = initialState.merge({
      isFetchingBundleContext: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT });
    expect(state).toEqual(expectedState);
  });

  it('fetch bundle Context success', () => {
    const expectedState = initialState.merge({
      isFetchingBundleContext: false,
      bundleContexts: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('fetch bundle Context error', () => {
    const expectedState = initialState.merge({
      isFetchingBundleContext: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('fetch table Context', () => {
    const expectedState = initialState.merge({
      isFetchingTableContext: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_TABLE_CONTEXT });
    expect(state).toEqual(expectedState);
  });

  it('fetch table Context success', () => {
    const expectedState = initialState.merge({
      isFetchingTableContext: false,
      tableContexts: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_TABLE_CONTEXT_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('fetch table Context error', () => {
    const expectedState = initialState.merge({
      isFetchingFieldContext: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_TABLE_CONTEXT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('fetch field Context', () => {
    const expectedState = initialState.merge({
      isFetchingFieldContext: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT });
    expect(state).toEqual(expectedState);
  });

  it('fetch field Context success', () => {
    const expectedState = initialState.merge({
      isFetchingFieldContext: false,
      fieldsContext: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('fetch field Context error', () => {
    const expectedState = initialState.merge({
      isFetchingFieldContext: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.FETCH_FIELDS_CONTEXT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get create source version filter', () => {
    const expectedState = initialState.merge({
      isCreatingSourceVersionFilter: true,
      sourcerVersionFilterError: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER });
    expect(state).toEqual(expectedState);
  });

  it('get create source version filter success', () => {
    const expectedState = initialState.merge({
      isCreatingSourceVersionFilter: false,
      sourceVersionFilters: undefined,
      sourcerVersionFilterError: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get create source version filter error', () => {
    const expectedState = initialState.merge({
      isCreatingSourceVersionFilter: false,
      sourcerVersionFilterError: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get source all filters request', () => {
    const expectedState = initialState.merge({
      isFetchingAllSourceVersionFilters: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS });
    expect(state).toEqual(expectedState);
  });

  it('get source all filters success', () => {
    const expectedState = initialState.merge({
      isFetchingAllSourceVersionFilters: false,
      sourceVersionFilters: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get source all filters error', () => {
    const expectedState = initialState.merge({
      isFetchingAllSourceVersionFilters: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get edit source version filter', () => {
    const expectedState = initialState.merge({
      isEditingSourceFilter: true,
      sourcerVersionFilterError: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER });
    expect(state).toEqual(expectedState);
  });

  it('get edit source version filter success', () => {
    const expectedState = initialState.merge({
      isEditingSourceFilter: false,
      sourceVersionFilters: undefined,
      sourcerVersionFilterError: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get edit source version filter error', () => {
    const expectedState = initialState.merge({
      isEditingSourceFilter: false,
      sourcerVersionFilterError: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get delete source version filter', () => {
    const expectedState = initialState.merge({
      isDeletingSourceFilter: true,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER });
    expect(state).toEqual(expectedState);
  });

  it('get delete source version filter success', () => {
    const expectedState = initialState.merge({
      isDeletingSourceFilter: false,
      sourceVersionFilters: undefined,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('get delete source version filter error', () => {
    const expectedState = initialState.merge({
      isDeletingSourceFilter: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get data model list', () => {
    const expectedState = initialState.merge({
      isFetchingDataModelList: true,
      dataModelList: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA });
    expect(state).toEqual(expectedState);
  });

  it('get data model list success', () => {
    const payload = [{ id: '1' }];
    const expectedState = initialState.merge({
      isFetchingDataModelList: false,
      dataModelList: payload,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('get data model list error', () => {
    const expectedState = initialState.merge({
      isFetchingDataModelList: false,
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get bundle tranaformation status', () => {
    const expectedState = initialState.merge({
      getTrifactaConfigBTIds: ['456'],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION, payload: '456' });
    expect(state).toEqual(expectedState);
  });

  it('get bundle tranaformation status Success', () => {
    const expectedState = initialState.merge({
      getTrifactaConfigBTIds: [],
    });

    const state = reducer(initialState, {
      type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_SUCCESS,
      payload: '456',
    });
    expect(state).toEqual(expectedState);
  });

  it('get bundle tranaformation status Error', () => {
    const expectedState = initialState.merge({
      getTrifactaConfigBTIds: [],
    });

    const state = reducer(initialState, { type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_ERROR, payload: '456' });
    expect(state).toEqual(expectedState);
  });
});
