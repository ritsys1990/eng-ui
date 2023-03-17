const isPipelineFetching = state => state.engagementPipelines.get('isPipelineFetching');
const isPipelineFetchingError = state => state.engagementPipelines.get('isPipelineFetchingError');
const pipelines = state => state.engagementPipelines.get('pipelines');
const isPipelinesRefreshNeeded = state => state.engagementPipelines.get('isPipelinesRefreshNeeded');
const isPipelineCreating = state => state.engagementPipelines.get('isPipelineCreating');
const isPipelineCreatingError = state => state.engagementPipelines.get('isPipelineCreatingError');
const isPipelineUpdating = state => state.engagementPipelines.get('isPipelineUpdating');
const isPipelineUpdatingError = state => state.engagementPipelines.get('isPipelineUpdatingError');
const isPipelineDeleting = state => state.engagementPipelines.get('isPipelineDeleting');
const isPipelineDeletingError = state => state.engagementPipelines.get('isPipelineDeletingError');
const isCLPipelineFetching = state => state.engagementPipelines.get('isCLPipelineFetching');
const isCLPipelineFetchingError = state => state.engagementPipelines.get('isCLPipelineFetchingError');
const clPipelines = state => state.engagementPipelines.get('clPipelines');
const selectAddPipelineSelected = state => state.engagementPipelines.get('addPipelineSelected');
const isCLPipelineCloning = state => state.engagementPipelines.get('isCLPipelineCloning');
const isCLPipelineCloningError = state => state.engagementPipelines.get('isCLPipelineCloningError');

export const EngPipelinesSelectors = {
  isPipelineFetching,
  isPipelineFetchingError,
  pipelines,
  isPipelinesRefreshNeeded,
  isPipelineCreating,
  isPipelineCreatingError,
  isPipelineUpdating,
  isPipelineUpdatingError,
  isPipelineDeleting,
  isPipelineDeletingError,
  isCLPipelineFetching,
  isCLPipelineFetchingError,
  clPipelines,
  selectAddPipelineSelected,
  isCLPipelineCloning,
  isCLPipelineCloningError,
};
