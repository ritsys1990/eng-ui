import { Map as ImmutableMap } from 'immutable';
import { BundlesActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  tagsList: [],
  fetchingTags: false,
  tagsPublishedList: [],
  fetchingTagsPublished: false,
  datamodelsListForWB: [],
  isFetchingDataModelsForWB: false,
  isDataModelCloning: true,
  isBundleBaseFetching: false,
  publishedBundleBase: [],
  publishedBundleBaseListCount: 0,
  publishedBundlesList: {},
  publishedBundlesListInnerTemplate: false,
  sourceSystems: [],
  isFetchingSourceSystems: false,
  templatePropertiesList: [],
  isFetchingTemplatePropertiesList: false,
  templateDetails: null,
  isFetchingTemplateDetails: false,
  bundleNameDetails: null,
  isFetchingBundleNameDetails: false,
  dataModelList: [],
  isFetchingDataModelList: false,
  sourceVersionFilters: [],
  isCreatingSourceVersionFilter: false,
  sourcerVersionFilterError: [],
  isEditingSourceFilter: false,
  isFetchingAllSourceVersionFilters: false,
  isFetchingTableContext: false,
  tableContexts: [],
  bundleContexts: [],
  isFetchingBundleContext: false,
  fieldsContext: [],
  isFetchingFieldContext: false,
  getTrifactaConfigBTIds: [],
});

