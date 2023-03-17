import { initialState } from '../reducer';
import { CLDataModelsActionTypes } from '../actionTypes';
import { datamodelsMock, fieldTypes, dmtsList, dmtsMock, dmtsIngestionMock } from './datamodels.mock';

const userError = new Error('User Defined ERROR');

export const datamodelsConLibMockReducer = {
  initialState,
  fetchDatamodels: {
    expectedState: initialState.merge({
      isDataModelsFetching: true,
    }),
    action: { type: CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST },
  },
  fetchDatamodelsSuccess: {
    expectedState: initialState.merge({
      isDataModelsFetching: false,
      datamodels: datamodelsMock.datamodels.items,
    }),
    action: { type: CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS, payload: datamodelsMock.datamodels },
  },
  fetchDatamodelsFailure: {
    expectedState: initialState.merge({
      isDataModelsFetching: false,
    }),
    action: { type: CLDataModelsActionTypes.FETCH_DATAMODELS_ERROR },
  },
  fetchPublishedDatamodels: {
    expectedState: initialState.merge({
      isDataModelsFetching: true,
    }),
    action: { type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_REQUEST },
  },
  fetchPublishedDatamodelsSuccess: {
    expectedState: initialState.merge({
      isDataModelsFetching: false,
      publishedDatamodels: datamodelsMock.datamodels.items,
    }),
    action: {
      type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_SUCCESS,
      payload: datamodelsMock.datamodels.items,
    },
  },
  fetchPublishedDatamodelsFailure: {
    expectedState: initialState.merge({
      isDataModelsFetching: false,
    }),
    action: { type: CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_ERROR },
  },
  getDataModelDetails: {
    expectedState: initialState.merge({
      isDMDataLoading: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA },
  },
  getDataModelDetailsSuccess: {
    expectedState: initialState.merge({
      isDMDataLoading: false,
      datamodel: datamodelsMock.datamodels.items[0],
    }),
    action: {
      type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_SUCCESS,
      payload: datamodelsMock.datamodels.items[0],
    },
  },
  getDataModelDetailsFailure: {
    expectedState: initialState.merge({
      isDMDataLoading: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_DATA_ERROR },
  },
  deleteDMField: {
    expectedState: initialState.merge({
      isDMFieldDeleting: true,
    }),
    action: { type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD },
  },
  deleteDMFieldSuccess: {
    expectedState: initialState.merge({
      isDMFieldDeleting: false,
    }),
    action: {
      type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_SUCCESS,
      payload: true,
    },
  },
  deleteDMFieldFailure: {
    expectedState: initialState.merge({
      isDMFieldDeleting: false,
    }),
    action: { type: CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_ERROR },
  },
  getDMFieldTypes: {
    expectedState: initialState.merge({
      isFetchingFieldTypes: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_DM_FILED_TYPES },
  },
  getDMFieldTypesSuccess: {
    expectedState: initialState.merge({
      isFetchingFieldTypes: false,
      fieldTypes,
    }),
    action: {
      type: CLDataModelsActionTypes.GET_DM_FILED_TYPES_SUCCESS,
      payload: fieldTypes,
    },
  },
  getDMFieldTypesFailure: {
    expectedState: initialState.merge({
      isFetchingFieldTypes: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_DM_FIELD_TYPES_ERROR },
  },
  updateDMField: {
    expectedState: initialState.merge({
      isDMFieldUpdating: true,
    }),
    action: { type: CLDataModelsActionTypes.UPDATE_DM_FIELD },
  },
  updateDMFieldSuccess: {
    expectedState: initialState.merge({
      isDMFieldUpdating: false,
    }),
    action: {
      type: CLDataModelsActionTypes.UPDATE_DM_FIELD_SUCCESS,
      payload: true,
    },
  },
  updateDMFieldFailure: {
    expectedState: initialState.merge({
      isDMFieldUpdating: false,
    }),
    action: { type: CLDataModelsActionTypes.UPDATE_DM_FIELD_ERROR },
  },

  uploadDatamodelExample: {
    expectedState: initialState.merge({
      isUploadExample: true,
    }),
    action: { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE },
  },
  uploadDatamodelExampleSuccess: {
    expectedState: initialState.merge({
      isUploadExample: false,
    }),
    action: { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS },
  },
  uploadDatamodelExampleError: {
    expectedState: initialState.merge({
      isUploadExample: false,
      uploadExapmleError: [{ type: 'error', message: `${userError.message}`, key: Date.now() }],
    }),
    action: { type: CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_ERROR, payload: { error: userError.message } },
  },

  exportDatamodel: {
    expectedState: initialState.merge({
      isDataModelsFetching: true,
    }),
    action: { type: CLDataModelsActionTypes.EXPORT_DATAMODEL },
  },
  exportDatamodelSuccess: {
    expectedState: initialState.merge({
      isDataModelsFetching: false,
    }),
    action: { type: CLDataModelsActionTypes.EXPORT_DATAMODEL_SUCCESS },
  },
  exportDatamodelError: {
    expectedState: initialState.merge({
      isDataModelsFetching: false,
    }),
    action: { type: CLDataModelsActionTypes.EXPORT_DATAMODEL_ERROR },
  },
  PostAddGuidance: {
    expectedState: initialState.merge({
      guidanceLoader: true,
    }),
    action: { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE },
  },
  PostAddGuidanceError: {
    expectedState: initialState.merge({
      guidanceLoader: false,
    }),
    action: { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE_ERROR },
  },
  PostAddGuidanceSuccess: {
    expectedState: initialState.merge({
      guidanceLoader: false,
    }),
    action: { type: CLDataModelsActionTypes.POST_ADD_GUIDANCE_SUCCESS },
  },
  updateDataModel: {
    expectedState: initialState.merge({
      isDMUpdating: true,
    }),
    action: { type: CLDataModelsActionTypes.UPDATE_DATAMODEL_REQUEST },
  },
  updateDataModelSuccess: {
    expectedState: initialState.merge({
      isDMUpdating: false,
    }),
    action: {
      type: CLDataModelsActionTypes.UPDATE_DATAMODEL_SUCCESS,
      payload: true,
    },
  },
  updateDataModelFailure: {
    expectedState: initialState.merge({
      isDMUpdating: false,
    }),
    action: { type: CLDataModelsActionTypes.UPDATE_DATAMODEL_ERROR },
  },
  switchDMToDraft: {
    expectedState: initialState.merge({
      isDMStatusUpdating: true,
    }),
    action: { type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT },
  },
  switchDMToDraftSuccess: {
    expectedState: initialState.merge({
      isDMStatusUpdating: false,
    }),
    action: {
      type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_SUCCESS,
      payload: true,
    },
  },
  switchDMToDraftFailure: {
    expectedState: initialState.merge({
      isDMStatusUpdating: false,
    }),
    action: { type: CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_ERROR },
  },
  submitDMForReview: {
    expectedState: initialState.merge({
      isDMStatusUpdating: true,
    }),
    action: { type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW },
  },
  submitDMForReviewSuccess: {
    expectedState: initialState.merge({
      isDMStatusUpdating: false,
    }),
    action: {
      type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_SUCCESS,
      payload: true,
    },
  },
  submitDMForReviewFailure: {
    expectedState: initialState.merge({
      isDMStatusUpdating: false,
    }),
    action: { type: CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_ERROR },
  },
  deleteDatamodel: {
    expectedState: initialState.merge({
      isDMDeleting: true,
    }),
    action: { type: CLDataModelsActionTypes.DELETE_DATAMODEL_REQUEST },
  },
  deleteDatamodelSuccess: {
    expectedState: initialState.merge({
      isDMDeleting: false,
    }),
    action: {
      type: CLDataModelsActionTypes.DELETE_DATAMODEL_SUCCESS,
      payload: true,
    },
  },
  deleteDatamodelFailure: {
    expectedState: initialState.merge({
      isDMDeleting: false,
    }),
    action: { type: CLDataModelsActionTypes.DELETE_DATAMODEL_ERROR },
  },
  redirectDataModelValidations: {
    expectedState: initialState.merge({
      isDMValidating: true,
    }),
    action: { type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION },
  },
  redirectDataModelValidationsSuccess: {
    expectedState: initialState.merge({
      isDMValidating: false,
    }),
    action: {
      type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_SUCCESS,
      payload: true,
    },
  },
  redirectDataModelValidationsFailure: {
    expectedState: initialState.merge({
      isDMValidating: false,
    }),
    action: { type: CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_ERROR },
  },
  getDMTsFromDM: {
    expectedState: initialState.merge({
      isFetchingDMTsFromDM: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM },
  },
  getDMTsFromDMSuccess: {
    expectedState: initialState.merge({
      isFetchingDMTsFromDM: false,
      dmtsList,
    }),
    action: {
      type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_SUCCESS,
      payload: dmtsList,
    },
  },
  getDMTsFromDMError: {
    expectedState: initialState.merge({
      isFetchingDMTsFromDM: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_FROM_DM_ERROR },
  },
  createDMT: {
    expectedState: initialState.merge({
      isCreatingNewDMT: true,
    }),
    action: { type: CLDataModelsActionTypes.CREATE_NEW_DMT },
  },
  createDMTSuccess: {
    expectedState: initialState.merge({
      isCreatingNewDMT: false,
    }),
    action: {
      type: CLDataModelsActionTypes.CREATE_NEW_DMT_SUCCESS,
      payload: true,
    },
  },
  createDMTError: {
    expectedState: initialState.merge({
      isCreatingNewDMT: false,
    }),
    action: { type: CLDataModelsActionTypes.CREATE_NEW_DMT_ERROR },
  },

  getDMMapping: {
    expectedState: initialState.merge({
      isFetchingDMMap: true,
      dmMapping: [],
      dmMappingError: [],
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING },
  },

  getDMMappingSuccess: {
    expectedState: initialState.merge({
      isFetchingDMMap: false,
      dmMapping: [],
    }),
    action: {
      type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_SUCCESS,
      payload: { mappingResult: [], datamodelName: datamodelsMock.datamodels.items[0].nameTech },
    },
  },

  getDMMappingError: {
    expectedState: initialState.merge({
      isFetchingDMMap: false,
      dmMappingError: [{ type: 'error', message: `${userError.message}`, key: Date.now() }],
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_ERROR, payload: userError.message },
  },

  getAllEnvironmentsStart: {
    expectedState: initialState.merge({
      isFetchingEnvironments: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS },
  },

  getAllEnvironmentsSuccess: {
    expectedState: initialState.merge({
      isFetchingEnvironments: false,
      allEnvironments: [{ name: 'qas1' }],
    }),
    action: { type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_SUCCESS, payload: JSON.stringify(['qas1']) },
  },
  getAllEnvironmentsError: {
    expectedState: initialState.merge({
      isFetchingEnvironments: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_ERROR },
  },
  getEnvironmentContentStart: {
    expectedState: initialState.merge({
      isFetchingEnvContent: true,
      dmMapping: [],
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV },
  },

  getEnvironmentContentSuccess: {
    expectedState: initialState.merge({
      isFetchingEnvContent: false,
      environmentContent: [{ name: 'qas1' }],
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_SUCCESS, payload: [{ name: 'qas1' }] },
  },
  getEnvironmentContentError: {
    expectedState: initialState.merge({
      isFetchingEnvContent: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_ERROR },
  },
  ingestDatamodelStart: {
    expectedState: initialState.merge({
      isIngestingDataModel: true,
    }),
    action: { type: CLDataModelsActionTypes.INGEST_DATAMODEL_START },
  },
  ingestDatamodelSuccess: {
    expectedState: initialState.merge({
      isIngestingDataModel: false,
      showRenamePopoup: false,
      ingestingModalContent: {},
    }),
    action: { type: CLDataModelsActionTypes.INGEST_DATAMODEL_SUCCESS },
  },
  ingestDatamodelError: {
    expectedState: initialState.merge({
      isIngestingDataModel: false,
      showRenamePopoup: true,
      ingestingModalContent: { name: 'qas1' },
    }),
    action: {
      type: CLDataModelsActionTypes.INGEST_DATAMODEL_ERROR,
      payload: { err: { message: 'Prompt for Data Model Rename' }, ingestingDatamodel: { name: 'qas1' } },
    },
  },
  clearModalContent: {
    expectedState: initialState.merge({
      isIngestingDataModel: false,
      showRenamePopoup: false,
      ingestingModalContent: {},
    }),
    action: { type: CLDataModelsActionTypes.CLEAR_MODAL_CONTENT },
  },
  getDMTsListFromDMByEnv: {
    expectedState: initialState.merge({
      isFetchingDMTsToIngest: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST },
  },
  getDMTsListFromDMByEnvSuccess: {
    expectedState: initialState.merge({
      isFetchingDMTsToIngest: false,
      dmtsListToIngest: dmtsMock,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_SUCCESS, payload: dmtsMock },
  },
  getDMTsListFromDMByEnvError: {
    expectedState: initialState.merge({
      isFetchingDMTsToIngest: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_ERROR },
  },
  ingestDMT: {
    expectedState: initialState.merge({
      isDMTIngestQueue: true,
    }),
    action: { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE },
  },
  ingestDMTSuccess: {
    expectedState: initialState.merge({
      isDMTIngestQueue: false,
    }),
    action: { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE_SUCCESS },
  },
  ingestDMTError: {
    expectedState: initialState.merge({
      isDMTIngestQueue: false,
    }),
    action: { type: CLDataModelsActionTypes.INGEST_DMT_QUEUE_ERROR },
  },
  getDMTsIngestionStatus: {
    expectedState: initialState.merge({
      isFetchingDMTsIngestStatus: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS },
  },
  getDMTsIngestionStatusSuccess: {
    expectedState: initialState.merge({
      isFetchingDMTsIngestStatus: false,
      dmtsIngestionStatus: dmtsIngestionMock,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_SUCCESS, payload: dmtsIngestionMock },
  },
  getDMTsIngestionStatusError: {
    expectedState: initialState.merge({
      isFetchingDMTsIngestStatus: false,
    }),
    action: { type: CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_ERROR },
  },
  handlesRefreshIcon: {
    expectedState: initialState.merge({
      handleRefreshIcon: true,
    }),
    action: { type: CLDataModelsActionTypes.HANDLE_REFRESH_ICON, payload: true },
  },
  validateDMTName: {
    expectedState: initialState.merge({
      isDMTIngestQueue: true,
    }),
    action: { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME },
  },
  validateDMTNameSuccess: {
    expectedState: initialState.merge({
      isDMTIngestQueue: false,
    }),
    action: { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME_SUCCESS },
  },
  validateDMTNameFailure: {
    expectedState: initialState.merge({
      isDMTIngestQueue: false,
    }),
    action: { type: CLDataModelsActionTypes.VALIDATE_DMT_NAME_ERROR },
  },
  clearDMTsByDM: {
    expectedState: initialState.merge({
      dmtsListToIngest: [],
    }),
    action: { type: CLDataModelsActionTypes.CLEAR_DMTS_OF_DM },
  },
  getDMVersionsHistory: {
    expectedState: initialState.merge({
      isHistoryLoading: true,
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY },
  },
  getDMVersionsHistorySuccess: {
    expectedState: initialState.merge({
      isHistoryLoading: false,
      dMHistoryData: [],
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_SUCCESS, payload: [] },
  },
  getDMVersionsHistoryError: {
    expectedState: initialState.merge({
      isHistoryLoading: false,
      dMHistoryData: [],
    }),
    action: { type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_ERROR_RESET, payload: [] },
  },
};
