import pipelineService from '../../../services/pipeline.service';
import { CLPipelinesActionTypes } from './actionTypes';
import { addGlobalError } from '../../errors/actions';

export function getCLPipelines(statuses) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST });
      const result = await pipelineService.getContendLibraryPipelines(statuses);
      dispatch({ type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function addCLPipeline(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.POST_CL_PIPELINE_REQUEST });
      const result = await pipelineService.addCLPipeline(pipeline);
      dispatch({ type: CLPipelinesActionTypes.POST_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.POST_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updateCLPipeline(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST });
      const result = await pipelineService.updateCLPipeline(pipeline);
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteCLPipeline(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_REQUEST });
      const result = await pipelineService.deleteCLPipeline(pipeline);
      dispatch({ type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.DELETE_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function approvePipeline(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_REQUEST });
      const result = await pipelineService.approvePipeline(pipeline);
      dispatch({ type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.APPROVE_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
export function switchPipelineBackToDraft(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST });
      const result = await pipelineService.switchPipelineBackToDraft(pipeline);
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function rejectPipeline(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_REQUEST });
      const result = await pipelineService.rejectPipeline(pipeline);
      dispatch({ type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.REJECT_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function submitPipeline(pipeline) {
  return async dispatch => {
    try {
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_REQUEST });
      const result = await pipelineService.submitPipeline(pipeline);
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_SUCCESS });

      return result;
    } catch (err) {
      dispatch({ type: CLPipelinesActionTypes.UPDATE_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
