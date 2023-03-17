const selectMe = state => state.security.get('me');
const selectCountries = state => state.security.get('countries');
const selectMeFetched = state => state.security.get('meFetched');
const selectPermissions = state => state.security.get('permissions');
const selectPermissionsFetched = state => state.security.get('permissionsFetched');
const selectMeRolesFetched = state => state.security.get('meRolesFetched');
const selectEngagementPermissions = state => state.security.get('engagementPermissions');
const selectMeRoles = state => state.security.get('meRoles');
const selectTOU = state => state.security.get('tou');
const fetchingTOU = state => state.security.get('fetchingTou') || state.security.get('acceptingTOU');
const selectFetchingCountries = state => state.security.get('fetchingCountries');
const selecGettingClientPermissions = state => state.security.get('gettingClientPermissions');
const selectClientPermissions = state => state.security.get('clientPermission');
const selectClientRecertificationStatus = state => state.security.get('clientRecertification');
const selectClientExternalRecertificationStatus = state => state.security.get('externalClientRecertification');
const selectEngagementListPermissions = state => state.security.get('engagementListPermissions');
const selectFetchingEngagementListPermissions = state => state.security.get('fetchingEngagementListPermissions');
const selectAlerts = state => state.security.get('alerts');

export const securitySelectors = {
  selectMe,
  selectCountries,
  selectMeFetched,
  selectPermissions,
  selectPermissionsFetched,
  selectMeRolesFetched,
  selectEngagementPermissions,
  selectMeRoles,
  selectTOU,
  fetchingTOU,
  selectFetchingCountries,
  selecGettingClientPermissions,
  selectClientPermissions,
  selectClientRecertificationStatus,
  selectClientExternalRecertificationStatus,
  selectEngagementListPermissions,
  selectFetchingEngagementListPermissions,
  selectAlerts,
};
