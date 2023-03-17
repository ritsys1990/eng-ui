import { Map as ImmutableMap } from 'immutable';
import { CLDataModelsActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  isDataModelsFetching: false,
  datamodels: [],
  publishedDatamodels: [],
  isDMDataLoading: false,
  datamodel: null,
  isFetchingFieldTypes: false,
  isDMFieldDeleting: false,
  fieldTypes: [],
  isDMFieldUpdating: false,
  isDMUpdating: false,
  isDMSwitchingToDraft: false,
  guidanceLoader: false,
  isDMStatusUpdating: false,
  isDMDeleting: false,
  isDMValidating: false,
  isUploadExample: false,
  uploadExapmleError: [],
  isUploadDM: false,
  uploadDMError: [],
  isCreatingNewDMT: false,
  isFetchingDMTsFromDM: false,
  dmtsList: [],
  isValidatingDMT: false,
  isFetchingDMMap: false,
  dmMapping: [],
  dmMappingError: [],
  allEnvironments: [],
  isFetchingEnvironments: false,
  environmentContent: [],
  isFetchingEnvContent: false,
  isIngestingDataModel: false,
  ingestingModalContent: {}, // used to hold the ingesting modal data for later ingest request
  showRenamePopoup: false, // used to display the rename pop when validating the data model ingest
  environmentContentDMT: [],
  isIngestingDMT: false,
  dmtsListToIngest: [],
  isFetchingDMTsToIngest: false,
  isDMTIngestQueue: false,
  dmtsIngestionStatus: [],
  isFetchingDMTsIngestStatus: false,
  handleRefreshIcon: false,
  isHistoryLoading: false,
  dMHistoryData: [],
});

