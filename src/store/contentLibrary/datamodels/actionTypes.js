export const CLDataModelsActionTypes = {
  FETCH_DATAMODELS_REQUEST: 'CLDataModels.FETCH_DATAMODELS_REQUEST',
  FETCH_DATAMODELS_SUCCESS: 'CLDataModels.FETCH_DATAMODELS_SUCCESS',
  FETCH_DATAMODELS_ERROR: 'CLDataModels.FETCH_DATAMODELS_ERROR',
  FETCH_PUBLISHED_DATAMODELS_REQUEST: 'CLDataModels.FETCH_PUBLISHED_DATAMODELS_REQUEST',
  FETCH_PUBLISHED_DATAMODELS_SUCCESS: 'CLDataModels.FETCH_PUBLISHED_DATAMODELS_SUCCESS',
  FETCH_PUBLISHED_DATAMODELS_ERROR: 'CLDataModels.FETCH_PUBLISHED_DATAMODELS_ERROR',
  GET_DATAMODEL_DATA: 'CLDataModels.GET_DATAMODEL_DATA',
  GET_DATAMODEL_DATA_SUCCESS: 'CLDataModels.GET_DATAMODEL_DATA_SUCCESS',
  GET_DATAMODEL_DATA_ERROR: 'CLDataModels.GET_DATAMODEL_DATA_ERROR',
  DELETE_DATAMODEL_FIELD: 'CLDataModels.DELETE_DATAMODEL_FIELD',
  DELETE_DATAMODEL_FIELD_SUCCESS: 'CLDataModels.DELETE_DATAMODEL_FIELD_SUCCESS',
  DELETE_DATAMODEL_FIELD_ERROR: 'CLDataModels.DELETE_DATAMODEL_FIELD_ERROR',
  GET_DM_FILED_TYPES: 'CLDataModels.GET_DM_FILED_TYPES',
  GET_DM_FILED_TYPES_SUCCESS: 'CLDataModels.GET_DM_FILED_TYPES_SUCCESS',
  GET_DM_FIELD_TYPES_ERROR: 'CLDataModels.GET_DM_FIELD_TYPES_ERROR',
  UPDATE_DM_FIELD: 'CLDataModels.UPDATE_DM_FIELD',
  UPDATE_DM_FIELD_SUCCESS: 'CLDataModels.UPDATE_DM_FIELD_SUCCESS',
  UPDATE_DM_FIELD_ERROR: 'CLDataModels.UPDATE_DM_FIELD_ERROR',
  UPDATE_DATAMODEL_REQUEST: 'CLDataModels.UPDATE_DATAMODEL_REQUEST',
  UPDATE_DATAMODEL_SUCCESS: 'CLDataModels.UPDATE_DATAMODEL_SUCCESS',
  UPDATE_DATAMODEL_ERROR: 'CLDataModels.UPDATE_DATAMODEL_ERROR',
  SWITCH_DM_TO_DRAFT: 'CLDataModels.SWITCH_DM_TO_DRAFT',
  SWITCH_DM_TO_DRAFT_SUCCESS: 'CLDataModels.SWITCH_DM_TO_DRAFT_SUCCESS',
  SWITCH_DM_TO_DRAFT_ERROR: 'CLDataModels.SWITCH_DM_TO_DRAFT_ERROR',
  POST_ADD_GUIDANCE: 'CLDataModelsActionTypes.POST_ADD_GUIDANCE',
  POST_ADD_GUIDANCE_SUCCESS: 'CLDataModelsActionTypes.POST_ADD_GUIDANCE_SUCCESS',
  POST_ADD_GUIDANCE_ERROR: 'CLDataModelsActionTypes.POST_ADD_GUIDANCE_ERROR',
  SUBMIT_DM_FOR_REVIEW: 'CLDataModels.SUBMIT_DM_FOR_REVIEW',
  SUBMIT_DM_FOR_REVIEW_SUCCESS: 'CLDataModels.SUBMIT_DM_FOR_REVIEW_SUCCESS',
  SUBMIT_DM_FOR_REVIEW_ERROR: 'CLDataModels.SUBMIT_DM_FOR_REVIEW_ERROR',
  DELETE_DATAMODEL_REQUEST: 'CLDataModels.DELETE_DATAMODEL_REQUEST',
  DELETE_DATAMODEL_SUCCESS: 'CLDataModels.DELETE_DATAMODEL_SUCCESS',
  DELETE_DATAMODEL_ERROR: 'CLDataModels.DELETE_DATAMODEL_ERROR',
  VALIDATE_DATAMODEL_REDIRECTION: 'CLDataModels.VALIDATE_DATAMODEL_REDIRECTION',
  VALIDATE_DATAMODEL_REDIRECTION_SUCCESS: 'CLDataModels.VALIDATE_DATAMODEL_REDIRECTION_SUCCESS',
  VALIDATE_DATAMODEL_REDIRECTION_ERROR: 'CLDataModels.VALIDATE_DATAMODEL_REDIRECTION_ERROR',
  EXPORT_DATAMODEL: 'CLDataModelsActionTypes.EXPORT_DATAMODEL',
  EXPORT_DATAMODEL_SUCCESS: 'CLDataModelsActionTypes.EXPORT_DATAMODEL_SUCCESS',
  EXPORT_DATAMODEL_ERROR: 'CLDataModelsActionTypes.EXPORT_DATAMODEL_ERROR',
  UPLOAD_DATAMODELS: 'CLDataModelsActionTypes.UPLOAD_DATAMODELS',
  UPLOAD_DATAMODELS_SUCCESS: 'CLDataModelsActionTypes.UPLOAD_DATAMODELS_SUCCESS',
  UPLOAD_DATAMODEL_ERROR: 'CLDataModelsActionTypes.UPLOAD_DATAMODEL_ERROR,',
  UPLOAD_DATAMODEL_EXPAMPLE: 'CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE',
  UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS: 'CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS',
  UPLOAD_DATAMODEL_EXPAMPLE_ERROR: 'CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_ERROR,',
  CREATE_NEW_DMT: 'CLDataModels.CREATE_NEW_DMT',
  CREATE_NEW_DMT_SUCCESS: 'CLDataModels.CREATE_NEW_DMT_SUCCESS',
  CREATE_NEW_DMT_ERROR: 'CLDataModels.CREATE_NEW_DMT_ERROR',
  GET_DMTS_FROM_DM: 'CLDataModels.GET_DMTS_FROM_DM',
  GET_DMTS_FROM_DM_SUCCESS: 'CLDataModels.GET_DMTS_FROM_DM_SUCCESS',
  GET_DMTS_FROM_DM_ERROR: 'CLDataModels.GET_DMTS_FROM_DM_ERROR',
  VALIDATE_DMT: 'CLDataModels.VALIDATE_DMT',
  VALIDATE_DMT_SUCCESS: 'CLDataModels.VALIDATE_DMT_SUCCESS',
  VALIDATE_DMT_ERROR: 'CLDataModels.VALIDATE_DMT_ERROR',
  GET_DATAMODEL_MAPPING: 'CLDataModelsActionTypes.GET_DATAMODEL_MAPPING',
  GET_DATAMODEL_MAPPING_SUCCESS: 'CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_SUCCESS',
  GET_DATAMODEL_MAPPING_ERROR: 'CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_ERROR',
  GET_ALL_ENVIRONMENTS: 'CLDataModels.GET_ALL_ENVIRONMENTS',
  GET_ALL_ENVIRONMENTS_SUCCESS: 'CLDataModels.GET_ALL_ENVIRONMENTS_SUCCESS',
  GET_ALL_ENVIRONMENTS_ERROR: 'CLDataModels.GET_ALL_ENVIRONMENTS_ERROR',
  GET_DATAMODELS_IN_ENV: 'CLDataModels.GET_DATAMODELS_IN_ENV',
  GET_DATAMODELS_IN_ENV_SUCCESS: 'CLDataModels.GET_DATAMODELS_IN_ENV_SUCCESS',
  GET_DATAMODELS_IN_ENV_ERROR: 'CLDataModels.GET_DATAMODELS_IN_ENV_ERROR',
  INGEST_DATAMODEL_START: 'CLDataModels.INGEST_DATAMODEL_START',
  INGEST_DATAMODEL_SUCCESS: 'CLDataModels.INGEST_DATAMODEL_SUCCESS',
  INGEST_DATAMODEL_ERROR: 'CLDataModels.INGEST_DATAMODEL_ERROR',
  CLEAR_MODAL_CONTENT: 'CLDataModels.CLEAR_MODAL_CONTENT',
  GET_DMT_FROM_ENVIRONMENT: 'CLDataModels.GET_DMT_FROM_ENVIRONMENT',
  GET_DMT_FROM_ENVIRONMENT_SUCCESS: 'CLDataModels.GET_DMT_FROM_ENVIRONMENT_SUCCESS',
  GET_DMT_FROM_ENVIRONMENT_ERROR: 'CLDataModels.GET_DMT_FROM_ENVIRONMENT_ERROR',
  INGEST_DMT: 'CLDataModels.INGEST_DMT',
  INGEST_DMT_SUCCESS: 'CLDataModels.INGEST_DMT_SUCCESS',
  INGEST_DMT_ERROR: 'CLDataModels.INGEST_DMT_ERROR',
  GET_DMTS_OF_DM_INGEST: 'CLDataModels.GET_DMTS_OF_DM_INGEST',
  GET_DMTS_OF_DM_INGEST_SUCCESS: 'CLDataModels.GET_DMTS_OF_DM_INGEST_SUCCESS',
  GET_DMTS_OF_DM_INGEST_ERROR: 'CLDataModels.GET_DMTS_OF_DM_INGEST_ERROR',
  INGEST_DMT_QUEUE: 'CLDataModels.INGEST_DMT_QUEUE',
  INGEST_DMT_QUEUE_SUCCESS: 'CLDataModels.INGEST_DMT_QUEUE_SUCCESS',
  INGEST_DMT_QUEUE_ERROR: 'CLDataModels.INGEST_DMT_QUEUE_ERROR',
  GET_DMTS_INGESTION_STATUS: 'CLDataModels.GET_DMTS_INGESTION_STATUS',
  GET_DMTS_INGESTION_STATUS_SUCCESS: 'CLDataModels.GET_DMTS_INGESTION_STATUS_SUCCESS',
  GET_DMTS_INGESTION_STATUS_ERROR: 'CLDataModels.GET_DMTS_INGESTION_STATUS_ERROR',
  VALIDATE_DMT_NAME: 'workpapers.VALIDATE_DMT_NAME',
  VALIDATE_DMT_NAME_SUCCESS: 'workpapers.VALIDATE_DMT_NAME_SUCCESS',
  VALIDATE_DMT_NAME_ERROR: 'workpapers.VALIDATE_DMT_NAME_ERROR',
  CLEAR_DMTS_OF_DM: 'CLDataModels.CLEAR_DMTS_OF_DM',
  HANDLE_REFRESH_ICON: 'CLDataModels.HANDLE_REFRESH_ICON',
  GET_DATAMODEL_HISTORY: 'CLDataModels.GET_DATAMODEL_HISTORY',
  GET_DATAMODEL_HISTORY_SUCCESS: 'CLDataModels.GET_DATAMODEL_HISTORY_SUCCESS',
  GET_DATAMODEL_HISTORY_ERROR_RESET: 'CLDataModels.GET_DATAMODEL_HISTORY_ERROR_RESET',
};
