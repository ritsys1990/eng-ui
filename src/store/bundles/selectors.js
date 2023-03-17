const selectTagsList = state => state.bundles.get('tagsList');
const selectFetchingTags = state => state.bundles.get('fetchingTags');
const selectTagsPublishedList = state => state.bundles.get('tagsPublishedList');
const selectFetchingTagsPublished = state => state.bundles.get('fetchingTagsPublished');
const datamodelsListForWB = state => state.bundles.get('datamodelsListForWB');
const selectIsFetchingDatamodelsListForWB = state => state.bundles.get('isFetchingDataModelsForWB');
const isBundleBaseFetching = state => state.bundles.get('isBundleBaseFetching');
const publishedBundleBase = state => state.bundles.get('publishedBundleBase');
const publishedBundleBaseListCount = state => state.bundles.get('publishedBundleBaseListCount');
const publishedBundlesList = state => state.bundles.get('publishedBundlesList');
const publishedBundlesListInnerTemplate = state => state.bundles.get('publishedBundlesListInnerTemplate');
const selectSourceSystems = state => state.bundles.get('sourceSystems');
const selectIsFetchingSourceSystems = state => state.bundles.get('isFetchingSourceSystems');
const selectTemplatePropertiesList = state => state.bundles.get('templatePropertiesList');
const selectIsFetchingTemplatePropertiesList = state => state.bundles.get('isFetchingTemplatePropertiesList');
const selectTemplateDetails = state => state.bundles.get('templateDetails');
const selectIsFetchingTemplateDetails = state => state.bundles.get('isFetchingTemplateDetails');
const selectBundleNameDetails = state => state.bundles.get('bundleNameDetails');
const selectIsFetchingBundleNameDetails = state => state.bundles.get('isFetchingBundleNameDetails');
const selectIsFetchingDataModelList = state => state.bundles.get('isFetchingDataModelList');
const selectDataModelList = state => state.bundles.get('dataModelList');
const selectIsFetchingTableContext = state => state.bundles.get('isFetchingTableContext');
const selectTableContexts = state => state.bundles.get('tableContexts');
const selectIsFetchingBundleContext = state => state.bundles.get('isFetchingBundleContext');
const selectBundleContexts = state => state.bundles.get('bundleContexts');
const selectIsFetchingFieldContext = state => state.bundles.get('isFetchingFieldContext');
const selectFieldsContext = state => state.bundles.get('fieldsContext');
const selecteSourceVersionFilters = state => state.bundles.get('sourceVersionFilters');
const selectIsFetchingAllSourceVersionFilters = state => state.bundles.get('isFetchingAllSourceVersionFilters');
const selectIsCreatingSourceVersionFilter = state => state.bundles.get('isCreatingSourceVersionFilter');
const selectSourcerVersionFilterError = state => state.bundles.get('sourcerVersionFilterError');
const selectSoureVersionFilter = state => state.bundles.get('sourceVersionFilter');
const selectIsDeletingSourceFilter = state => state.bundles.get('isDeletingSourceFilter');
const selectIsEditingSourceFilter = state => state.bundles.get('isEditingSourceFilter');
const getTrifactaConfigBTIds = state => state.bundles.get('getTrifactaConfigBTIds');

export const bundlesSelectors = {
  selectTagsList,
  selectFetchingTags,
  selectTagsPublishedList,
  selectFetchingTagsPublished,
  datamodelsListForWB,
  selectIsFetchingDatamodelsListForWB,
  isBundleBaseFetching,
  publishedBundleBase,
  publishedBundleBaseListCount,
  publishedBundlesList,
  publishedBundlesListInnerTemplate,
  selectSourceSystems,
  selectIsFetchingSourceSystems,
  selectTemplatePropertiesList,
  selectIsFetchingTemplatePropertiesList,
  selectTemplateDetails,
  selectIsFetchingTemplateDetails,
  selectBundleNameDetails,
  selectIsFetchingBundleNameDetails,
  selectIsFetchingDataModelList,
  selectDataModelList,
  selectIsFetchingTableContext,
  selectTableContexts,
  selectIsFetchingBundleContext,
  selectBundleContexts,
  selectIsFetchingFieldContext,
  selectFieldsContext,
  selecteSourceVersionFilters,
  selectIsFetchingAllSourceVersionFilters,
  selectIsCreatingSourceVersionFilter,
  selectSourcerVersionFilterError,
  selectSoureVersionFilter,
  selectIsDeletingSourceFilter,
  selectIsEditingSourceFilter,
  getTrifactaConfigBTIds,
};
