import { DATA_REQUEST_STATUS } from '../constants/InputDataRequestStatus.const';
import { Intent } from 'cortex-look-book';

/**
 * Return data request status translation key by status
 * @param {String} status
 * @return {String} translation key
 */
export function getDataRequestStatusTranslationKey(status) {
  switch (status) {
    case DATA_REQUEST_STATUS.DRAFT:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Draft';

    case DATA_REQUEST_STATUS.EXTRACTION_COMPLETE:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Extraction_Complete';

    case DATA_REQUEST_STATUS.EXTRACTION_FAILED:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Extraction_Failed';

    case DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_TRANSFER_APPROVAL:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Waiting_For_Client_Transfer_Approval';

    case DATA_REQUEST_STATUS.WAITING_FOR_AUDITOR_APPROVAL:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Waiting_For_Auditor_Approval';

    case DATA_REQUEST_STATUS.TRANSFER_FAILED:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Failed';

    case DATA_REQUEST_STATUS.READY_FOR_EXTRACTION:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Ready_For_Extraction';

    case DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Extraction_In_Progress';

    case DATA_REQUEST_STATUS.READY_FOR_TRANSFER:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Ready_For_Transfer';

    case DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_In_Progress';

    case DATA_REQUEST_STATUS.TRANSFER_COMPLETE:
    case DATA_REQUEST_STATUS.IS_DONE:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Complete';

    case DATA_REQUEST_STATUS.APPROVED_AND_SCHEDULED:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Approved_And_Scheduled';

    case DATA_REQUEST_STATUS.CHANGE_SCHEDULE_PARAMETERS:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Change_Schedule_Parameters';

    case DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Waiting_For_Client_Extraction_Approval';

    case DATA_REQUEST_STATUS.RESCHEDULE_REQUESTED:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Reschedule_Requested';

    case DATA_REQUEST_STATUS.TRANSFER_REJECTED:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Rejected';

    case DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Rejected_By_Auditor';

    case DATA_REQUEST_STATUS.REJECTED_BY_CLIENT:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Rejected_By_Client';

    case DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Consolidating_Raw_Files';

    case DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Error_Consolidating_Raw_Files';

    case null || undefined || '':
    default:
      return 'Pages_WorkpaperProcess_Step1_Table_Data_Request_Not_Submitted';
  }
}

/**
 * Return boolean to indicate if data request hasn't been submitted
 * @param {Object} data request statuses
 * @return {Boolean} true/false if data request hasn't been submitted
 */
export function isDataRequestNotSubmitted(statuses) {
  return statuses === null || statuses === undefined || Object.entries(statuses).length === 0;
}

/**
 * Return data request status data by key, to avoid additional mapping
 * @param {Object} data request statuses
 * @param {String} key
 * @return {String|number|boolean} data key value
 */
export function getDataRequestStatusDataByKey(statuses, key) {
  // default
  let progress = 50;
  let isProcessing = false;
  let statusType = Intent.INFO;

  if (
    [
      DATA_REQUEST_STATUS.TRANSFER_FAILED,
      DATA_REQUEST_STATUS.EXTRACTION_FAILED,
      DATA_REQUEST_STATUS.TRANSFER_REJECTED,
      DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR,
      DATA_REQUEST_STATUS.REJECTED_BY_CLIENT,
      DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES,
    ].some(status => status in statuses)
  ) {
    if ([DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES].some(status => status in statuses)) {
      progress = 75;
    }
    statusType = Intent.ERROR;
  }

  if (
    [
      DATA_REQUEST_STATUS.DRAFT,
      DATA_REQUEST_STATUS.APPROVED_AND_SCHEDULED,
      DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS,
      DATA_REQUEST_STATUS.READY_FOR_TRANSFER,
      DATA_REQUEST_STATUS.CHANGE_SCHEDULE_PARAMETERS,
      DATA_REQUEST_STATUS.EXTRACTION_COMPLETE,
      DATA_REQUEST_STATUS.READY_FOR_EXTRACTION,
      DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
      DATA_REQUEST_STATUS.WAITING_FOR_AUDITOR_APPROVAL,
      DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL,
      DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_TRANSFER_APPROVAL,
      DATA_REQUEST_STATUS.RESCHEDULE_REQUESTED,
      DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES,
    ].some(status => status in statuses) ||
    isDataRequestNotSubmitted(statuses)
  ) {
    if ([DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES].some(status => status in statuses)) {
      progress = 75;
    }
    isProcessing = true;
  }

  // if any status is transfer completed or done, it is "successsful"
  if ([DATA_REQUEST_STATUS.TRANSFER_COMPLETE, DATA_REQUEST_STATUS.IS_DONE].some(status => status in statuses)) {
    statusType = Intent.SUCCESS;
    progress = 100;
  }

  const data = {
    statusType,
    progress,
    isProcessing,
  };

  return data[key];
}

