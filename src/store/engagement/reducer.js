import { Map as ImmutableMap } from 'immutable';
import { EngagementActionTypes } from './actionTypes';
import { isEqual } from 'lodash';
import { EngagementCloseoutStatus } from '../../pages/Engagement/constants/constants';

export const initialState = ImmutableMap({
  engagement: null,
  fetchingEngagement: false,
  myList: [],
  fetchingMyList: false,
  userList: [],
  fetchingUserList: false,
  isLoading: false,
  inputs: [],
  clientEngagementsList: [],
  isFetchingClientEngagementList: false,
  matClientEngagements: [],
  matGlobalClientEngagements: [],
  isFetchingMatClientEngagements: false,
  isFetchingMatGlobalClientEngagements: false,
  isReconcilingEngagements: false,
  areEngagementsReconciled: false,
  isReconcileEngagementsModalOpen: false,
  isAddingEngagement: false,
  addedEngagement: null,
  areEngagementsSynchedToOmnia: false,
  isProvisioningEngagements: false,
  isRollforwardInProgress: false,
  isDeletingEngagement: false,
  isApprovingDataSourceSubscription: false,
  isRejectingDataSourceSubscription: false,
  isConfiguringDataSourceExtractionScript: false,
  isDeletingDataSourceConfig: false,
  isDeletingConnection: false,
  fetchingEngagementRenameStatus: false,
  engagementRenameStatus: [],
  createEngagementUserInProgress: false,
});

