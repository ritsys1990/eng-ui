import {
  getDataRequestStatusTranslationKey,
  getDataRequestStatusDataByKey,
  isInputConnectedToDataRequest,
  getDataRequestStatus,
  getDataRequestId,
  isDataRequestProcessing,
  getDataRequestIsAllConsolidated,
  dataRequestHasTransformationId,
  getDataRequestStatusType,
  isAnyDataRequestScheduleDone,
  getConsolidatedSchedulesCount,
  isDataRequestNotSubmitted,
} from '../utils/InputDataRequestStatus.utils';
import { DATA_REQUEST_STATUS } from '../constants/InputDataRequestStatus.const';
import { Intent } from 'cortex-look-book';

describe('Input Data Request Status Utils', () => {
  describe('getDataRequestStatusTranslationKey function', () => {
    it("should return correct translation key if status is 'DRAFT'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.DRAFT);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Draft');
    });

    it("should return correct translation key if status is 'EXTRACTION_COMPLETE'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.EXTRACTION_COMPLETE);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Extraction_Complete');
    });

    it("should return correct translation key if status is 'EXTRACTION_FAILED'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.EXTRACTION_FAILED);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Extraction_Failed');
    });

    it("should return correct translation key if status is 'WAITING_FOR_CLIENT_TRANSFER_APPROVAL'", () => {
      const translationKey = getDataRequestStatusTranslationKey(
        DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_TRANSFER_APPROVAL
      );

      expect(translationKey).toBe(
        'Pages_WorkpaperProcess_Step1_Table_Data_Request_Waiting_For_Client_Transfer_Approval'
      );
    });

    it("should return correct translation key if status is 'WAITING_FOR_AUDITOR_APPROVAL'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.WAITING_FOR_AUDITOR_APPROVAL);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Waiting_For_Auditor_Approval');
    });

    it("should return correct translation key if status is 'TRANSFER_FAILED'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.TRANSFER_FAILED);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Failed');
    });

    it("should return correct translation key if status is 'READY_FOR_EXTRACTION'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.READY_FOR_EXTRACTION);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Ready_For_Extraction');
    });

    it("should return correct translation key if status is 'EXTRACTION_IN_PROGRESS'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Extraction_In_Progress');
    });

    it("should return correct translation key if status is 'READY_FOR_TRANSFER'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.READY_FOR_TRANSFER);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Ready_For_Transfer');
    });

    it("should return correct translation key if status is 'TRANSFER_IN_PROGRESS'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_In_Progress');
    });

    it("should return correct translation key if status is 'TRANSFER_COMPLETE'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.TRANSFER_COMPLETE);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Complete');
    });

    it("should return correct translation key if status is 'IS_DONE'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.IS_DONE);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Complete');
    });

    it("should return correct translation key if status is 'APPROVED_AND_SCHEDULED'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.APPROVED_AND_SCHEDULED);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Approved_And_Scheduled');
    });

    it("should return correct translation key if status is 'CHANGE_SCHEDULE_PARAMETERS'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.CHANGE_SCHEDULE_PARAMETERS);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Change_Schedule_Parameters');
    });

    it("should return correct translation key if status is 'WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL'", () => {
      const translationKey = getDataRequestStatusTranslationKey(
        DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL
      );

      expect(translationKey).toBe(
        'Pages_WorkpaperProcess_Step1_Table_Data_Request_Waiting_For_Client_Extraction_Approval'
      );
    });

    it("should return correct translation key if status is 'RESCHEDULE_REQUESTED'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.RESCHEDULE_REQUESTED);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Reschedule_Requested');
    });

    it("should return correct translation key if status is 'TRANSFER_REJECTED'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.TRANSFER_REJECTED);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Transfer_Rejected');
    });

    it("should return correct translation key if status is 'REJECTED_BY_AUDITOR'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Rejected_By_Auditor');
    });

    it("should return correct translation key if status is 'REJECTED_BY_CLIENT'", () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.REJECTED_BY_CLIENT);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Rejected_By_Client');
    });

    it('should return correct translation key if status is null', () => {
      const translationKey = getDataRequestStatusTranslationKey(null);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Not_Submitted');
    });

    it('should return correct translation key if status is undefined', () => {
      const translationKey = getDataRequestStatusTranslationKey(undefined);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Not_Submitted');
    });

    it('should return correct translation key if status is an empty string', () => {
      const translationKey = getDataRequestStatusTranslationKey('');

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Not_Submitted');
    });

    it('should return correct translation key if status is CONSOLIDATING_RAW_FILES', () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Consolidating_Raw_Files');
    });

    it('should return correct translation key if status is ERROR_CONSOLIDATING_RAW_FILES', () => {
      const translationKey = getDataRequestStatusTranslationKey(DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES);

      expect(translationKey).toBe('Pages_WorkpaperProcess_Step1_Table_Data_Request_Error_Consolidating_Raw_Files');
    });
  });

  describe('getDataRequestStatusDataByKey function', () => {
    let statusType;
    let progress;
    let isProcessing;

    it('should return the correct statusType value for DRAFT status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.DRAFT]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for APPROVED_AND_SCHEDULED status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.APPROVED_AND_SCHEDULED]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for EXTRACTION_IN_PROGRESS stastus', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for READY_FOR_TRANSFER status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.READY_FOR_TRANSFER]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for CHANGE_SCHEDULE_PARAMETERS status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.CHANGE_SCHEDULE_PARAMETERS]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for EXTRACTION_COMPLETE status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_COMPLETE]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for READY_FOR_EXTRACTION status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.READY_FOR_EXTRACTION]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for TRANSFER_IN_PROGRESS status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for WAITING_FOR_AUDITOR_APPROVAL status', () => {
      statusType = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_AUDITOR_APPROVAL]: 1 },
        'statusType'
      );
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL status', () => {
      statusType = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL]: 1 },
        'statusType'
      );
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for WAITING_FOR_CLIENT_TRANSFER_APPROVAL status', () => {
      statusType = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_TRANSFER_APPROVAL]: 1 },
        'statusType'
      );
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for RESCHEDULE_REQUESTED status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.RESCHEDULE_REQUESTED]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for TRANSFER_FAILED status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_FAILED]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.ERROR);
    });

    it('should return the correct statusType value for EXTRACTION_FAILED status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_FAILED]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.ERROR);
    });

    it('should return the correct statusType value for TRANSFER_REJECTED status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_REJECTED]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.ERROR);
    });

    it('should return the correct statusType value for REJECTED_BY_AUDITOR status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.ERROR);
    });

    it('should return the correct statusType value for REJECTED_BY_CLIENT status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.REJECTED_BY_CLIENT]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.ERROR);
    });

    it('should return the correct statusType value for TRANSFER_COMPLETE status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.SUCCESS);
    });

    it('should return the correct statusType value for IS_DONE status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.IS_DONE]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.SUCCESS);
    });

    it('should return the correct statusType value for CONSOLIDATING_RAW_FILES status', () => {
      statusType = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct statusType value for ERROR_CONSOLIDATING_RAW_FILES status', () => {
      statusType = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES]: 1 },
        'statusType'
      );
      expect(statusType).toBe(Intent.ERROR);
    });

    it('should return the correct statusType value for an unknown status', () => {
      statusType = getDataRequestStatusDataByKey({ foo: 1 }, 'statusType');
      expect(statusType).toBe(Intent.INFO);
    });

    it('should return the correct progress value for DRAFT status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.DRAFT]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for APPROVED_AND_SCHEDULED status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.APPROVED_AND_SCHEDULED]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for EXTRACTION_IN_PROGRESS status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for READY_FOR_TRANSFER status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.READY_FOR_TRANSFER]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for CHANGE_SCHEDULE_PARAMETERS status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.CHANGE_SCHEDULE_PARAMETERS]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for EXTRACTION_COMPLETE status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_COMPLETE]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for READY_FOR_EXTRACTION status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.READY_FOR_EXTRACTION]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for TRANSFER_IN_PROGRESS status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for WAITING_FOR_AUDITOR_APPROVAL status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.WAITING_FOR_AUDITOR_APPROVAL]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL status', () => {
      progress = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL]: 1 },
        'progress'
      );
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for WAITING_FOR_CLIENT_TRANSFER_APPROVAL status', () => {
      progress = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_TRANSFER_APPROVAL]: 1 },
        'progress'
      );
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for RESCHEDULE_REQUESTED status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.RESCHEDULE_REQUESTED]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for TRANSFER_FAILED status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_FAILED]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for EXTRACTION_FAILED status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_FAILED]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for TRANSFER_REJECTED status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_REJECTED]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for REJECTED_BY_AUDITOR status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for REJECTED_BY_CLIENT status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.REJECTED_BY_CLIENT]: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct progress value for TRANSFER_COMPLETE status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1 }, 'progress');
      expect(progress).toBe(100);
    });

    it('should return the correct progress value for IS_DONE status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.IS_DONE]: 1 }, 'progress');
      expect(progress).toBe(100);
    });

    it('should return the correct progress value for CONSOLIDATING_RAW_FILES status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: 1 }, 'progress');
      expect(progress).toBe(75);
    });

    it('should return the correct progress value for ERROR_CONSOLIDATING_RAW_FILES status', () => {
      progress = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES]: 1 }, 'progress');
      expect(progress).toBe(75);
    });

    it('should return the correct progress value for an unknown status', () => {
      progress = getDataRequestStatusDataByKey({ foo: 1 }, 'progress');
      expect(progress).toBe(50);
    });

    it('should return the correct isProcessing value for DRAFT status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.DRAFT]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for APPROVED_AND_SCHEDULED status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.APPROVED_AND_SCHEDULED]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for EXTRACTION_IN_PROGRESS status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for READY_FOR_TRANSFER status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.READY_FOR_TRANSFER]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for CHANGE_SCHEDULE_PARAMETERS status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.CHANGE_SCHEDULE_PARAMETERS]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for EXTRACTION_COMPLETE status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_COMPLETE]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for READY_FOR_EXTRACTION status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.READY_FOR_EXTRACTION]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for TRANSFER_IN_PROGRESS staus', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for WAITING_FOR_AUDITOR_APPROVAL status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_AUDITOR_APPROVAL]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_EXTRACTIONS_APPROVAL]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for WAITING_FOR_CLIENT_TRANSFER_APPROVAL status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.WAITING_FOR_CLIENT_TRANSFER_APPROVAL]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for RESCHEDULE_REQUESTED status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.RESCHEDULE_REQUESTED]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for data requests not submitted', () => {
      isProcessing = getDataRequestStatusDataByKey({}, 'isProcessing');
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for TRANSFER_FAILED status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_FAILED]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for EXTRACTION_FAILED status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.EXTRACTION_FAILED]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for TRANSFER_REJECTED status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_REJECTED]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for REJECTED_BY_AUDITOR status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for REJECTED_BY_CLIENT status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.REJECTED_BY_CLIENT]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for TRANSFER_COMPLETE status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for IS_DONE status', () => {
      isProcessing = getDataRequestStatusDataByKey({ [DATA_REQUEST_STATUS.IS_DONE]: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for CONSOLIDATING_RAW_FILES status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for ERROR_CONSOLIDATING_RAW_FILES status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.ERROR_CONSOLIDATING_RAW_FILES]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for an unknown status', () => {
      isProcessing = getDataRequestStatusDataByKey({ foo: 1 }, 'isProcessing');
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for IS_DONE status and an error status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.IS_DONE]: 1, [DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for TRANSFER_COMPLETE status and an error status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1, [DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(false);
    });

    it('should return the correct isProcessing value for IS_DONE status and and an processing status', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.IS_DONE]: 1, [DATA_REQUEST_STATUS.DRAFT]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct isProcessing value for TRANSFER_COMPLETE status and processing status"', () => {
      isProcessing = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1, [DATA_REQUEST_STATUS.DRAFT]: 1 },
        'isProcessing'
      );
      expect(isProcessing).toBe(true);
    });

    it('should return the correct progress value for TRANSFER_COMPLETE status and any other status"', () => {
      progress = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1, [DATA_REQUEST_STATUS.DRAFT]: 1 },
        'progress'
      );
      expect(progress).toBe(100);
    });

    it('should return the correct progress value for IS_DONE status and any other status"', () => {
      progress = getDataRequestStatusDataByKey(
        { [DATA_REQUEST_STATUS.IS_DONE]: 1, [DATA_REQUEST_STATUS.DRAFT]: 1 },
        'progress'
      );
      expect(progress).toBe(100);
    });
  });

  describe('isInputConnectedToDataRequest function', () => {
    it('should return true if dataRequestInfo is defined', () => {
      const dataRequestId = '1234';

      const input = {
        anotherKey: 'bar',
        dataRequestInfo: [{ dataRequestId }],
      };

      const isConnected = isInputConnectedToDataRequest(input);
      expect(isConnected).toBe(true);
    });

    it('should return false if dataRequestInfo is undefined', () => {
      const input = {
        anotherKey: 'bar',
      };

      const isConnected = isInputConnectedToDataRequest(input);
      expect(isConnected).toBe(false);
    });

    it('should return false if dataRequestInfo is null', () => {
      const input = {
        dataRequestInfo: null,
      };

      const isConnected = isInputConnectedToDataRequest(input);
      expect(isConnected).toBe(false);
    });
  });

  describe('getDataRequestStatus function', () => {
    it('should return status if defined and allConsolidated is false', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
              bundles: [{ allConsolidated: false }],
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ TransferInProgress: 1 });
    });

    it('should return status if defined and allConsolidated is undefined', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ TransferInProgress: 1 });
    });

    it('should return CONSOLIDATING_RAW_FILES if any status is TRANSFER_COMPLETE and allConsolidated is false', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: false }],
            },
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: null });
    });

    it('should return CONSOLIDATING_RAW_FILES if any status is TRANSFER_COMPLETE and allConsolidated is not defined', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
            },
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: null });
    });

    it('should return undefined if status is not defined', () => {
      const input = {
        dataRequestStatus: [[{ foo: DATA_REQUEST_STATUS.TRANSFER_COMPLETE }]],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ undefined: 1 });
    });

    it('should return TRANSFER_COMPLETE if status is TRANSFER_COMPLETE and allConsolidated is true', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: true }],
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1 });
    });

    it('should return IS_DONE if any status is TRANSFER_COMPLETE, allConsolidated, and bundleTransformationId is defined', () => {
      const input = {
        dataRequestInfo: [{ bundleTransformationId: '1234' }],
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: true }],
            },
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ [DATA_REQUEST_STATUS.IS_DONE]: 1, [DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS]: 1 });
    });

    it('should return CONSOLIDATING_RAW_FILES if any status is TRANSFER_COMPLETE, allConsolidated is false, and bundleTransformationId is defined', () => {
      const input = {
        dataRequestInfo: [{ bundleTransformationId: '1234' }],
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: false }],
            },
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({
        [DATA_REQUEST_STATUS.CONSOLIDATING_RAW_FILES]: null,
      });
    });

    it('should return same statuses if any status is TRANSFER_COMPLETE, allConsolidated, and bundleTransformationId is not defined', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: true }],
            },
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({
        [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1,
        [DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS]: 1,
      });
    });

    it('should return the correct number of occurrences of each status', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
            {
              status: DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS,
            },
            {
              status: DATA_REQUEST_STATUS.DRAFT,
            },
          ],
        ],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({ [DATA_REQUEST_STATUS.TRANSFER_IN_PROGRESS]: 2, [DATA_REQUEST_STATUS.DRAFT]: 1 });
    });

    it('should return an empty object if there are no statuses', () => {
      const input = {
        dataRequestStatus: [],
      };

      const status = getDataRequestStatus(input);
      expect(status).toStrictEqual({});
    });
  });

  describe('getDataRequestId function', () => {
    it('should return dataRequestId if it is defined', () => {
      const dataRequestId = '1234';

      const input = {
        dataRequestInfo: [{ dataRequestId }],
      };

      const status = getDataRequestId(input);
      expect(status).toBe(dataRequestId);
    });

    it('should return undefined if status is not defined', () => {
      const dataRequestId = '1234';

      const input = {
        dataRequestInfo: [{ foo: dataRequestId }],
      };

      const status = getDataRequestId(input);
      expect(status).toBe(undefined);
    });
  });

  describe('isDataRequestProcessing function', () => {
    it('should return true if connected to data request and status is processing', () => {
      const dataRequestId = '1234';

      const input = {
        dataRequestInfo: [{ dataRequestId }],
        dataRequestStatus: [[{ status: DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS }]],
      };

      const isProcessing = isDataRequestProcessing(input);
      expect(isProcessing).toBe(true);
    });

    it('should return false if not connected to data request and status is processing', () => {
      const input = {
        dataRequestStatus: [[{ status: DATA_REQUEST_STATUS.EXTRACTION_IN_PROGRESS }]],
      };

      const isProcessing = isDataRequestProcessing(input);
      expect(isProcessing).toBe(false);
    });

    it('should return false if connected to data request and status is not processing', () => {
      const dataRequestId = '1234';

      const input = {
        dataRequestInfo: [{ dataRequestId }],
        dataRequestStatus: [[{ status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE, bundles: [{ allConsolidated: true }] }]],
      };

      const isProcessing = isDataRequestProcessing(input);
      expect(isProcessing).toBe(false);
    });

    it('should return false if not connected to data request and status is not processing', () => {
      const input = {
        dataRequestStatus: [[{ status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE }]],
      };

      const isProcessing = isDataRequestProcessing(input);
      expect(isProcessing).toBe(false);
    });
  });

  describe('getDataRequestIsAllConsolidated function', () => {
    it('should return true if allConsolidated is true', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              bundles: [{ allConsolidated: true }],
            },
          ],
        ],
      };

      const allConsolidated = getDataRequestIsAllConsolidated(input);
      expect(allConsolidated).toBe(true);
    });

    it('should return true even allConsolidated is false for one of the bundles', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              bundles: [{ allConsolidated: true }, { allConsolidated: false }],
            },
          ],
        ],
      };

      const allConsolidated = getDataRequestIsAllConsolidated(input);
      expect(allConsolidated).toBe(true);
    });

    it('should return false if allConsolidated is false', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: false }],
            },
          ],
        ],
      };

      const allConsolidated = getDataRequestIsAllConsolidated(input);
      expect(allConsolidated).toBe(false);
    });

    it('should return false if allConsolidated is not defined', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ foo: false }],
            },
          ],
        ],
      };

      const allConsolidated = getDataRequestIsAllConsolidated(input);
      expect(allConsolidated).toBe(false);
    });

    it('should return false if dataRequestStatus is not defined', () => {
      const input = {
        foo: [
          [
            {
              status: null,
              bundles: [{ allConsolidated: true }],
            },
          ],
        ],
      };

      const allConsolidated = getDataRequestIsAllConsolidated(input);
      expect(allConsolidated).toBe(true);
    });
  });

  describe('dataRequestHasTransformationId function', () => {
    it('should return true if bundleTransformationId is defined', () => {
      const input = {
        dataRequestInfo: [
          {
            bundleTransformationId: '1234',
          },
        ],
      };

      const isCloned = dataRequestHasTransformationId(input);
      expect(isCloned).toBe(true);
    });

    it('should return true if any bundleTransformationId is defined', () => {
      const input = {
        dataRequestInfo: [
          {
            bundleTransformationId: '1234',
          },
          {
            foo: '1234',
          },
        ],
      };

      const isCloned = dataRequestHasTransformationId(input);
      expect(isCloned).toBe(true);
    });

    it('should return false if bundleTransformationId is not defined', () => {
      const input = {
        dataRequestInfo: [
          {
            foo: '1234',
          },
        ],
      };

      const isCloned = dataRequestHasTransformationId(input);
      expect(isCloned).toBe(false);
    });

    it('should return false if dataRequestInfo is not defined', () => {
      const input = {
        foo: [
          {
            bundleTransformationId: '1234',
          },
        ],
      };

      const isCloned = dataRequestHasTransformationId(input);
      expect(isCloned).toBe(false);
    });
  });

  describe('getDataRequestStatusType function', () => {
    it('should return correct statusType if a status string is passed in', () => {
      const statusType = getDataRequestStatusType(DATA_REQUEST_STATUS.TRANSFER_COMPLETE);
      expect(statusType).toBe(Intent.SUCCESS);
    });
  });

  describe('isAnyDataRequestScheduleDone function', () => {
    it('should return false if input is not connected to a data request', () => {
      const input = {};

      const isDone = isAnyDataRequestScheduleDone(input);
      expect(isDone).toBe(false);
    });

    it('should return false if input is connected to a data request but is not done', () => {
      const input = {
        dataRequestInfo: [{ bundleTransformationId: '1234' }],
      };

      const isDone = isAnyDataRequestScheduleDone(input);
      expect(isDone).toBe(false);
    });

    it('should return true if input is connected to a data request that is TRANSFER_COMPLETE', () => {
      const input = {
        dataRequestInfo: [{ bundleTransformationId: '1234' }],
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.TRANSFER_COMPLETE,
              bundles: [{ allConsolidated: true }],
            },
          ],
        ],
      };

      const isDone = isAnyDataRequestScheduleDone(input);
      expect(isDone).toBe(true);
    });

    it('should return true if input is connected to a data request is IS_DONE', () => {
      const input = {
        dataRequestInfo: [{ bundleTransformationId: '1234' }],
        dataRequestStatus: [
          [
            {
              status: DATA_REQUEST_STATUS.IS_DONE,
              bundles: [{ allConsolidated: true }],
            },
          ],
        ],
      };

      const isDone = isAnyDataRequestScheduleDone(input);
      expect(isDone).toBe(true);
    });
  });

  describe('getConsolidatedSchedulesCount function', () => {
    it('should return the number of bundles where allConsolidated is true', () => {
      const input = {
        dataRequestStatus: [
          [
            {
              bundles: [{ allConsolidated: true }],
            },
            {
              bundles: [{ allConsolidated: true }],
            },
            {
              bundles: [{ allConsolidated: false }],
            },
          ],
        ],
      };

      const count = getConsolidatedSchedulesCount(input);
      expect(count).toBe(2);
    });
  });

  describe('isDataRequestNotSubmitted function', () => {
    it('should return true if statuses is null', () => {
      const statuses = null;

      const isNotSubmitted = isDataRequestNotSubmitted(statuses);
      expect(isNotSubmitted).toBe(true);
    });

    it('should return true if statuses is undefined', () => {
      const statuses = undefined;

      const isNotSubmitted = isDataRequestNotSubmitted(statuses);
      expect(isNotSubmitted).toBe(true);
    });

    it('should return true if statuses is an empty object', () => {
      const statuses = {};

      const isNotSubmitted = isDataRequestNotSubmitted(statuses);
      expect(isNotSubmitted).toBe(true);
    });

    it('should return false if statuses is not an empty object', () => {
      const statuses = { foo: 'bar' };

      const isNotSubmitted = isDataRequestNotSubmitted(statuses);
      expect(isNotSubmitted).toBe(false);
    });
  });
});
