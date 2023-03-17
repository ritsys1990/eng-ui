import { Map as ImmutableMap } from 'immutable';
import { SecurityActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  me: null,
  meFetched: false,
  fetchingMe: false,
  meRoles: [],
  countries: [],
  fetchingCountries: false,
  meRolesFetched: false,
  fetchingMeRoles: false,
  permissions: null,
  permissionsFetched: false,
  fetchingPermissions: false,
  engagementPermissions: null,
  currentEngagementId: '',
  fetchingEngagementPermissions: false,
  roleList: [],
  fetchingRoleList: false,
  tou: null,
  fetchingTou: false,
  acceptingTOU: false,
  gettingClientPermissions: false,
  clientPermission: null,
  currentClientId: '',
  clientRecertification: null,
  isFetchingClientRecertification: false,
  externalClientRecertification: null,
  isFetchingExternalClientRecertification: false,
  engagementListPermissions: null,
  fetchingEngagementListPermissions: false,
  alerts: [],
});

export default function reduce(state = initialState, action = {}) {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case SecurityActionTypes.GET_GLOBAL_PERMISSIONS_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingPermissions: true,
        })
      );

    case SecurityActionTypes.GET_GLOBAL_PERMISSIONS_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingPermissions: false,
          permissions: action.payload,
          permissionsFetched: true,
        })
      );

    case SecurityActionTypes.GET_GLOBAL_PERMISSIONS_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingPermissions: false,
        })
      );

    case SecurityActionTypes.GET_ENGAGEMENT_PERMISSIONS_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingEngagementPermissions: true,
          engagementPermissions: null,
        })
      );

    case SecurityActionTypes.GET_ENGAGEMENT_PERMISSIONS_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingEngagementPermissions: false,
          engagementPermissions: action.payload.permissions,
          currentEngagementId: action.payload.engagementId,
        })
      );

    case SecurityActionTypes.GET_ENGAGEMENT_PERMISSIONS_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingEngagementPermissions: false,
        })
      );

    case SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingEngagementListPermissions: true,
          engagementListPermissions: null,
        })
      );

    case SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingEngagementListPermissions: false,
          engagementListPermissions: action.payload,
        })
      );

    case SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingEngagementListPermissions: false,
        })
      );

    case SecurityActionTypes.GET_ME_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingMe: true,
        })
      );

    case SecurityActionTypes.GET_ME_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingMe: false,
          me: action.payload,
          meFetched: true,
        })
      );

    case SecurityActionTypes.GET_ME_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingMe: false,
          meFetched: true,
        })
      );

    case SecurityActionTypes.GET_ME_ROLES_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingMeRoles: true,
        })
      );

    case SecurityActionTypes.GET_ME_ROLES_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingMeRoles: false,
          meRoles: action.payload,
          meRolesFetched: true,
        })
      );

    case SecurityActionTypes.GET_ME_ROLES_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingMeRoles: false,
        })
      );

    case SecurityActionTypes.GET_ROLE_LIST_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingRoleList: true,
        })
      );

    case SecurityActionTypes.GET_ROLE_LIST_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingRoleList: false,
          roleList: action.payload,
        })
      );

    case SecurityActionTypes.GET_ROLE_LIST_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingRoleList: false,
        })
      );

    case SecurityActionTypes.GET_COUNTRIES_REQUEST:
      return state.merge(
        ImmutableMap({
          fetchingCountries: true,
        })
      );

    case SecurityActionTypes.GET_COUNTRIES_SUCCESS:
      return state.merge(
        ImmutableMap({
          fetchingCountries: false,
          countries: action.payload || [],
        })
      );

    case SecurityActionTypes.GET_COUNTRIES_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingCountries: false,
        })
      );

    case SecurityActionTypes.GET_UNACCEPTED_TOU:
    case SecurityActionTypes.GET_UNACCEPTED_TOU_ERROR:
      return state.merge(
        ImmutableMap({
          fetchingTou: true,
        })
      );

    case SecurityActionTypes.GET_UNACCEPTED_TOU_SUCCESS:
      return state.merge(
        ImmutableMap({
          tou: action.payload,
          fetchingTou: false,
        })
      );

    case SecurityActionTypes.ACCEPT_TOU:
      return state.merge(
        ImmutableMap({
          acceptingTOU: true,
        })
      );

    case SecurityActionTypes.ACCEPT_TOU_SUCCESS:
    case SecurityActionTypes.ACCEPT_TOU_ERROR:
      return state.merge(
        ImmutableMap({
          acceptingTOU: false,
        })
      );

    case SecurityActionTypes.GET_CLIENT_PERMISSIONS:
      return state.merge(
        ImmutableMap({
          gettingClientPermissions: true,
        })
      );

    case SecurityActionTypes.GET_CLIENT_PERMISSIONS_SUCCESS:
      return state.merge(
        ImmutableMap({
          gettingClientPermissions: false,
          clientPermission: action.payload.permissions,
          currentClientId: action.payload.clientId,
        })
      );

    case SecurityActionTypes.GET_CLIENT_PERMISSIONS_ERROR:
      return state.merge(
        ImmutableMap({
          gettingClientPermissions: false,
        })
      );

    case SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS:
      return state.merge(
        ImmutableMap({
          isFetchingClientRecertification: true,
        })
      );

    case SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_SUCCESS:
      return state.merge(
        ImmutableMap({
          isFetchingClientRecertification: false,
          clientRecertification: action.payload,
        })
      );

    case SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_ERROR:
      return state.merge(
        ImmutableMap({
          isFetchingClientRecertification: false,
        })
      );

    case SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS:
      return state.merge(
        ImmutableMap({
          isFetchingExternalClientRecertification: true,
        })
      );

    case SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_SUCCESS:
      return state.merge(
        ImmutableMap({
          isFetchingExternalClientRecertification: false,
          externalClientRecertification: action.payload,
        })
      );

    case SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_ERROR:
      return state.merge(
        ImmutableMap({
          isFetchingExternalClientRecertification: false,
        })
      );

    case SecurityActionTypes.GET_ALERTS_SUCCESS:
      return state.merge(
        ImmutableMap({
          alerts: action.payload.items,
        })
      );

    default:
      return state;
  }
}
