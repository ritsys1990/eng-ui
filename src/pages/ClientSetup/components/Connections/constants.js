const COMPONENT_NAME = 'ClientSetupConnections';

export const TRANSLATION_KEY = 'Components_ClientSetupConnections_';
export const ADD_CONNECTION_TRANSLATION_KEY = 'Components_AddConnectionModal_';

export const ComponentNames = Object.freeze({
  MAIN: COMPONENT_NAME,
  DATASOURCES_TABLE: `${COMPONENT_NAME}-DataSources`,
  CONNECTIONS_TABLE: `${COMPONENT_NAME}-Connections`,
  EXTRACTION_SCRIPT_TABLE: `${COMPONENT_NAME}-Extraction`,
  STATUS_FIELD: `${COMPONENT_NAME}-StatusField`,
  ADD_CONNECTION_BUTTON: `${COMPONENT_NAME}-AddConnectionButton`,
  CTA_BUTTON: `${COMPONENT_NAME}-CTAButton`,
  EXTRACTION_SCRIPT_MODAL: `${COMPONENT_NAME}-ExtractionModal`,
  EXTRACTION_SCRIPT_DELETE_MODAL: `${COMPONENT_NAME}-ExtractionDeleteModal`,
  ADD_CONNECTION_MODAL: `${COMPONENT_NAME}-AddConnectionModal`,
  ADD_CONNECTION: `${COMPONENT_NAME}-AddConnection`,
  PARAMETERS: `${COMPONENT_NAME}-Parameters`,
  DELETE_CONNECTION_MODAL: `${COMPONENT_NAME}-DeleteConnectionModal`,
  EDIT_CONNECTION_WARNING_MODAL: `${COMPONENT_NAME}-EditConnectionWarningModal`,
  TEST_CONNECTION_DETAILS_MODAL: `${COMPONENT_NAME}-TestConnectionDetailsModal`,
});

export const DataSourceTypes = {
  CLIENT_SOURCE_EXTRACTION_SCRIPT: 'ClientSourceExtractionScript',
  CLIENT_FILE_SYSTEM: 'ClientFileSystem',
  CLIENT_SOURCE: 'ClientSource',
  THIRD_PARTY: 'ThirdParty',
};

export const FileTransferType = {
  SECURE_AGENT: 'SecureAgent',
  MANUAL: 'Manual',
};

export const DS_STATUS = Object.freeze({
  NOT_CONFIGURED: 'NotConfigured',
});

export const ConnectionTypes = Object.freeze([
  { id: 'source', name: 'Components_AddConnectionModal_Con_Type_Source' },
  { id: 'extraction', name: 'Components_AddConnectionModal_Con_Type_Extraction' },
  { id: 'transfer', name: 'Components_AddConnectionModal_Con_Type_Transfer' },
]);

export const CONNECTION_STATUS = Object.freeze({
  NOT_CONFIGURED: 'NotConfigured',
  CONFIGURED: 'Configured',
});

export const ExtractionScriptModalMode = {
  EDIT: 'edit',
  NEW: 'new',
};

export const DatabaseTypes = {
  ORACLE: 'Oracle',
  MSSQL: 'MSSQL',
  SAP: 'SAP',
};

export const ExtractionScriptContextMenuOptions = {
  EDIT: 'edit',
  DELETE: 'delete',
};

export const ConnectionsContextMenuOptions = {
  SET_TRANSFER_DEFAULT: 'setTransferDefault',
};

export const FormErrorModel = Object.freeze({
  domainName: null,
  connectionName: null,
  description: null,
  connectionType: null,
  connectorTemplate: null,
  runtimeEnvironment: null,
});

export const TYPES = Object.freeze({
  TRANSFER: 'transfer',
  SOURCE: 'source',
});

export const CONNECTION_TYPES = {
  SOURCE: 'source',
  EXTRACTION: 'extraction',
  TRANSFER: 'transfer',
  DATA_SYNCHRONIZATION: 'dataSynchronization',
};

export const SECURE_AGENT_TYPES = {
  TRANSFER: 'Transfer',
};

export const VALUE_TYPES = {
  BOOLEAN: 'Boolean',
  NUMBER: 'Number',
};

export const ConnectionOptions = Object.freeze({
  EDIT: 'Edit',
  DELETE: 'Delete',
});
