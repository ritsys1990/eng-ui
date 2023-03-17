import React, { useEffect, useState } from 'react';
import { Box, Table, Flex, Text, TextTypes, Icon, IconTypes, Tooltip, TooltipPosition } from 'cortex-look-book';
import { ComponentNames, DataSourceTypes, TRANSLATION_KEY } from './constants';
import useTranslation from 'src/hooks/useTranslation';
import ConnectionsTable from './ConnectionsTable';
import { StatusField, AddConnectionButton } from './TableFields';
import ExtractionScriptTable from './ExtractionScriptTable';
import ExtractionScriptModal from './ExtractionScriptModal';
import { useSelector } from 'react-redux';
import { clientSelectors } from '../../../../store/client/selectors';

const { DATASOURCES_TABLE: COMPONENT_NAME } = ComponentNames;

export const renderStatus = value => <StatusField status={value} />;

export const renderType = (row, t) => {
  const { type, fileTransferMode } = row;

  switch (type) {
    case DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT:
      return t(`${TRANSLATION_KEY}DataSource_ExtractionScript`);
    case DataSourceTypes.CLIENT_SOURCE:
      return `${t(`${TRANSLATION_KEY}DataSource_ClientSource`)} (${t(
        `${TRANSLATION_KEY}FileTransfer_${fileTransferMode}`
      )})`;
    case DataSourceTypes.THIRD_PARTY:
      return `${t(`${TRANSLATION_KEY}DataSource_ThirdParty`)} (${t(
        `${TRANSLATION_KEY}FileTransfer_${fileTransferMode}`
      )})`;
    case DataSourceTypes.CLIENT_FILE_SYSTEM:
      return t(`${TRANSLATION_KEY}DataSource_ClientFileSystem`);
    default:
      return type;
  }
};

export const renderName = t => (name, row) => {
  return (
    <Text type={TextTypes.BODY} display='flex' alignItems='center'>
      {name}
      {row?.obsolete && (
        <Tooltip
          display='inline-block'
          direction={TooltipPosition.TOP}
          tooltipContent={t(`${TRANSLATION_KEY}ObsoleteConnectionInDataSource`)}
          width='200px'
          showOnHover
        >
          <Icon type={IconTypes.WARNING_NO_CIRCLE} height={28} width={28} ml={2} color='black' />
        </Tooltip>
      )}
    </Text>
  );
};

export const isRowExpandable = () => true;

export const renderConnectionsTable = (row, isConfigureExtractionModalOpen, handleConfigureExtractionModalClose) => {
  if (row?.type === DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT) {
    const scripts = [];

    if (row?.extractionScriptSettings) {
      scripts.push(row.extractionScriptSettings);
    }

    return (
      <ExtractionScriptTable
        scripts={scripts}
        dataSourceId={row.id}
        isConfigureModalOpen={isConfigureExtractionModalOpen}
        handleConfigureModalClose={handleConfigureExtractionModalClose}
      />
    );
  }

  return (
    <ConnectionsTable
      type={row.type}
      fileTransferMode={row.fileTransferMode}
      connections={row.connections}
      rowData={row}
    />
  );
};

const DatasourcesTable = ({ dataSources, onAddConnection, ...otherProps }) => {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [isConfigureExtractionModalOpen, setIsConfigureExtractionModalOpen] = useState(false);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState('');
  const [rows, setRows] = useState([]);
  const connectorTemplateList = useSelector(clientSelectors.selectConnectionTemplateList);

  const handleConfigureExtractionModalClose = () => {
    setIsConfigureExtractionModalOpen(false);
  };

  useEffect(() => {
    const updatedDataSources = dataSources.map(dataSource => {
      let isDataSourceObsolete = false;
      const updatedConnections = dataSource.connections.map(connection => {
        const isConnectionObsolete = connectorTemplateList?.items?.every(
          template => connection.connectorId !== template.id
        );

        if (isConnectionObsolete) {
          isDataSourceObsolete = true;
        }

        return { ...connection, obsolete: isConnectionObsolete };
      });

      return { ...dataSource, connections: updatedConnections, obsolete: isDataSourceObsolete };
    });

    setRows(updatedDataSources);
  }, [dataSources, connectorTemplateList]);

  useEffect(() => {
    setHeaders([
      {
        title: '',
        key: 'isExpandableRow',
        width: '40',
        iconHeight: 30,
        iconWidth: 30,
        collapseRow: true,
      },
      { key: 'name', title: t(`${TRANSLATION_KEY}TableHeader1`), render: renderName(t) },
      {
        key: 'fileTransferMode',
        title: t(`${TRANSLATION_KEY}TableHeader2`),
        render: (_, row) => {
          return renderType(row, t);
        },
      },
      { key: 'status', title: t(`${TRANSLATION_KEY}TableHeader3`), render: renderStatus },
      {
        key: '#addConnection',
        title: '',
        render: (_, row) => {
          return (
            !(row?.type === DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT && row?.extractionScriptSettings) && (
              <Flex justifyContent='flex-end' cursor='pointer'>
                <AddConnectionButton
                  isExtractionScript={row?.type === DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT}
                  onAddConnection={() => {
                    if (row?.type === DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT) {
                      setSelectedDataSourceId(row.id);
                      setIsConfigureExtractionModalOpen(true);
                    } else {
                      onAddConnection(row);
                    }
                  }}
                  dataInstance={COMPONENT_NAME}
                />
              </Flex>
            )
          );
        },
      },
    ]);
  }, [t]);

  return (
    <Box dataInstance={COMPONENT_NAME}>
      <Table
        {...otherProps}
        headers={headers}
        rows={rows}
        renderInnerTemplate={row => {
          return renderConnectionsTable(row, isConfigureExtractionModalOpen, handleConfigureExtractionModalClose);
        }}
        isRowExpandable={isRowExpandable}
        expandable
      />
      <ExtractionScriptModal
        isOpen={isConfigureExtractionModalOpen}
        handleClose={handleConfigureExtractionModalClose}
        dataSourceId={selectedDataSourceId}
      />
    </Box>
  );
};

export default DatasourcesTable;