export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case EngagementActionTypes.GET_ENGAGEMENT_REQUEST:
      return state.merge({
        fetchingEngagement: true,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_SUCCESS:
      return state.merge({
        fetchingEngagement: false,
        engagement: action.payload,
        readOnlyfromEng: [EngagementCloseoutStatus.APPROVED, EngagementCloseoutStatus.PENDING_APPROVAL].includes(
          action.payload.closeout.status
        ),
      });

    case EngagementActionTypes.GET_ENGAGEMENT_ERROR:
      return state.merge({
        fetchingEngagement: false,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_LIST_REQUEST:
      return state.merge({
        fetchingMyList: true,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_LIST_SUCCESS:
      return state.merge({
        fetchingMyList: false,
        myList: action.payload,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_LIST_ERROR:
      return state.merge({
        fetchingMyList: false,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_REQUEST:
      return state.merge({
        fetchingUserList: true,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_SUCCESS:
      return state.merge({
        fetchingUserList: false,
        userList: action.payload,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_ERROR:
      return state.merge({
        fetchingUserList: false,
      });

    case EngagementActionTypes.GET_DMT_DATA:
      return state.merge({
        isLoading: true,
      });

    case EngagementActionTypes.GET_DMT_DATA_SUCCESS:
      if (isEqual(action.payload, state.get('inputs'))) {
        return state;
      }

      return state.merge({
        isLoading: false,
        inputs: action.payload,
      });

    case EngagementActionTypes.GET_DMT_DATA_ERROR:
      return state.merge({
        isLoading: false,
      });

    case EngagementActionTypes.SET_ENGAGEMENT:
      return state.merge({
        engagement: action.payload,
      });

    case EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST:
      return state.merge({
        isFetchingClientEngagementList: true,
      });

    case EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS:
      return state.merge({
        isFetchingClientEngagementList: false,
        clientEngagementsList: action.payload.engagements,
        areEngagementsReconciled: action.payload.areEngagementsReconciled,
        areEngagementsSynchedToOmnia: action.payload.areEngagementsSynchedToOmnia,
      });

    case EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_ERROR:
      return state.merge({
        isFetchingClientEngagementList: false,
      });

    case EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS:
      return state.merge({
        isFetchingMatClientEngagements: true,
      });

    case EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_SUCCESS:
      return state.merge({
        matClientEngagements: action.payload,
        isFetchingMatClientEngagements: false,
      });

    case EngagementActionTypes.GET_MAT_GLOBAL_CLIENT_ENGAGEMENTS:
      return state.merge({
        matGlobalClientEngagements: action.payload,
        isFetchingMatGlobalClientEngagements: false,
      });

    case EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_ERROR:
      return state.merge({
        isFetchingMatClientEngagements: false,
      });

    case EngagementActionTypes.ADD_NEW_ENGAGEMENTS:
      return state.merge({
        isAddingEngagement: true,
      });

    case EngagementActionTypes.ADD_NEW_ENGAGEMENTS_SUCCESS:
      return state.merge({
        isAddingEngagement: false,
        addedEngagement: action.payload,
      });

    case EngagementActionTypes.ADD_NEW_ENGAGEMENTS_ERROR:
      return state.merge({
        isAddingEngagement: false,
      });

    case EngagementActionTypes.CREATE_ENGAGEMENT_USER_REQUEST:
      return state.merge({
        createEngagementUserInProgress: true,
      });

    case EngagementActionTypes.CREATE_ENGAGEMENT_USER_SUCCESS:
    case EngagementActionTypes.CREATE_ENGAGEMENT_USER_ERROR:
      return state.merge({
        createEngagementUserInProgress: false,
      });

    case EngagementActionTypes.RESET_MAT_CLIENT_ENGAGEMENTS:
      return state.merge({
        matClientEngagements: [],
      });

    case EngagementActionTypes.RECONCILE_ENGAGEMENTS:
      return state.merge({
        isReconcilingEngagements: true,
      });

    case EngagementActionTypes.RECONCILE_ENGAGEMENTS_SUCCESS:
    case EngagementActionTypes.RECONCILE_ENGAGEMENTS_ERROR:
      return state.merge({
        isReconcilingEngagements: false,
      });

    case EngagementActionTypes.UPDATE_IS_RECONCILE_MODAL_OPEN:
      return state.merge({
        isReconcileEngagementsModalOpen: action.payload,
      });

    case EngagementActionTypes.PROVISION_ENGAGEMENTS:
      return state.merge({
        isProvisioningEngagements: true,
      });

    case EngagementActionTypes.PROVISION_ENGAGEMENTS_SUCCESS:
    case EngagementActionTypes.PROVISION_ENGAGEMENTS_ERROR:
      return state.merge({
        isProvisioningEngagements: false,
      });

    case EngagementActionTypes.ROLLFORWARD_ENGAGEMENT:
      return state.merge({
        isRollforwardInProgress: true,
      });

    case EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_SUCCESS:
    case EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_ERROR:
      return state.merge({
        isRollforwardInProgress: false,
      });

    case EngagementActionTypes.DELETE_ENGAGEMENT:
      return state.merge({
        isDeletingEngagement: true,
      });

    case EngagementActionTypes.DELETE_ENGAGEMENT_SUCCESS:
    case EngagementActionTypes.DELETE_ENGAGEMENT_ERROR:
      return state.merge({
        isDeletingEngagement: false,
      });

    case EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION:
      return state.merge({
        isApprovingDataSourceSubscription: true,
      });

    case EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_SUCCESS:
    case EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_ERROR:
      return state.merge({
        isApprovingDataSourceSubscription: false,
      });

    case EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION:
      return state.merge({
        isRejectingDataSourceSubscription: true,
      });

    case EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_SUCCESS:
    case EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_ERROR:
      return state.merge({
        isRejectingDataSourceSubscription: false,
      });

    case EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT:
      return state.merge({
        isConfiguringDataSourceExtractionScript: true,
      });

    case EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_SUCCESS:
    case EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_ERROR:
      return state.merge({
        isConfiguringDataSourceExtractionScript: false,
      });

    case EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG:
      return state.merge({
        isDeletingDataSourceConfig: true,
      });

    case EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_SUCCESS:
    case EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_ERROR:
      return state.merge({
        isDeletingDataSourceConfig: false,
      });

    case EngagementActionTypes.DELETE_CONNECTION:
      return state.merge({
        isDeletingConnection: true,
      });

    case EngagementActionTypes.DELETE_CONNECTION_SUCCESS:
    case EngagementActionTypes.DELETE_CONNECTION_ERROR:
      return state.merge({
        isDeletingConnection: false,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_RENAME_STATUS_REQUEST:
      return state.merge({
        fetchingEngagementRenameStatus: true,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_RENAME_STATUS_SUCCESS:
      return state.merge({
        fetchingEngagementRenameStatus: false,
        engagementRenameStatus: action.payload,
      });

    case EngagementActionTypes.GET_ENGAGEMENT_RENAME_STATUS_ERROR:
      return state.merge({
        fetchingEngagementRenameStatus: false,
      });

    default:
      return state;
  }
}
