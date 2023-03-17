import FileSaver from 'file-saver';
import workpaperService from '../../services/workpaper.service';
import analyticsUIService from '../../services/analytics-ui.service';
import stagingService from '../../services/staging.service';
import { downloadFileFromStream } from '../../utils/fileHelper';
import { getEngagementById } from '../engagement/actions';
import { getMyClientById } from '../client/actions';
import { addGlobalError } from '../errors/actions';
import { getWPStep1Details } from './step1/actions';
import { processWorkpaperStatus } from './step2/actions';
import { WPProcessActionTypes } from './actionTypes';

/**
 * In case if engagementId or clientId not defined,
 * Fetch engagement and client to create breadcrumbs
 * @param {string} workpaperId
 */
export function getWorkpapersDetails(workpaperId, workpaperType, trifactaFlowId) {
  return async (dispatch, getState) => {
    try {
      const client = getState().client.get('client');
      const engagement = getState().engagement.get('engagement');

      dispatch({ type: WPProcessActionTypes.GET_DATA });
      const details = await workpaperService.getDetails(workpaperId, false);
      dispatch(getWPStep1Details(workpaperId, null, workpaperType));

      const template = details.templateId ? await workpaperService.getDetails(details.templateId, true) : details;
      const latestTemplate = template.isOutdatedAnalytic
        ? await workpaperService.getLatestWorkPaperIfUpdatePossible(template.chainId, template.versionNumber)
        : null;

      const currentFlowId = trifactaFlowId || details.trifactaFlowId;
      await dispatch(processWorkpaperStatus(workpaperId, false, workpaperType, currentFlowId));

      if (template?.url) {
        const links = await workpaperService.getWorkpaperLinks();
        if (links?.length) {
          template.link = links.find(link => link.url === template.url);
        }
      }
      let checkEngagementCloseout;
      if ((!client || !engagement) && details.engagementId) {
        const engagementDetails = await dispatch(getEngagementById(details.engagementId));
        await dispatch(getMyClientById(engagementDetails.clientId));
        checkEngagementCloseout = engagementDetails?.closeout?.status;
      } else {
        checkEngagementCloseout = engagement?.closeout?.status;
      }

      dispatch({
        type: WPProcessActionTypes.GET_DATA_SUCCESS,
        payload: { details, template, checkEngagementCloseout, latestTemplate },
      });

      return details;
    } catch (err) {
      dispatch({ type: WPProcessActionTypes.GET_DATA_ERROR });

      return {};
    }
  };
}

export function exportTrifactaWorkpaper(workpaperId, wpName) {
  return async dispatch => {
    try {
      let fileName = '';
      dispatch({ type: WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER });
      const data = await workpaperService.exportTrifactaWorkpaper(workpaperId);
      if (data) {
        data.blob().then(resp => {
          fileName = `${wpName}_${workpaperId}.zip`;
          FileSaver.saveAs(resp, fileName);
        });
      }
      dispatch({ type: WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER_SUCCESS });
    } catch (err) {
      dispatch({ type: WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER_ERROR });
      dispatch(addGlobalError(err));
    }
  };
}

export function getWorkpaper(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessActionTypes.GET_WORKPAPER });
      const details = await workpaperService.getDetails(workpaperId, false);

      dispatch({
        type: WPProcessActionTypes.GET_WORKPAPER_SUCCESS,
        payload: { details },
      });
    } catch (err) {
      dispatch({ type: WPProcessActionTypes.GET_WORKPAPER_ERROR });
    }
  };
}

export function getWorkpaperDMTs(workpaperId) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessActionTypes.GET_WORKPAPER_DMTS });
      const dmts = await workpaperService.getWorkpaperDMTs(workpaperId);

      dispatch({
        type: WPProcessActionTypes.GET_WORKPAPER_DMTS_SUCCESS,
        payload: dmts,
      });
    } catch (err) {
      dispatch({ type: WPProcessActionTypes.GET_WORKPAPER_DMTS_ERROR });
    }
  };
}

export function getChildWorkPapersStatus(id) {
  return async dispatch => {
    try {
      dispatch({ type: WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST });
      const isCompleted = await workpaperService.getChildWorkpapersStatus(id);

      dispatch({
        type: WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS,
        payload: isCompleted,
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR,
        payload: true,
      });
    }
  };
}

export function cloneBundleFromInputDataRequest(workpaperId, inputId) {
  return async dispatch => {
    try {
      dispatch({
        type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_REQUEST,
        payload: { inputId },
      });

      const result = await analyticsUIService.cloneBundleFromInputDataRequest(workpaperId, inputId);
      await dispatch(getWorkpaperDMTs(workpaperId));

      dispatch({
        type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_SUCCESS,
        payload: { inputId },
      });

      return result;
    } catch (err) {
      dispatch({ type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_ERROR, payload: { inputId } });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function resetDMTS() {
  return async dispatch => {
    dispatch({ type: WPProcessActionTypes.RESET_DMTS });
  };
}

let actionType = WPProcessActionTypes.DOWNLOAD_ALL_OUTPUTS;

export function downloadWPOutputs(workpaperId, outputId = null) {
  return async dispatch => {
    if (outputId) {
      actionType = WPProcessActionTypes.DOWNLOAD_OUTPUT;
    }
    try {
      dispatch({ type: actionType });

      return await workpaperService.downloadWPOutputs(workpaperId, outputId);
    } catch (err) {
      dispatch({ type: `${actionType}_ERROR` });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function downloadWPOutputsJob(id) {
  return async dispatch => {
    try {
      return await workpaperService.downloadWPOutputsJob(id);
    } catch (err) {
      dispatch({ type: `${actionType}_ERROR` });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function downloadOutputAsZip(path, fileName = null, workpaperName, type) {
  // eslint-disable-next-line consistent-return
  return async dispatch => {
    try {
      const file = await stagingService.stagingGetFileDL(path);

      // for single output file download
      if (fileName) {
        downloadFileFromStream(file, fileName, 'zip', 'application/octet-stream');
      }
      // for multiple output files download
      else {
        downloadFileFromStream(file, `${workpaperName}_${type}`, 'zip', 'application/octet-stream');
      }

      dispatch({
        type: `${actionType}_SUCCESS`,
      });
    } catch (err) {
      dispatch({ type: `${actionType}_ERROR` });
      dispatch(addGlobalError(err));
    }
  };
}