export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case CLDataModelsActionTypes.FETCH_DATAMODELS_REQUEST:
    case CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_REQUEST:
    case CLDataModelsActionTypes.EXPORT_DATAMODEL:
      return state.merge({
        isDataModelsFetching: true,
      });

    case CLDataModelsActionTypes.FETCH_DATAMODELS_SUCCESS:
      return state.merge({
        isDataModelsFetching: false,
        datamodels: action.payload?.items,
      });

    case CLDataModelsActionTypes.FETCH_DATAMODELS_ERROR:
      return state.merge({
        isDataModelsFetching: false,
        datamodels: [],
      });

    case CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_SUCCESS:
      return state.merge({
        isDataModelsFetching: false,
        publishedDatamodels: action.payload || [],
      });

    case CLDataModelsActionTypes.FETCH_PUBLISHED_DATAMODELS_ERROR:
      return state.merge({
        isDataModelsFetching: false,
        publishedDatamodels: [],
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_DATA:
      return state.merge({
        isDMDataLoading: true,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_DATA_SUCCESS:
      return state.merge({
        isDMDataLoading: false,
        datamodel: action.payload,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_DATA_ERROR:
      return state.merge({
        isDMDataLoading: false,
      });

    case CLDataModelsActionTypes.GET_DM_FILED_TYPES:
      return state.merge({
        isFetchingFieldTypes: true,
      });

    case CLDataModelsActionTypes.GET_DM_FILED_TYPES_SUCCESS:
      return state.merge({
        isFetchingFieldTypes: false,
        fieldTypes: action.payload,
      });

    case CLDataModelsActionTypes.GET_DM_FIELD_TYPES_ERROR:
      return state.merge({
        isFetchingFieldTypes: false,
      });

    case CLDataModelsActionTypes.UPDATE_DM_FIELD:
      return state.merge({
        isDMFieldUpdating: true,
      });

    case CLDataModelsActionTypes.UPDATE_DM_FIELD_SUCCESS:
    case CLDataModelsActionTypes.UPDATE_DM_FIELD_ERROR:
      return state.merge({
        isDMFieldUpdating: false,
      });

    case CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD:
      return state.merge({
        isDMFieldDeleting: true,
      });

    case CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_SUCCESS:
    case CLDataModelsActionTypes.DELETE_DATAMODEL_FIELD_ERROR:
      return state.merge({
        isDMFieldDeleting: false,
      });

    case CLDataModelsActionTypes.UPDATE_DATAMODEL_REQUEST:
      return state.merge({
        isDMUpdating: true,
      });

    case CLDataModelsActionTypes.UPDATE_DATAMODEL_SUCCESS:
    case CLDataModelsActionTypes.UPDATE_DATAMODEL_ERROR:
      return state.merge({
        isDMUpdating: false,
      });

    case CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT:
    case CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW:
      return state.merge({
        isDMStatusUpdating: true,
      });

    case CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_SUCCESS:
    case CLDataModelsActionTypes.SWITCH_DM_TO_DRAFT_ERROR:
    case CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_SUCCESS:
    case CLDataModelsActionTypes.SUBMIT_DM_FOR_REVIEW_ERROR:
      return state.merge({
        isDMStatusUpdating: false,
      });

    case CLDataModelsActionTypes.POST_ADD_GUIDANCE:
      return state.merge({
        guidanceLoader: true,
      });

    case CLDataModelsActionTypes.POST_ADD_GUIDANCE_ERROR:
    case CLDataModelsActionTypes.POST_ADD_GUIDANCE_SUCCESS:
      return state.merge({
        guidanceLoader: false,
      });

    case CLDataModelsActionTypes.DELETE_DATAMODEL_REQUEST:
      return state.merge({
        isDMDeleting: true,
      });

    case CLDataModelsActionTypes.DELETE_DATAMODEL_SUCCESS:
    case CLDataModelsActionTypes.DELETE_DATAMODEL_ERROR:
      return state.merge({
        isDMDeleting: false,
      });

    case CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION:
      return state.merge({
        isDMValidating: true,
      });

    case CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_SUCCESS:
    case CLDataModelsActionTypes.VALIDATE_DATAMODEL_REDIRECTION_ERROR:
      return state.merge({
        isDMValidating: false,
      });

    case CLDataModelsActionTypes.EXPORT_DATAMODEL_SUCCESS:
    case CLDataModelsActionTypes.EXPORT_DATAMODEL_ERROR:
      return state.merge({
        isDataModelsFetching: false,
      });

    case CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE:
      return state.merge({
        isUploadExample: true,
      });

    case CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_SUCCESS:
      return state.merge({
        isUploadExample: false,
      });

    case CLDataModelsActionTypes.UPLOAD_DATAMODEL_EXPAMPLE_ERROR:
      return state.merge({
        isUploadExample: false,
        uploadExapmleError: [{ type: 'error', message: `${action.payload.error}`, key: Date.now() }],
      });

    case CLDataModelsActionTypes.UPLOAD_DATAMODELS:
      return state.merge({
        isUploadDM: true,
      });

    case CLDataModelsActionTypes.UPLOAD_DATAMODELS_SUCCESS:
      return state.merge({
        isUploadDM: false,
      });

    case CLDataModelsActionTypes.UPLOAD_DATAMODEL_ERROR:
      return state.merge({
        isUploadDM: false,
        uploadDMError: [{ type: 'error', message: `${action.payload.error}`, key: Date.now() }],
      });

    case CLDataModelsActionTypes.CREATE_NEW_DMT:
      return state.merge({
        isCreatingNewDMT: true,
      });

    case CLDataModelsActionTypes.CREATE_NEW_DMT_SUCCESS:
    case CLDataModelsActionTypes.CREATE_NEW_DMT_ERROR:
      return state.merge({
        isCreatingNewDMT: false,
      });

    case CLDataModelsActionTypes.GET_DMTS_FROM_DM:
      return state.merge({
        isFetchingDMTsFromDM: true,
      });

    case CLDataModelsActionTypes.GET_DMTS_FROM_DM_SUCCESS:
      return state.merge({
        isFetchingDMTsFromDM: false,
        dmtsList: action.payload,
      });

    case CLDataModelsActionTypes.GET_DMTS_FROM_DM_ERROR:
      return state.merge({
        isFetchingDMTsFromDM: false,
        dmtsList: [],
      });

    case CLDataModelsActionTypes.VALIDATE_DMT:
      return state.merge({
        isValidatingDMT: true,
      });

    case CLDataModelsActionTypes.VALIDATE_DMT_SUCCESS:
    case CLDataModelsActionTypes.VALIDATE_DMT_ERROR:
      return state.merge({
        isValidatingDMT: false,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_MAPPING:
      return state.merge({
        isFetchingDMMap: true,
        dmMapping: [],
        dmMappingError: [],
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_SUCCESS:
      return state.merge({
        isFetchingDMMap: false,
        dmMapping: action.payload.mappingResult,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_MAPPING_ERROR:
      return state.merge({
        isFetchingDMMap: false,
        dmMappingError: [{ type: 'error', message: `${action.payload}`, key: Date.now() }],
      });

    case CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS:
      return state.merge({
        isFetchingEnvironments: true,
      });

    case CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_SUCCESS:
      return state.merge({
        isFetchingEnvironments: false,
        allEnvironments: JSON.parse(action.payload).map(env => {
          return { name: env };
        }),
      });

    case CLDataModelsActionTypes.GET_ALL_ENVIRONMENTS_ERROR:
      return state.merge({
        isFetchingEnvironments: false,
      });

    case CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV:
      return state.merge({
        isFetchingEnvContent: true,
        dmMapping: [],
      });

    case CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_SUCCESS:
      return state.merge({
        isFetchingEnvContent: false,
        environmentContent: action.payload,
      });

    case CLDataModelsActionTypes.GET_DATAMODELS_IN_ENV_ERROR:
    case CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_ERROR:
      return state.merge({
        isFetchingEnvContent: false,
      });

    case CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT:
      return state.merge({
        isFetchingEnvContent: true,
      });

    case CLDataModelsActionTypes.GET_DMT_FROM_ENVIRONMENT_SUCCESS:
      return state.merge({
        isFetchingEnvContent: false,
        environmentContentDMT: action.payload,
      });

    case CLDataModelsActionTypes.INGEST_DMT:
      return state.merge({
        isIngestingDMT: true,
      });

    case CLDataModelsActionTypes.INGEST_DMT_SUCCESS:
    case CLDataModelsActionTypes.INGEST_DMT_ERROR:
      return state.merge({
        isIngestingDMT: false,
      });

    case CLDataModelsActionTypes.INGEST_DATAMODEL_START:
      return state.merge({
        isIngestingDataModel: true,
      });
    case CLDataModelsActionTypes.INGEST_DATAMODEL_SUCCESS:
    case CLDataModelsActionTypes.CLEAR_MODAL_CONTENT:
      return state.merge({
        isIngestingDataModel: false,
        showRenamePopoup: false,
        ingestingModalContent: {},
      });
    case CLDataModelsActionTypes.INGEST_DATAMODEL_ERROR:
      const { err } = action.payload;
      let isPopup = false;
      if (err.message.indexOf('Prompt for Data Model Rename') > -1) {
        isPopup = true;
      }

      return state.merge({
        isIngestingDataModel: false,
        showRenamePopoup: isPopup,
        ingestingModalContent: action.payload.ingestingDatamodel,
      });

    case CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST:
      return state.merge({
        isFetchingDMTsToIngest: true,
      });

    case CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_SUCCESS:
      return state.merge({
        isFetchingDMTsToIngest: false,
        dmtsListToIngest: action.payload,
      });

    case CLDataModelsActionTypes.GET_DMTS_OF_DM_INGEST_ERROR:
      return state.merge({
        isFetchingDMTsToIngest: false,
      });

    case CLDataModelsActionTypes.CLEAR_DMTS_OF_DM:
      return state.merge({
        dmtsListToIngest: [],
      });

    case CLDataModelsActionTypes.INGEST_DMT_QUEUE:
    case CLDataModelsActionTypes.VALIDATE_DMT_NAME:
      return state.merge({
        isDMTIngestQueue: true,
      });

    case CLDataModelsActionTypes.INGEST_DMT_QUEUE_SUCCESS:
    case CLDataModelsActionTypes.INGEST_DMT_QUEUE_ERROR:
    case CLDataModelsActionTypes.VALIDATE_DMT_NAME_SUCCESS:
    case CLDataModelsActionTypes.VALIDATE_DMT_NAME_ERROR:
      return state.merge({
        isDMTIngestQueue: false,
      });

    case CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS:
      return state.merge({
        isFetchingDMTsIngestStatus: true,
      });

    case CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_SUCCESS:
      return state.merge({
        isFetchingDMTsIngestStatus: false,
        dmtsIngestionStatus: action.payload,
      });

    case CLDataModelsActionTypes.GET_DMTS_INGESTION_STATUS_ERROR:
      return state.merge({
        isFetchingDMTsIngestStatus: false,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_HISTORY:
      return state.merge({
        isHistoryLoading: true,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_SUCCESS:
      return state.merge({
        isHistoryLoading: false,
        dMHistoryData: action.payload,
      });

    case CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_ERROR_RESET:
      return state.merge({
        isHistoryLoading: false,
        dMHistoryData: [],
      });

    case CLDataModelsActionTypes.HANDLE_REFRESH_ICON:
      return state.merge({
        handleRefreshIcon: action.payload,
      });

    default:
      return state;
  }
}
