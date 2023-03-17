import analyticsUIService from '../../services/analytics-ui.service';
import workpaperService from '../../services/workpaper.service';
import BundlesService from '../../services/bundles.service';
import { addAddWorkpaperError, addGlobalError } from '../errors/actions';
import { WorkpaperActionTypes } from './actionTypes';
import { WorkpaperReviewStatus, CLONING_TYPE, AlertType, CLONING_STATUS } from './statusEnum';
import { getTranslation } from '../../hooks/useTranslation';

export function getWorkpapersList(path, name) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WorkpaperActionTypes.GET_WORKPAPER_LIST_REQUEST });

      let list = [];
      const wpTemplateIdsList = [];

      list = await workpaperService.getList(path, name);

      if (list?.items) {
        list.items.forEach(wp => {
          if (wp.templateId) {
            wpTemplateIdsList.push(wp.templateId);
          }
        });
      }

      if (wpTemplateIdsList.length) {
        const wpListByTemplateIds = await workpaperService.getWPbyIds(wpTemplateIdsList, true);
        const wpListIsLatest = {};

        (wpListByTemplateIds || []).forEach(wp => {
          wpListIsLatest[wp.id] = wp.isOutdatedAnalytic;
        });

        if (Object.keys(wpListIsLatest).length) {
          list = {
            ...list,
            items: list.items.map(item => {
              return { ...item, isOutdatedAnalytic: wpListIsLatest[item.templateId] };
            }),
          };
        }
      }

      const errors = getState().errors.get('errors');
      const { t } = getTranslation();

      list = list.items.reduce((acc, value) => {
        if (
          value &&
          value.workpaperSource === 'Trifacta' &&
          value.workpaperWorkflowCloneStatus === CLONING_STATUS.FAILED
        ) {
          if (!errors.some(err => err.key === value.id)) {
            dispatch(
              addGlobalError({
                key: value.id,
                type: AlertType.ERROR,
                message: t('Pages_EngagementWorkpapers_WorkpaperCloning_Failed').replace(
                  'workpaperName',
                  `${value.name}`
                ),
                extraParam: CLONING_TYPE.WORKPAPER,
              })
            );
          }
        } else {
          acc.push(value);
        }

        return acc;
      }, []);

      list = { ...list, items: list };

      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LIST_SUCCESS,
        payload: list,
      });

      return list;
    } catch (err) {
      dispatch(addAddWorkpaperError(err));
      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LIST_ERROR,
        payload: { err },
      });

      return false;
    }
  };
}

export function setAddWorkpaperModalList(workpaperList) {
  return async dispatch => {
    dispatch({
      type: WorkpaperActionTypes.SET_ADD_WORKPAPER_LIST,
      payload: workpaperList,
    });
  };
}

export function getAddWorkpaperModalList(name, clientId, limit = 20, offset = 0) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_REQUEST, payload: name });
      const list = await workpaperService.getPaginatedList({ query: name, clientId, isPublished: true, limit, offset });
      const ids = list.items.map(workpaper => workpaper.id);
      try {
        const info = await analyticsUIService.getWorkpapersInfo(ids);
        list.items.forEach((workpaper, index) => {
          list.items[index].info = info[workpaper.id] || null;
        });
      } catch (err) {
        dispatch(addAddWorkpaperError(err));
        dispatch({
          type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_ERROR,
          payload: { err },
        });
      }
      if (getState().workpaper.get('latestSearch') === name) {
        dispatch({
          type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_SUCCESS,
          payload: { list, clear: offset === 0 },
        });
      }
    } catch (err) {
      dispatch(addAddWorkpaperError(err));
      dispatch({
        type: WorkpaperActionTypes.GET_ADD_WORKPAPER_LIST_ERROR,
        payload: { err },
      });
    }
  };
}

export function setAddWorkpaperSelected(workpaper) {
  return async dispatch => {
    dispatch({
      type: WorkpaperActionTypes.SET_ADD_WORKPAPER_SELECTED,
      payload: workpaper,
    });
  };
}

