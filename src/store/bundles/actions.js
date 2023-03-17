import bundlesService from '../../services/bundles.service';
import { BundlesActionTypes } from './actionTypes';
import { addGlobalError } from '../errors/actions';
import { AlertTypes } from 'cortex-look-book';

export function fetchAllTags(errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_ALL_TAGS_REQUEST });
      const allTags = await bundlesService.fetchAllTagsWithGroups();
      dispatch({
        type: BundlesActionTypes.GET_ALL_TAGS_SUCCESS,
        payload: allTags,
      });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({ type: BundlesActionTypes.GET_ALL_TAGS_ERROR, error });
    }
  };
}

export function fetchOnlyPublishedTagsWithGroups(latest = false, errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_REQUEST });
      const tags = await bundlesService.fetchOnlyPublishedTagsWithGroups(latest);
      dispatch({
        type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_SUCCESS,
        payload: tags,
      });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({
        type: BundlesActionTypes.GET_ALL_TAGS_PUBLISHED_ERROR,
        error,
      });
    }
  };
}

export function getAllDataModelsForWB(errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB });
      const datamodels = await bundlesService.getAllDataModelsForWB();
      dispatch({
        type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_SUCCESS,
        payload: datamodels,
      });
    } catch (error) {
      dispatch(errorAction(error));
      dispatch({
        type: BundlesActionTypes.GET_ALL_DATAMODELS_FOR_WB_ERROR,
        error,
      });
    }
  };
}

export function getPublishedBundleBaseList(limit, offset, name, tags, sort) {
  return async (dispatch, getState) => {
    try {
      let existingBundleBaserList = [];
      dispatch({ type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST });
      const publishedBundleBaseList = await bundlesService.getPublishedBundleBaseList(limit, offset, tags, name, sort);
      if (offset >= 10) {
        existingBundleBaserList = getState().bundles.get('publishedBundleBase');
      }
      dispatch({
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST_SUCCESS,
        payload: { existingBundleBaserList, publishedBundleBaseList },
      });
    } catch (error) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: error.message }));
      dispatch({
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLE_BASE_LIST_ERROR,
      });
    }
  };
}

export function getPublishedBundlesList(bundleBaseId) {
  return async dispatch => {
    try {
      dispatch({
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST,
        payload: { bundleBaseId },
      });
      const publishedBundleList = await bundlesService.fetchPublishedBundlesList(bundleBaseId);
      dispatch({
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST_SUCCESS,
        payload: { publishedBundleList, bundleBaseId },
      });
    } catch (error) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: error.message }));
      dispatch({
        type: BundlesActionTypes.GET_ALL_PUBLISHED_BUNDLES_LIST_ERROR,
        payload: { bundleBaseId },
      });
    }
  };
}

export function getBundleTransformationStatus(bundleId) {
  return async dispatch => {
    try {
      dispatch({
        type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION,
        payload: bundleId,
      });
      const bundleDetail = await bundlesService.getBundlesFromId(bundleId);
      dispatch({
        type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_SUCCESS,
        payload: bundleId,
      });

      return bundleDetail;
    } catch (err) {
      dispatch({
        type: BundlesActionTypes.GET_BUNDLES_TRANSFORMATION_ERROR,
        payload: bundleId,
      });
      dispatch(addGlobalError(err));

      return {};
    }
  };
}

export function getSourceSystems() {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_SOURCE_SYSTEMS });
      const payload = await bundlesService.getSourceSystemNames();
      dispatch({
        type: BundlesActionTypes.GET_SOURCE_SYSTEMS_SUCCESS,
        payload,
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({
        type: BundlesActionTypes.GET_SOURCE_SYSTEMS_ERROR,
        payload: err,
      });
    }

    return false;
  };
}

export function getTemplatePropertiesList(templateId) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST });
      const payload = await bundlesService.getTemplateProperties(templateId);
      dispatch({
        type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_SUCCESS,
        payload,
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({
        type: BundlesActionTypes.GET_TEMPLATE_PROPERTIES_LIST_ERROR,
      });
    }

    return false;
  };
}

export function getTemplateDetails(templateId) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_TEMPLATE_DETAILS });
      const payload = await bundlesService.getTemplateDetails(templateId);
      dispatch({
        type: BundlesActionTypes.GET_TEMPLATE_DETAILS_SUCCESS,
        payload,
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError({ type: AlertTypes.ERROR, message: err.message }));
      dispatch({
        type: BundlesActionTypes.GET_TEMPLATE_DETAILS_ERROR,
      });
    }

    return false;
  };
}

