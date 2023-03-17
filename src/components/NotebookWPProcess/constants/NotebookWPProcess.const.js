export const FILE_UPLOAD_TYPE = {
  ATTACH_FILE: 'Attach New File',
};

export const FILE_EXTENSIONS = {
  CSV: 'csv',
};

export const FILE_TYPE = {
  CSV: 0,
};

export const NOTEBOOK_WP_INPUT_STATUS = {
  MAPPING: 'mapping',
  DONE: 'done',
  VALIDATING: 'validating',
  APPENDING: 'appending',
  UPLOADING: 'uploading',
  PENDING: 'pending',
};

export const COMPONENT_NAME = 'NotebookWorkpaperProcess';

export const NOTEBOOK_WP_INPUT_PROCESSING_STATUSES = [
  NOTEBOOK_WP_INPUT_STATUS.VALIDATING,
  NOTEBOOK_WP_INPUT_STATUS.APPENDING,
  NOTEBOOK_WP_INPUT_STATUS.MAPPING,
  NOTEBOOK_WP_INPUT_STATUS.UPLOADING,
];

export const NOTEBOOK_WP_STATUS = {
  NOT_STARTED: 'Not Started',
};

export const NOTEBOOK_WP_REVIEW_STATUS = {
  COMPLETED: 'Completed',
  SUBMITTED_FOR_REVIEW: 'SubmittedForReview',
};