export function getWorkpaperLinks(errorAction = addGlobalError) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.GET_WORKPAPER_LINK_LIST_REQUEST });
      const links = await workpaperService.getWorkpaperLinks();
      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LINK_LIST_SUCCESS,
        payload: links,
      });

      return links;
    } catch (err) {
      dispatch(errorAction(err));
      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LINK_LIST_ERROR,
        payload: { err },
      });

      return false;
    }
  };
}

export function createWorkpaper(data) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.CREATE_WORKPAPER_REQUEST });
      const workpaper = await workpaperService.createWorkpaper(data);
      dispatch({
        type: WorkpaperActionTypes.CREATE_WORKPAPER_SUCCESS,
        payload: workpaper,
      });
      dispatch(getWorkpapersList(`?engagementId=${data.engagementId}`));

      return workpaper;
    } catch (err) {
      dispatch({
        type: WorkpaperActionTypes.CREATE_WORKPAPER_ERROR,
        payload: err,
      });
      dispatch(addAddWorkpaperError(err));

      return false;
    }
  };
}

export function createWPWithWorkflowAsync(data) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.CREATE_WORKPAPER_WITH_WORKFLOW_ASYNC_REQUEST });
      const workpaper = await workpaperService.createWPWithWorkflowAsync(data);
      dispatch({
        type: WorkpaperActionTypes.CREATE_WORKPAPER_WITH_WORKFLOW_ASYNC_SUCCESS,
        payload: workpaper,
      });

      return workpaper;
    } catch (err) {
      dispatch({
        type: WorkpaperActionTypes.CREATE_WORKPAPER_WITH_WORKFLOW_ASYNC_ERROR,
        payload: err,
      });
      dispatch(addAddWorkpaperError(err));

      return false;
    }
  };
}

export function getWorkpaperLabelConflicts(workpaperId, engagementId) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.GET_LABEL_CONFLICTS_REQUEST });
      const conflictList = await workpaperService.getLabelConflicts(workpaperId, engagementId);
      dispatch({ type: WorkpaperActionTypes.GET_LABEL_CONFLICTS_SUCCESS });

      return conflictList;
    } catch (err) {
      dispatch({ type: WorkpaperActionTypes.GET_LABEL_CONFLICTS_ERROR });
      dispatch(addAddWorkpaperError(err));

      return false;
    }
  };
}

export function checkWorkpaperNameExists(engagementId, workpaperName) {
  return async dispatch => {
    try {
      return await workpaperService.checkWorkpaperNameExists(engagementId, workpaperName);
    } catch (err) {
      dispatch(addAddWorkpaperError(err));

      return false;
    }
  };
}

export function updateWorkpaper(params) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.UPDATE_WORKPAPER_REQUEST });
      const list = await workpaperService.updateWorkpaper(params);
      dispatch({
        type: WorkpaperActionTypes.UPDATE_WORKPAPER_SUCCESS,
        payload: { list },
      });

      return list;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.UPDATE_WORKPAPER_ERROR,
        payload: { err },
      });

      return false;
    }
  };
}

export function updateWorkpaperWithGetWorkpaperList(params) {
  const { paramsUpdate, engagementId } = params;

  return async dispatch => {
    try {
      await dispatch(updateWorkpaper(paramsUpdate));
      await dispatch(getWorkpapersList(`?engagementId=${engagementId}`));
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LIST_ERROR,
        payload: { err },
      });
    }
  };
}

export function updateReviewStatus(params) {
  return async dispatch => {
    try {
      let result;
      if (params.trifactaFlowId) {
        const makeFlowReadOnly = params.reviewStatus !== WorkpaperReviewStatus.IN_PROGRESS;
        result = await analyticsUIService.makeFlowReadOnly(params.id, makeFlowReadOnly);
      } else {
        result = true;
      }

      if (result) {
        dispatch({ type: WorkpaperActionTypes.UPDATE_REVIEW_STATUS_REQUEST });
        await workpaperService.updateReviewStatus(params);
      }
    } catch (err) {
      dispatch(addGlobalError(err));
    }
  };
}

export function updateReviewStatusWithGetWorkpaperList(params) {
  const { paramsUpdate, engagementId } = params;

  return async dispatch => {
    try {
      await dispatch(updateReviewStatus(paramsUpdate));
      await dispatch(getWorkpapersList(`?engagementId=${engagementId}`));
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LIST_ERROR,
        payload: { err },
      });
    }
  };
}

