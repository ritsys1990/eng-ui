const isCLPipelineFetching = state => state.contentLibraryPipelines.get('isCLPipelineFetching');
const CLPipelineFetchingError = state => state.contentLibraryPipelines.get('CLPipelineFetchingError');
const CLPipelines = state => state.contentLibraryPipelines.get('CLPipelines');
const isCLPipelinesRefreshNeeded = state => state.contentLibraryPipelines.get('isCLPipelinesRefreshNeeded');
const isCLPipelineAdding = state => state.contentLibraryPipelines.get('isCLPipelineAdding');
const CLPipelineAddingError = state => state.contentLibraryPipelines.get('CLPipelineAddingError');
const isCLPipelineUpdating = state => state.contentLibraryPipelines.get('isCLPipelineUpdating');
const CLPipelineUpdatingError = state => state.contentLibraryPipelines.get('CLPipelineUpdatingError');
const isCLPipelineDeleting = state => state.contentLibraryPipelines.get('isCLPipelineDeleting');
const CLPipelineDeletingError = state => state.contentLibraryPipelines.get('CLPipelineDeletingError');

export const CLPipelinesSelectors = {
  isCLPipelineFetching,
  CLPipelineFetchingError,
  CLPipelines,
  isCLPipelinesRefreshNeeded,
  isCLPipelineAdding,
  CLPipelineAddingError,
  isCLPipelineUpdating,
  CLPipelineUpdatingError,
  isCLPipelineDeleting,
  CLPipelineDeletingError,
};
