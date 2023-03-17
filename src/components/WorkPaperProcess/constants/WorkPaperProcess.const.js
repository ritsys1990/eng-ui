export const WP_PROCESS_STEP_1 = {
  TITLE_RADIO_DEFAULT_VALUE: 1,
  TITLE_RADIO_SIZE: 28,
  TITLE_RADIO_INNER_SIZE: 60,
};

export const WP_PROCESS_INPUT_STATUS = {
  DONE: 'done',
  VALIDATING: 'validating',
  APPENDING: 'appending',
  MAPPING: 'mapping',
  UPLOADING: 'uploading',
  DATA_CLEARED: 'Data cleared',
  UPLOADING_ZIP: 'uploading_zip',
  INPUT_TRIFACTA_CONNECTION_FAILED: 'input_trifacta_connection_failed',
  DMV_ZIP: 'zip-dmv',
  PENDING: 'pending',
};

export const TRIFACTA_WP_PROCESS_INPUT_STATUS = {
  TRIFACTA_STATUS: 'input_trifacta_connection_failed',
};

export const WP_PROCESS_INPUT_ERRORS = {
  DEFAULT: 'internal',
  AUTOMAP_FAILED: 'automap_failed',
  DMV_WARNING: 'dmv_warning',
  DMV_ERROR: 'dmv_error',
  DMV_MAPPING_ERROR: 'dmv-mapping-error',
  ZIP_FAILED: 'zipfailed',
};

export const WP_PROCESS_INPUT_PROCESSING_STATUSES = [
  WP_PROCESS_INPUT_STATUS.VALIDATING,
  WP_PROCESS_INPUT_STATUS.APPENDING,
  WP_PROCESS_INPUT_STATUS.MAPPING,
  WP_PROCESS_INPUT_STATUS.UPLOADING,
  WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP,
  WP_PROCESS_INPUT_STATUS.DMV_ZIP,
];

export const WP_STATUS = {
  NOT_STARTED: 'Not Started',
};

export const INPUT_OPTIONS = {
  MARK_AS_REQUIRED: 'mark_as_required',
  MARK_AS_OPTIONAL: 'mark_as_optional',
  DELETE_INPUT: 'delete_input',
  RETAIN_INPUT: 'retain_input',
  UNMARK_RETAIN_INPUT: 'unmark_retain_input',
  CONNECT_TO_BUNDLE: 'connect_to_bundle',
  EDIT_CONNECT_TO_BUNDLE: 'edit_connect_to_bundle',
  REPLACE_DATAMODEL: 'replace_datamodel',
};

export const ProgressBarTypes = {
  NOT_STARTED: 'Not Started',
  FINISHED: 'finished',
  RUNNING: 'running',
  ERROR: 'error',
  WAITING: 'waiting',
  DEFAULT: 'default',
  SUCCESS: 'success',
  PARTIALLY_COMPLETE: 'partiallyComplete',
};

export const COMPONENT_NAME = 'WorkpaperProcess';

export const CONTENT_LIBRARY_WP = {
  CLIENT_ID: '0000-client',
  ENGAGEMENT_ID: '0000-engagement',
};

export const FLOW_IMPORT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ERROR: 'error',
};

export const WP_STATE_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  READY_FOR_REVIEW: 'ReadyForReview',
  DEACTIVATE: 'Deactivated',
};

export const WP_REVIEW_STATUS = {
  COMPLETED: 'Completed',
  SUBMITTED_FOR_REVIEW: 'SubmittedForReview',
};

export const WP_INPUT_CENTRALIZED_DATA_STATUS = {
  INPROGRESS: 'inprogress',
  ERROR: 'error',
  SUCCESS: 'success',
};

export const WP_CENTRALISEDDATASET_EVENTS = {
  MARKEDCENTRALIZEDDATASET: 'MarkedCentralizedDataset',
  UNMARKEDCENTRALIZEDDATASET: 'UnmarkedCentralizedDataset',
  DELETEDCENTRALIZEDDATASET: 'DeletedCentralizedDataset',
  UPDATEDCENTRALIZEDDATASET: 'UpdatedCentralizedDataset',
};

export const FILE_UPLOAD_TYPE = {
  NEW_INPUT: 'New Input',
  ATTACH_FILE: 'Attach New File',
  ZIP_APPEND: 'Append Zip File',
  ZIP_OVERWRITE: 'Overwrite Zip File',
};

export const GenWBPollingOpts = Object.freeze({
  POLL_DELAY: 10000,
  MAX_FETCH_RETRY: 6,
});

export const JOB_ORCHESTRATOR_JOBTYPE = {
  DATA_WRANGLER: 'DataWrangler',
  DATA_MODEL: 'DataModel',
  ZIP_UPLOAD: 'ZipUpload',
  DNAV: 'Dnav',
};

export const JE_GOLDEN_CHECK = {
  WORKPAPER_NAME: 'Journal Entry Reconciliation',
  RECON_REPORT_FILE_NAME: '{clientName} - {fiscalYear} - JE Testing Deliverable',
  FISCAL_YEAR_STR: 'Fiscal Year (yyyy)',
};
