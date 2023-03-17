export const COMPONENT_NAME = 'ENG_PIPELINES';

export const PIPELINE_TYPE = {
  TRIFACTA: 'Trifacta',
  CORTEX: 'Cortex',
};

export const PIPELINE_DETAILS = {
  NAME: 'pipelineName',
  DESCRIPTION: 'pipelineDescription',
  SOURCE: 'pipelineSource',
  ID: 'id',
};

export const PIPELINE_INITIAL_STATE = {
  [PIPELINE_DETAILS.ID]: '',
  [PIPELINE_DETAILS.NAME]: '',
  [PIPELINE_DETAILS.DESCRIPTION]: '',
  [PIPELINE_DETAILS.SOURCE]: PIPELINE_TYPE.TRIFACTA,
};

export const PIPELINE_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...PIPELINE_INITIAL_STATE,
  },
};

export const CONTEXT_MENU_OPTIONS = Object.freeze({
  EDIT: 'edit',
  DELETE: 'delete',
  OPEN: 'open',
});

export const STATUS = Object.freeze({
  EDIT: 'Draft',
  SUBMIT_REVIEW: 'ReadyForReview',
  BACK_TO_DRAFT: 'Draft',
  PUBLISHED: 'Published',
});

export const CLONING_STATUS = {
  INPROGRESS: 'Inprogress',
  FAILED: 'Failed',
  SUCCESS: 'Success',
  NONE: 'None',
};