export function getBundleNameDetails(bundleId) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS });
      const bundlenameDetails = await bundlesService.getBundleNameDetails(bundleId);
      dispatch({
        type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_SUCCESS,
        payload: bundlenameDetails,
      });
    } catch (err) {
      dispatch({ type: BundlesActionTypes.GET_BUNDLE_NAME_DETAILS_ERROR, payload: err.message });
    }
  };
}

export function fetchBundleContexts(bundleId, all = true) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT });
      const bundleContexts = await bundlesService.fetchBundleContexts(bundleId, all);
      dispatch({ type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT_SUCCESS, payload: bundleContexts });
    } catch (err) {
      dispatch({ type: BundlesActionTypes.FETCH_BUNDLE_CONTEXT_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function fetchTableContexts(bundleId, bundleContextId, all = false) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.FETCH_TABLE_CONTEXT });
      const tableContexts = await bundlesService.fetchTableContexts(bundleId, bundleContextId, all);
      dispatch({ type: BundlesActionTypes.FETCH_TABLE_CONTEXT_SUCCESS, payload: tableContexts });

      return tableContexts;
    } catch (err) {
      dispatch({ type: BundlesActionTypes.FETCH_TABLE_CONTEXT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function fetchFieldsContext(bundleId, bundleContextId, tableContextId, all = false) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.FETCH_FIELDS_CONTEXT });
      const fieldsContext = await bundlesService.fetchFieldsContext(bundleId, bundleContextId, tableContextId, all);
      dispatch({ type: BundlesActionTypes.FETCH_FIELDS_CONTEXT_SUCCESS, payload: fieldsContext });

      return fieldsContext;
    } catch (err) {
      dispatch({ type: BundlesActionTypes.FETCH_FIELDS_CONTEXT_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function createSourceVersionFilter(bundleId, sourceVersionId, data) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER });
      await bundlesService.createSourceVersionFilter(sourceVersionId, data);
      const sourceVersionFilters = await bundlesService.getSourceVersionAllFilters(bundleId, sourceVersionId);
      dispatch({ type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_SUCCESS, payload: sourceVersionFilters });

      return sourceVersionFilters;
    } catch (err) {
      dispatch({ type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_ERROR, payload: err });

      return false;
    }
  };
}

export function getSourceVersionFilterDetails(bundleId, sourceVersionId) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS });
      const sourceVersionFilters = await bundlesService.getSourceVersionAllFilters(bundleId, sourceVersionId);

      dispatch({
        type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_SUCCESS,
        payload: sourceVersionFilters,
      });

      return sourceVersionFilters;
    } catch (err) {
      dispatch({ type: BundlesActionTypes.GET_SOURCE_VERSION_ALL_FILTERS_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function deleteSourceVersionFilter(bundleId, sourceVersionId, filterId) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER });
      await bundlesService.deleteSourceVersionFilter(sourceVersionId, filterId);
      const sourceVersionFilters = await bundlesService.getSourceVersionAllFilters(bundleId, sourceVersionId);
      dispatch({
        type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_SUCCESS,
        payload: sourceVersionFilters,
      });

      return sourceVersionFilters;
    } catch (err) {
      dispatch({ type: BundlesActionTypes.DELETE_SOURCE_VERSION_FILTER_ERROR, payload: err.message });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function editSourceVersionFilter(bundleId, sourceVersionId, filterId, data) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER });
      await bundlesService.editSourceVersionFilter(sourceVersionId, filterId, data);
      const sourceVersionFilters = await bundlesService.getSourceVersionAllFilters(bundleId, sourceVersionId);
      dispatch({
        type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_SUCCESS,
        payload: sourceVersionFilters,
      });

      return sourceVersionFilters;
    } catch (err) {
      dispatch({ type: BundlesActionTypes.EDIT_SOURCE_VERSION_FILTER_ERROR, payload: err });

      return false;
    }
  };
}

export function getDataModelListData(dataModelsIds) {
  return async dispatch => {
    try {
      dispatch({ type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA });
      let dataModelListList = [];
      if (dataModelsIds?.length > 0) {
        dataModelListList = await Promise.all(
          dataModelsIds.map(async dataModelId => {
            return bundlesService.getDatamodelFromId(dataModelId);
          })
        );
      }
      dispatch({
        type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_SUCCESS,
        payload: dataModelListList,
      });
    } catch (err) {
      dispatch({ type: BundlesActionTypes.GET_DATA_MODEL_LIST_DATA_ERROR, payload: err.message });
    }
  };
}