/**
 * Return boolean to indicate if input is connected to data request
 * @param {Object} input
 * @return {Boolean} true/false if input is connected to data request
 */
export function isInputConnectedToDataRequest(input) {
  return input.dataRequestInfo !== undefined && input.dataRequestInfo !== null && input.dataRequestInfo?.length;
}

/**
 * Helper function that takes a DR status string and returns its "statusType"
 * @param {String} data request status
 * @return {String} statusType string
 */
export function getDataRequestStatusType(status) {
  return getDataRequestStatusDataByKey({ [status]: null }, 'statusType');
}

/**
 * Return boolean if data request input is all consolidated
 * @param {Object} input
 * @return {Boolean} true/false
 */
export function getDataRequestIsAllConsolidated(input) {
  const allRequestBundles = [];
  input?.dataRequestStatus?.forEach(dataRequestStatus => {
    dataRequestStatus?.forEach(schedule => {
      if (schedule.status === DATA_REQUEST_STATUS.TRANSFER_COMPLETE && schedule?.bundles?.[0]?.allConsolidated) {
        allRequestBundles.push(true);
      } else if (
        schedule.status === DATA_REQUEST_STATUS.TRANSFER_COMPLETE &&
        !schedule?.bundles?.[0]?.allConsolidated
      ) {
        allRequestBundles.push(false);
      }
    });
  });

  let isAllConsolidated = allRequestBundles?.every(allConsolidated => allConsolidated === true);

  if (isAllConsolidated === undefined) {
    isAllConsolidated = false;
  }

  return isAllConsolidated;
}

/**
 * Return number of consolidated schedules
 * @param {Object} input
 * @return {number}
 */
export function getConsolidatedSchedulesCount(input) {
  return (
    input?.dataRequestStatus?.map(status => status.filter(schedule => schedule.bundles[0]?.allConsolidated === true))[0]
      ?.length || 0
  );
}

/**
 * Return boolean if data request input has at least one defined "bundleTransformationId"
 * @param {Object} input
 * @return {Boolean} true/false
 */
export function dataRequestHasTransformationId(input) {
  let hasId = input.dataRequestInfo?.some(
    info => info.bundleTransformationId !== null && info.bundleTransformationId !== undefined
  );

  if (hasId === undefined) {
    hasId = false;
  }

  return hasId;
}

/**
 * Return object to indicate data request statuses
 * @param {Object} input
 * @return {Object} all data request statuses (ie { Draft: 1, TransferComplete: 2 })
 */
export function getDataRequestStatus(input) {
  const statusArray = input?.dataRequestStatus?.map(dataRequest => {
    return dataRequest.map(schedule => {
      return schedule.status;
    });
  });

  // create status object and count number of status occurrences
  let allStatuses = {};
  if (statusArray) {
    statusArray?.[0]?.forEach(status => {
      allStatuses[status] = (allStatuses[status] || 0) + 1;
    });
  }

  if (Object.keys(allStatuses).some(key => key === DATA_REQUEST_STATUS.TRANSFER_COMPLETE)) {
    if (getDataRequestIsAllConsolidated(input) === false) {
      allStatuses = { [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: null };
    } else if (dataRequestHasTransformationId(input)) {
      // replace "TRANSFER_COMPLETE" status with "IS_DONE" once we have transformation id
      allStatuses[DATA_REQUEST_STATUS.IS_DONE] = allStatuses[DATA_REQUEST_STATUS.TRANSFER_COMPLETE];
      delete allStatuses[DATA_REQUEST_STATUS.TRANSFER_COMPLETE];
    }
  }

  return allStatuses;
}

/**
 * Return data request ID
 * @param {Object} input
 * @return {String} dataRequestId
 */
export function getDataRequestId(input) {
  return input.dataRequestInfo?.[0]?.dataRequestId;
}

/**
 * Return boolean to indicate if data request is processing
 * @param {Object} input
 * @return {Boolean} true/false if data request is currently in 'processing' mode
 */
export function isDataRequestProcessing(input) {
  return (
    isInputConnectedToDataRequest(input) && getDataRequestStatusDataByKey(getDataRequestStatus(input), 'isProcessing')
  );
}

/**
 * Return boolean to indicate if any data request schedule is done
 * @param {Object} input
 * @return {Boolean} true/false if any is done
 */
export function isAnyDataRequestScheduleDone(input) {
  return (
    isInputConnectedToDataRequest(input) &&
    (DATA_REQUEST_STATUS.IS_DONE in getDataRequestStatus(input) ||
      DATA_REQUEST_STATUS.TRANSFER_COMPLETE in getDataRequestStatus(input))
  );
}
