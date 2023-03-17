export const WB_PROCESS_TYPE = Object.freeze({
  UPLOADING: 'uploading',
  VALIDATING: 'validating',
  PUBLISHING: 'publishing',
  SAVING: 'saving',
  DONE: 'done',
  ERROR: 'error',
  TABLEMISMATCH: 'tableMismatch',
});

export const GenWBStatus = Object.freeze({
  Pending: 'pending',
  Progress: 'progress',
  Error: 'error',
  Done: 'done',
});

export const GenWBStep = Object.freeze({
  Queueing: 'queueing',
  Queued: 'queued',
  SavingToSQL: 'savingToSQL',
  Cloning: 'cloning',
});