export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case BundlesActionTypes.GET_ALL_TAGS_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingTags: true,
        })
      );

    case BundlesActionTypes.GET_ALL_TAGS_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingTags: false,
          tagsList: action.payload || [],
        })
      );

    case BundlesActionTypes.GET_ALL_TAGS_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingTags: false,
        })
      );

    case BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingTagsPublished: true,
        })
      );

    case BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingTagsPublished: false,
          tagsPublishedList: action.payload || [],
        })
      );

    case BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingTagsPublished: false,
        })
      );

    case BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST:
      const publishedList = state.get('publishedBundlesList');
      publishedList[action.payload.bundleBaseId] = { isFetching: true };

      return state.merge(
        ImmutableMap({
          publishedBundlesList: publishedList,
        })
      );

    case BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST_ERROR:
      const allPublishedList = state.get('publishedBundlesList');
      allPublishedList[action.payload.bundleBaseId] = { isFetching: false };

      return state.merge(
        ImmutableMap({
          publishedBundlesList: allPublishedList,
        })
      );

    case BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST_SUCCESS:
      const isInnerTemplate = state.get('publishedBundlesListInnerTemplate');
      const existingPublishedBundleList = state.get('publishedBundlesList');
      const bundleListbyId = action?.payload?.publishedBundleList?.items.map(eachBundleBase => {
        return {
          name: eachBundleBase.name,
          sourceVersionsCount: eachBundleBase?.bundles.length,
          bundles: eachBundleBase.bundles,
        };
      });

      existingPublishedBundleList[action.payload.bundleBaseId] = bundleListbyId;

      return state.merge(
        ImmutableMap({
          publishedBundlesList: existingPublishedBundleList,
          publishedBundlesListInnerTemplate: !isInnerTemplate,
        })
      );

    case BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB:
      return state.merge(
        ImmutableMap({
          isFetchingDataModelsForWB: true,
        })
      );

    case BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_SUCCESS:
      return state.merge(
        ImmutableMap({
          datamodelsListForWB: action.payload,
          isFetchingDataModelsForWB: false,
        })
      );

    case BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_ERROR:
      return state.merge(
        ImmutableMap({
          isFetchingDataModelsForWB: false,
        })
      );

    case BundlesActionTypes.CLONE_DATAMODEL_FOR_WB:
      return state.merge(
        ImmutableMap({
          isDataModelCloning: true,
        })
      );

    case BundlesActionTypes.CLONE_DATAMODEL_FOR_WB_SUCCESS:
    case BundlesActionTypes.CLONE_DATAMODEL_FOR_WB_ERROR:
      return state.merge(
        ImmutableMap({
          isDataModelCloning: false,
        })
      );

    case BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST:
      return state.merge(
        ImmutableMap({
          isBundleBaseFetching: true,
        })
      );

    case BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST_SUCCESS:
      return state.merge(
        ImmutableMap({
          isBundleBaseFetching: false,
          publishedBundleBase: [
            ...action.payload.existingBundleBaserList,
            ...action.payload.publishedBundleBaseList.items,
          ],
          publishedBundleBaseListCount: action.payload.publishedBundleBaseList.totalCount,
        })
      );

    case BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST_ERROR:
      return state.merge(
        ImmutableMap({
          isBundleBaseFetching: false,
        })
      );

    case BundlesActionTypes.GET_SOURCE_SYSTEMS:
      return state.merge({
        isFetchingSourceSystems: true,
        sourceSystems: [],
      });
    case BundlesActionTypes.GET_SOURCE_SYSTEMS_SUCCESS:
      return state.merge({
        isFetchingSourceSystems: false,
        sourceSystems: action.payload,
      });
    case BundlesActionTypes.GET_SOURCE_SYSTEMS_ERROR:
      return state.merge({
        isFetchingSourceSystems: false,
        sourceSystems: [],
      });
    case BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST:
      return state.merge({
        templatePropertiesList: [],
        isFetchingTemplatePropertiesList: true,
      });
    case BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_SUCCESS:
      return state.merge({
        templatePropertiesList: action.payload,
        isFetchingTemplatePropertiesList: false,
      });
    case BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_ERROR:
    case BundlesActionTypes.CLEAN_TEMPLATE_PROPERTIES_LIST:
      return state.merge({
        templatePropertiesList: [],
        isFetchingTemplatePropertiesList: false,
      });
    case BundlesActionTypes.GET_TEMPLATE_DETAILS:
      return state.merge({
        templateDetails: null,
        isFetchingTemplateDetails: true,
      });
    case BundlesActionTypes.GET_TEMPLATE_DETAILS_SUCCESS:
      return state.merge({
        templateDetails: action.payload,
        isFetchingTemplateDetails: false,
      });
    case BundlesActionTypes.GET_TEMPLATE_DETAILS_CLEAR:
    case BundlesActionTypes.GET_TEMPLATE_DETAILS_ERROR:
      return state.merge({
        templateDetails: null,
        isFetchingTemplateDetails: false,
      });

    case BundlesActionTypes.GET_BUNDLE_NAME_DETAILS:
      return state.merge({
        isFetchingBundleNameDetails: true,
      });
    case BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_SUCCESS:
      return state.merge({
        bundleNameDetails: action.payload,
        isFetchingBundleNameDetails: false,
      });
    case BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_ERROR:
      return state.merge({
        isFetchingBundleNameDetails: false,
      });
    case BundlesActionTypes.FETCH_BUNDLE_CONTEXT:
      return state.merge({
        isFetchingBundleContext: true,
      });
    case BundlesActionTypes.FETCH_BUNDLE_CONTEXT_SUCCESS:
      return state.merge({
        isFetchingBundleContext: false,
        bundleContexts: action.payload,
      });
    case BundlesActionTypes.FETCH_BUNDLE_CONTEXT_ERROR:
      return state.merge({
        isFetchingBundleContext: false,
      });
    case BundlesActionTypes.FETCH_TABLE_CONTEXT:
      return state.merge({
        isFetchingTableContext: true,
      });
    case BundlesActionTypes.FETCH_TABLE_CONTEXT_SUCCESS:
      return state.merge({
        isFetchingTableContext: false,
        tableContexts: action.payload,
      });
    case BundlesActionTypes.FETCH_TABLE_CONTEXT_ERROR:
      return state.merge({
        isFetchingTableContext: false,
      });
    case BundlesActionTypes.FETCH_FIELDS_CONTEXT:
      return state.merge({
        isFetchingFieldContext: true,
      });
    case BundlesActionTypes.FETCH_FIELDS_CONTEXT_SUCCESS:
      return state.merge({
        isFetchingFieldContext: false,
        fieldsContext: action.payload,
      });
    case BundlesActionTypes.FETCH_FIELDS_CONTEXT_ERROR:
      return state.merge({
        isFetchingFieldContext: false,
      });
    case BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER:
      return state.merge({
        isCreatingSourceVersionFilter: true,
        sourcerVersionFilterError: [],
      });
    case BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_SUCCESS:
      return state.merge({
        isCreatingSourceVersionFilter: false,
        sourceVersionFilters: action.payload,
        sourcerVersionFilterError: [],
      });
    case BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_ERROR:
      return state.merge({
        isCreatingSourceVersionFilter: false,
        sourcerVersionFilterError: action.payload,
      });

    case BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_REMOVE_ERROR:
      return state.merge(
        ImmutableMap({
          sourcerVersionFilterError: [],
        })
      );
    case BundlesActionTypes.GET_DATA_MODEL_LIST_DATA:
      return state.merge({
        isFetchingDataModelList: true,
        dataModelList: [],
      });
    case BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_SUCCESS:
      return state.merge({
        dataModelList: action.payload,
        isFetchingDataModelList: false,
      });
    case BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_ERROR:
      return state.merge({
        isFetchingDataModelList: false,
      });
    case BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS:
      return state.merge({
        isFetchingAllSourceVersionFilters: true,
      });
    case BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_SUCCESS:
      return state.merge({
        sourceVersionFilters: action.payload,
        isFetchingAllSourceVersionFilters: false,
      });
    case BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_ERROR:
      return state.merge({
        isFetchingAllSourceVersionFilters: false,
      });
    case BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER:
      return state.merge({
        isDeletingSourceFilter: true,
      });
    case BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_SUCCESS:
      return state.merge({
        isDeletingSourceFilter: false,
        sourceVersionFilters: action.payload,
      });
    case BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_ERROR:
      return state.merge({
        isDeletingSourceFilter: false,
      });
    case BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER:
      return state.merge({
        isEditingSourceFilter: true,
        sourcerVersionFilterError: [],
      });
    case BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_SUCCESS:
      return state.merge({
        isEditingSourceFilter: false,
        sourceVersionFilters: action.payload,
        sourcerVersionFilterError: [],
      });
    case BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_ERROR:
      return state.merge({
        isEditingSourceFilter: false,
        sourcerVersionFilterError: action.payload,
      });

    case BundlesActionTypes.GET_BUNDLES_TRANSFORMATION:
      const getTrifactaConfigBTIdList = state.get('getTrifactaConfigBTIds');

      return state.merge({
        getTrifactaConfigBTIds: [...getTrifactaConfigBTIdList, action.payload],
      });

    case BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_SUCCESS:
    case BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_ERROR:
      let getTrifactaConfigBTIdAll = state.get('getTrifactaConfigBTIds');
      getTrifactaConfigBTIdAll = [...getTrifactaConfigBTIdAll.filter(eachId => eachId !== action.payload)];

      return state.merge({
        getTrifactaConfigBTIds: getTrifactaConfigBTIdAll,
      });

    default:
      return state;
  }
}
