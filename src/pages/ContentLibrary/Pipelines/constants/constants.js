export const COMPONENT_NAME = 'CL_PIPELINES';

export const PIPELINE_TYPE = {
  TRIFACTA: 'Trifacta',
  CORTEX: 'Cortex',
};

export const PIPELINE_DETAILS = {
  NAME: 'pipelineName',
  DESCRIPTION: 'pipelineDescription',
  SOURCE: 'pipelineSource',
  ID: 'id',
  VERSION: 'versionNumber',
  ADDITIONAL_COMMENT: 'AdditionalComment',
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

export const PIPELINE_DETAILS_REVIEW = {
  NAME: 'Name',
  ENGAGEMENT_ID: 'EngagementId',
  ID: 'Id',
  ADDITIONAL_COMMENT: 'AdditionalComment',
  CLIENTS: 'ClientIds',
};

export const PIPELINE_REVIEW_INITIAL_STATE = {
  [PIPELINE_DETAILS_REVIEW.ID]: '',
  [PIPELINE_DETAILS_REVIEW.NAME]: '',
  [PIPELINE_DETAILS_REVIEW.ENGAGEMENT_ID]: '0000-engagement',
  [PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT]: '',
  [PIPELINE_DETAILS_REVIEW.CLIENTS]: [],
};

export const PIPELINE_REVIEW_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...PIPELINE_REVIEW_INITIAL_STATE,
  },
};

export const PIPELINE_DETAILS_REJECT = {
  ENGAGEMENT_ID: 'EngagementId',
  ID: 'Id',
  REASON: 'Reason',
};

export const PIPELINE_REJECT_INITIAL_STATE = {
  [PIPELINE_DETAILS_REJECT.ID]: '',
  [PIPELINE_DETAILS_REJECT.ENGAGEMENT_ID]: '0000-engagement',
  [PIPELINE_DETAILS_REJECT.REASON]: '',
};

export const PIPELINE_REJECT_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...PIPELINE_REVIEW_INITIAL_STATE,
  },
};

export const CONTEXT_MENU_OPTIONS = Object.freeze({
  EDIT: 'edit',
  SUBMIT_REVIEW: 'submit-review',
  BACK_TO_DRAFT: 'back-to-draft',
  DELETE: 'delete',
  REJECT: 'reject',
  APPROVE: 'approve',
  DEACTIVATE: 'deactivate',
});

export const STATUS = Object.freeze({
  EDIT: 'Draft',
  SUBMIT_REVIEW: 'ReadyForReview',
  BACK_TO_DRAFT: 'Draft',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
});

export const WP_STATUS = Object.freeze({
  DEACTIVATED: 'Deactivated',
});
