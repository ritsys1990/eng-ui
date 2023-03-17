import pipelineService from '../../../services/pipeline.service';
import { EngPipelinesActionTypes } from './actionTypes';
import { addGlobalError, addPipelineError, updatePipelineError } from '../../errors/actions';
import { getTranslation } from '../../../hooks/useTranslation';

export function addPipelineCloningFailed({ id, pipelineName, engagementId }) {
  const { t } = getTranslation();
  const message = t('Pages_Engagement_PipelinesListing_PipelineCloning_Failed').replace(
    'pipelineName',
    `${pipelineName}`
  );

  return { key: id, message, type: 'error', alertAttr: engagementId };
}

export function getPipelineList(engagementId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_REQUEST });
      const result = await pipelineService.getPipelineList(engagementId);
      const errors = getState().errors.get('errors');
      const cloningFilter = result.items.reduce((acc, value) => {
        if (value.cloningStatus === 'Failed') {
          if (!errors.some(err => err.key === value.id)) {
            const failure = addPipelineCloningFailed(value);
            dispatch(addGlobalError(failure));
          }
        } else {
          acc.push(value);
        }

        return acc;
      }, []);
      dispatch({
        type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_SUCCESS,
        payload: { items: cloningFilter, totalCount: result.totalCount },
      });

      return cloningFilter;
    } catch (err) {
      dispatch({ type: EngPipelinesActionTypes.FETCH_ENG_PIPELINES_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function createPipeline(engagementId, data) {
  return async dispatch => {
    try {
      dispatch({ type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_REQUEST });
      const result = await pipelineService.createPipeline(engagementId, data);
      dispatch({ type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: EngPipelinesActionTypes.CREATE_ENG_PIPELINE_ERROR });
      dispatch(addPipelineError(err));

      return false;
    }
  };
}

export function removePipeline(engagementId, pipelineId) {
  return async dispatch => {
    try {
      dispatch({ type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_REQUEST });
      const result = await pipelineService.removePipeline(engagementId, pipelineId);
      dispatch({ type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: EngPipelinesActionTypes.DELETE_ENG_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function updatePipeline(engagementId, data) {
  return async dispatch => {
    try {
      dispatch({ type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_REQUEST });
      const result = await pipelineService.updatePipeline(engagementId, data);
      dispatch({ type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: EngPipelinesActionTypes.UPDATE_ENG_PIPELINE_ERROR });
      dispatch(updatePipelineError(err));

      return false;
    }
  };
}

export function getCLPipelineList(clientId, value, limit = 20, offset = 0) {
  return async dispatch => {
    try {
      dispatch({ type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_REQUEST });
      const result = await pipelineService.getCLPipelineList(clientId, value, limit, offset);
      dispatch({
        type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_SUCCESS,
        payload: { ...result, clear: offset === 0 },
      });

      return result;
    } catch (err) {
      dispatch({ type: EngPipelinesActionTypes.FETCH_CL_PIPELINES_ERROR });
      dispatch(addPipelineError(err));

      return false;
    }
  };
}

export function setAddPipelineSelected(pipeline) {
  return async dispatch => {
    dispatch({
      type: EngPipelinesActionTypes.SET_ADD_PIPELINE_SELECTED,
      payload: pipeline,
    });
  };
}

export function pipelineNameExists(engagementId, pipelineName) {
  return async dispatch => {
    try {
      return await pipelineService.pipelineNameExists(engagementId, pipelineName);
    } catch (err) {
      dispatch(addPipelineError(err));

      return false;
    }
  };
}

export function submitCLPipeline(engagementId, data) {
  return async dispatch => {
    try {
      dispatch({ type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_REQUEST });
      const result = await pipelineService.submitCLPipeline(engagementId, data);
      dispatch({ type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_SUCCESS, payload: result });

      return result;
    } catch (err) {
      dispatch({ type: EngPipelinesActionTypes.CLONING_CL_PIPELINE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
