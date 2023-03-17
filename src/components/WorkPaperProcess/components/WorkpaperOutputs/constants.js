export const COMPONENT_NAME = 'PublishWorkbookModal';

export const FILE_TYPES = ['.twb', '.twbx'];

export const RADIO_GROUP_NAME = 'sqlDataSource';

export const OUTPUT_TABLE_NAME = {
  DATABRICKS_SQL: 'databricksSqlTableName',
  AZURE_SQL: 'sqlTableName',
};

export const WORKBOOK_DATA_SOURCE = {
  AZURE_SQL: 'AzureSql',
  DATABRICKS_SQL: 'DatabricksSql',
};

export const getDataSourceOptions = t => {
  return [
    {
      value: WORKBOOK_DATA_SOURCE.DATABRICKS_SQL,
      text: t('Pages_WorkpaperProcess_Step3_Data_Source_Databricks'),
    },
    {
      value: WORKBOOK_DATA_SOURCE.AZURE_SQL,
      text: t('Pages_WorkpaperProcess_Step3_Data_Source_Azure'),
    },
  ];
};
