export const COMPONENT_NAME = 'CL_DATAMODELS';

export const DATAMODEL_TABS = {
  DATAMODELS: 'datamodels',
  DATAMODEL_TRANSFORMATIONS: 'datamodel-transformations',
  COMMON_DATAMODELS: 'common-datamodels',
};

export const DATAMODEL_TRANSFORMATION_TABS = {
  DATAMODELS: 'datamodels',
  STANDARD_BUNDLES: 'standard-bundles',
};

export const ContextMenuOptions = Object.freeze({
  EDIT: 'edit',
  UPLOAD_EXAMPLE_CSV: 'upload',
  ADD_GUIDANCE: 'guidance',
  SUBMIT_REVIEW: 'submit-review',
  DELETE: 'delete',
  EXPORT: 'export',
});

export const dmFieldDetailsTopHeaderCheckBox = {
  KEY: 'isKey',
  MANDATORY: 'isMandatory',
  RECONCILIATION: 'requiredforReconciliation',
};

export const dmFieldDetailsTopHeader = {
  NAME_TECH: 'nameTech',
  NAME_NONTECH: 'nameNonTech',
  TYPE: 'type',
  DESCRIPTION: 'description',
  ALIASES: 'aliases',
};

export const dmFieldDetailsInnerHeaderCheckBox = {
  TIME_FILTER: 'isTimeFilter',
  ENTITY_FILTER: 'isEntityFilter',
};
export const dmFieldDetailsInnerHeader = {
  ANALYTICS_SUPPORT: 'analyticsSupported',
  MODEL_TAGS: 'modelTags',
  RELEASE: 'release',
  SOURCE_OF_TERM: 'sourceOfTerm',
  BUSINESS_RULES: 'businessRules',
  TRANSFORMATON_RULES: 'transformationRules',
};

export const aliasesUtilities = {
  CONFLICTED_ALIASES: 'conflictedAliases',
  TEXT_ALIASES: 'textAliases',
  CONFLICTING_NAME_TECH: 'isNameTechConflicting',
  ALIAS_FREE_TEXT_ERROR: 'aliasFreeTextError',
  ALIAS_CONFLICTED_TEXT_ERROR: 'aliasConflictedTextError',
};

export const dmFieldDetails = {
  ...dmFieldDetailsTopHeader,
  ...dmFieldDetailsTopHeaderCheckBox,
  ...dmFieldDetailsInnerHeader,
  ...dmFieldDetailsInnerHeaderCheckBox,
};

// oder of the elements needs to be persisted
export const dmFieldCheckboxDisable = ['TIME_FILTER', 'ENTITY_FILTER'];

export const dmFieldTopCheckboxName = ['KEY', 'MANDATORY', 'RECONCILIATION'];

export const DM_FIELD_INITIAL_STATE = {
  [dmFieldDetails.NAME_TECH]: '',
  [dmFieldDetails.NAME_NONTECH]: '',
  [dmFieldDetails.DESCRIPTION]: '',
  [dmFieldDetails.TYPE]: '',
  [dmFieldDetails.MODEL_TAGS]: '',
  [dmFieldDetails.RELEASE]: '',
  [dmFieldDetails.ANALYTICS_SUPPORT]: '',
  [dmFieldDetails.SOURCE_OF_TERM]: '',
  [dmFieldDetails.ALIASES]: [],
  [aliasesUtilities.CONFLICTED_ALIASES]: [],
  [aliasesUtilities.TEXT_ALIASES]: '',
  [aliasesUtilities.ALIAS_FREE_TEXT_ERROR]: '',
  [aliasesUtilities.ALIAS_CONFLICTED_TEXT_ERROR]: '',
  [dmFieldDetails.BUSINESS_RULES]: '',
  [dmFieldDetails.TRANSFORMATON_RULES]: '',
  [dmFieldDetails.RECONCILIATION]: false,
  [dmFieldDetails.KEY]: false,
  [dmFieldDetails.MANDATORY]: false,
  [dmFieldDetails.TIME_FILTER]: false,
  [dmFieldDetails.ENTITY_FILTER]: false,
};

export const DM_FIELD_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...DM_FIELD_INITIAL_STATE,
  },
};
export const STANDARD_BUNDLES_CONTEXT_MENU = [
  { id: 'Standard_Bundle_Transformation', text: 'Ingest Bundle Transformation' },
];

export const NEW_DM_TYPES = {
  CREATE: 'create',
  UPLOAD: 'upload',
  INGEST: 'ingest',
};

export const NEW_DM_PAGES = {
  [NEW_DM_TYPES.CREATE]: 1,
  [NEW_DM_TYPES.UPLOAD]: 2,
  [NEW_DM_TYPES.INGEST]: 3,
};

