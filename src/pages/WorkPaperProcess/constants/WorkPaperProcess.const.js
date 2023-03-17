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
};

export const WP_PROCESS_INPUT_ERRORS = {
  DEFAULT: 'internal',
  AUTOMAP_FAILED: 'automap_failed',
  DMV_WARNING: 'dmv_warning',
  DMV_ERROR: 'dmv_error',
  DMV_MAPPING_ERROR: 'dmv-mapping-error',
};

export const WP_PROCESS_INPUT_PROCESSING_STATUSES = [
  WP_PROCESS_INPUT_STATUS.VALIDATING,
  WP_PROCESS_INPUT_STATUS.APPENDING,
  WP_PROCESS_INPUT_STATUS.MAPPING,
  WP_PROCESS_INPUT_STATUS.UPLOADING,
];

export const WP_STATUS = {
  NOT_STARTED: 'Not Started',
};

export const ProgressBarTypes = {
  NOT_STARTED: 'Not Started',
  FINISHED: 'finished',
  RUNNING: 'running',
  ERROR: 'error',
  WAITING: 'waiting',
  QUEUED: 'queued',
  FAILED_EXECUTION: 'failedExecution',
  CANCELED: 'canceled',
  FAILED_SUBMISSION: 'failedSubmission',
  UNKNOWN: 'unknown',
  RESET: 'reset',
};

export const NOTEBOOK_WP_STATUS = {
  NOT_STARTED: 'notStarted',
};

export const WP_STATE_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  READY_FOR_REVIEW: 'ReadyForReview',
  DEACTIVATE: 'Deactivated',
};

export const COMPONENT_NAME = 'WorkpaperProcess';
