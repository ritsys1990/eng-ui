const COMPONENT_NAME = 'ClientSetupDataSources';

export const TRANSLATION_KEY = 'Components_ClientSetupDataSources_';

export const ComponentNames = Object.freeze({
  MAIN: COMPONENT_NAME,
  TABLE: `${COMPONENT_NAME}-Table`,
  SUBS_TABLE: `${COMPONENT_NAME}-Subscription`,
  SUBS_STATUSES_FIELD: `${COMPONENT_NAME}-SubsStatusesField`,
  SUBS_STATUS_FIELD: `${COMPONENT_NAME}-SubsStatusField`,
  MANAGE_DATASOURCE: `${COMPONENT_NAME}-DataSourceManager`,
  DELETE_DATASOURCE_MODAL: `${COMPONENT_NAME}-DeleteDataSourceModal`,
});

export const SubscriptionStatus = Object.freeze({
  SUBSCRIBED: 'Subscribed',
  WAITING_APPROVAL: 'WaitingForApproval',
  REJECTED: 'Rejected',
});

export const SubscriptionOptions = Object.freeze({
  APPROVE: 'approve',
  REJECT: 'reject',
});

export const DataSourceOptions = Object.freeze({
  EDIT: 'Edit',
  DELETE: 'Delete',
});

export const DataSourceTypes = Object.freeze({
  CLIENT_SOURCE: 'ClientSource',
  CLIENT_SCRIPT: 'ClientSourceExtractionScript',
  CLIENT_FS: 'ClientFileSystem',
  THIRD_PARTY: 'ThirdParty',
});

export const TransferModes = Object.freeze({
  SECURE_AGENT: 'SecureAgent',
  MANUAL: 'Manual',
});