export const dataModelDetails = {
  NAME_TECH: 'nameTech',
  NAME_NONTECH: 'nameNonTech',
  DESCRIPTION: 'description',
  TABLE_ALIAS: 'tableAlias',
  TEXT_ALIASES: 'textAliases',
  ALIAS_FREE_TEXT_ERROR: 'aliasFreeTextError',
  TAG_IDS: 'tagIds',
  FROM_ENVIRONMENT: 'fromEnvironment',
  DM_NAME: 'dmName',
  CDM_ID: 'cdmId',
  CLASSIFICATION: 'classification',
};

export const cdmDetails = {
  NAME: 'name',
  DESCRIPTION: 'description',
};

export const DM_FIELD_CLASSIFICATION_VALUES = ['pointInTime', 'transactional'];

export const DM_INITIAL_STATE = {
  [dataModelDetails.NAME_TECH]: '',
  [dataModelDetails.NAME_NONTECH]: '',
  [dataModelDetails.DESCRIPTION]: '',
  [dataModelDetails.TABLE_ALIAS]: [],
  [dataModelDetails.TEXT_ALIASES]: '',
  [aliasesUtilities.ALIAS_FREE_TEXT_ERROR]: '',
  [dataModelDetails.TAG_IDS]: [],
  [dataModelDetails.CDM_ID]: [],
  [dataModelDetails.CLASSIFICATION]: '',
};

export const CDM_INITIAL_STATE = {
  [cdmDetails.NAME]: '',
  [cdmDetails.DESCRIPTION]: '',
};

export const CDM_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...DM_INITIAL_STATE,
  },
};

export const DM_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...DM_INITIAL_STATE,
  },
};

export const QUILL_EDITOR_FORMATS = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'script',
  'list',
  'bullet',
  'align',
  'color',
  'background',
  'link',
  'clean',
  'indent',
  'header',
];

export const QUILL_EDITOR_MODULES = {
  toolbar: [
    [{ header: '1' }],
    [{ header: '2' }],
    ['bold'],
    ['italic'],
    ['underline'],
    ['strike'],
    [{ script: 'sub' }],
    [{ script: 'super' }],
    [{ color: [] }],
    [{ background: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ font: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }],
    [{ list: 'bullet' }],
    [{ indent: '-1' }],
    [{ indent: '+1' }],
    ['link'],
    ['clean'],
  ],
};

export const EDITOR_TABS = {
  GENERAL_INSTRUCTION: 'general_instruction',
  DATASET_DESCRIPTION: 'dataset_description',
  COLUMN_DESCRIPTION: 'column_description',
};

export const DATA_MODEL_STATES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
};

export const MAPPING_MODAL_TYPE = {
  DMT_MAPPING: 'dmtMapping',
  DM_MAPPING: 'dmMapping',
};

export const INGEST_DM_RENAME = {
  IS_SAME_NAME: 'isSameName',
  NEW_NAME: 'newName',
};

export const DMT_SOURCE = {
  TRIFACTA: 'Trifacta',
  CORTEX: 'Cortex',
};

export const DM_VERSION_HISTORY_STATUS = {
  REJECTED: 'Rejected',
};

export const TABS_ROUTES = {
  DEFAULT: `/library/datamodels`,
  DATAMODELS: `/library/datamodels/`,
  COMMON_DATAMODELS: `/library/datamodels/common-datamodels/`,
  STANDARD_BUNDLES: `/library/datamodels/standard-bundles`,
  PUBLISHED_DATAMODELS: `/library/datamodels/published-datamodels`,
};

export const TRIFACTA_TRANSFORMATION_STATUS = {
  INPROGRESS: 'Inprogress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const BUNDLE_TRANSFORMATION_INGESTION_STATUS = {
  INPROGRESS: 'InProgress',
  QUEUED: 'Queued',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  INGESTINPROGRESS: 'IngestInProgress',
};

export const ADD_NEW_DMT = 'Add_New_DMT';

export const TEXT_EXAMPLE_OPTION = {
  UPLOAD: 'Upload',
  REPLACE: 'Replace',
};
export const INGEST_DMT = 'INGEST_DMT';

export const INGEST_TYPES = {
  DMT: 'DMT_INGEST',
  BUNDLE_TRANSFORMATION: 'BUNDLE_TRANSFORMATION_INGEST',
};

export const INGEST_STATUS = {
  SUCCESS: 'success',
  QUEUED: 'queued',
  VALIDATION_INPROGRESS: 'validationinprogress',
  INGESTION_INPROGRESS: 'ingestioninprogress',
  VALIDATION_FAILED: 'validationfailed',
  INGESTION_FAILED: 'ingestionfailed',
  FAILED: 'failed',
};

export const DIC_STATUS = {
  NOT_STARTED: 'NotStarted',
  COMPLETE: 'Complete',
  OUTDATED: 'Outdated',
  IN_PROGRESS: 'InProgress',
};

export const DIC_COLORS = {
  GREEN: '#25673C',
  BLACK: '#000000DB',
  BLUE: '#2375A4',
  RED: '#CF3D28',
};
export const SHOW_DIC_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
  OUTDATED: 'Outdated',
};

export const RELEASE_TYPE_FIELD_VALUES = ['Major', 'Minor'];