export function deleteWorkpaper(id) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.DELETE_WORKPAPER_REQUEST });
      await workpaperService.deleteWorkpaper(id);

      dispatch({
        type: WorkpaperActionTypes.DELETE_WORKPAPER_SUCCESS,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.DELETE_WORKPAPER_ERROR,
        payload: { err },
      });
    }
  };
}

export function deleteWorkpaperWithGetWorkpaperList(params) {
  const { workpaperId } = params;

  return async dispatch => {
    try {
      await dispatch(deleteWorkpaper(workpaperId));
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.GET_WORKPAPER_LIST_ERROR,
        payload: { err },
      });
    }
  };
}

export function getWorkpaperTags(errorAction = addGlobalError) {
  return async dispatch => {
    try {
      const tags = await BundlesService.fetchOnlyPublishedTagsWithGroups(true);
      dispatch({
        type: WorkpaperActionTypes.GET_ADD_WORKPAPER_TAGS_SUCCESS,
        payload: tags,
      });

      return tags;
    } catch (err) {
      dispatch(errorAction(err));
      dispatch({
        type: WorkpaperActionTypes.GET_ADD_WORKPAPER_TAGS_ERROR,
        payload: { err },
      });

      return false;
    }
  };
}

export function addNewWorkpaper(engagementId, form) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER });

      await workpaperService.addNewWorkPaper(form, engagementId);
      dispatch({
        type: WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER_SUCCESS,
      });

      return true;
    } catch (err) {
      dispatch(addAddWorkpaperError(err));
      dispatch({
        type: WorkpaperActionTypes.SEND_ADD_NEW_WORKPAPER_FAILURE,
      });

      return false;
    }
  };
}

export function copyWorkpaper(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.COPY_WORKPAPER_REQUEST });
      const newWorkpaper = await workpaperService.copyWorkpaper(workpaperId);
      dispatch({
        type: WorkpaperActionTypes.COPY_WORKPAPER_SUCCESS,
        payload: newWorkpaper,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.COPY_WORKPAPER_ERROR,
      });
    }
  };
}

export function addCentralizedDataEventsToAuditLog(workpaperId, eventStatus, inputName, centralizedDataCategory) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_REQUEST });
      await workpaperService.addCentralizedDatasetEvent(workpaperId, eventStatus, inputName, centralizedDataCategory);
      dispatch({
        type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_SUCCESS,
      });

      return true;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WorkpaperActionTypes.ADD_CENTRALIZEDDATA_EVENT_ERROR,
      });

      return false;
    }
  };
}

export function configureTrifactaBundleTransformation(bundleId, bundleName) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION });
      await workpaperService.configureTrifactaBundleTransformation(bundleId, bundleName);
      const result = await BundlesService.getBundlesFromId(bundleId);
      dispatch({
        type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_SUCCESS,
      });

      return result;
    } catch (err) {
      dispatch({ type: WorkpaperActionTypes.CONFIGURE_TRIFACTA_BUNDLE_TRANSFORMATION_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function createDataRequest(workpaperId, dataSourceSubsribed, inputId) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST });
      const bundleIds = dataSourceSubsribed.map(bundle => bundle.id);
      const dataSourcesByBundle = {};
      dataSourceSubsribed.forEach(bundle => {
        const bundleId = bundle.id;
        const { dataSourceId } = bundle;
        Object.assign(dataSourcesByBundle, {
          [bundleId]: dataSourceId,
        });
      });
      const result = await analyticsUIService.createDataRequest(workpaperId, bundleIds, dataSourcesByBundle, inputId);
      dispatch({
        type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      dispatch({ type: WorkpaperActionTypes.CREATE_NEW_DATA_REQUEST_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function getChildWorkpapersStatusByWorkpaperId(id) {
  return async dispatch => {
    try {
      dispatch({ type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST });

      const isStatusCompleted = await workpaperService.getChildWorkpapersStatus(id);
      dispatch({ type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS });

      return isStatusCompleted;
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({ type: WorkpaperActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR });

      return false;
    }
  };
}
