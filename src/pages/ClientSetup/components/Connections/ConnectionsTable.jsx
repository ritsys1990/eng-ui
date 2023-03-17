import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconTypes,
  List,
  ListTypes,
  Spinner,
  Table,
  Text,
  TextTypes,
  Tooltip,
  TooltipPosition,
} from 'cortex-look-book';
import {
  ComponentNames,
  ConnectionsContextMenuOptions,
  CONNECTION_STATUS,
  CONNECTION_TYPES,
  DataSourceTypes,
  FileTransferType,
  TRANSLATION_KEY,
  ConnectionOptions,
} from './constants';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { CtaButton, CtaMenu, TestConnection } from './TableFields';
import { useSelector, useDispatch } from 'react-redux';
import { clientSelectors } from '../../../../store/client/selectors';
import { getClientDSConnections, setConnectionsAsDefault } from '../../../../store/client/actions';
import TestConnectionModal from './TestConnectionModal';
import AddConnectionModal from './AddConnectionModal';
import EditConnectionWarningModal from './EditConnectionWarningModal';
import DeleteConnectionModal from './DeleteConnectionModal';
import TestConnectionDetailsModal from './TestConnectionDetailsModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

const { CONNECTIONS_TABLE: COMPONENT_NAME } = ComponentNames;

export const renderStatus = t => status => {
  if (status === CONNECTION_STATUS.NOT_CONFIGURED) {
    return <Text type={TextTypes.BODY}>{t(`${TRANSLATION_KEY}Status_WaitingForClient`)}</Text>;
  }

  return <Text type={TextTypes.BODY}>{t(`${TRANSLATION_KEY}Status_Configured`)}</Text>;
};

export const renderName = t => (name, row) => {
  if (row.isDefault) {
    return <Text type={TextTypes.BODY}>{`${name} ${t(`${TRANSLATION_KEY}Default_Connection`)}`}</Text>;
  }

  return (
    <Text type={TextTypes.BODY} display='flex' alignItems='center'>
      {name}
      {row?.obsolete && (
        <Tooltip
          display='inline-block'
          direction={TooltipPosition.TOP}
          tooltipContent={t(`${TRANSLATION_KEY}ObsoleteConnection`)}
          width='200px'
          showOnHover
        >
          <Icon type={IconTypes.WARNING_NO_CIRCLE} height={28} width={28} ml={2} color='black' />
        </Tooltip>
      )}
    </Text>
  );
};

export const renderConnectionTestStatus = (t, setIsTestConnectionDetailModalOpen, setTestConnectionDetailMessage) => (
  isSuccess,
  connectionData
) => {
  const setTestConnectionDetailsOpen = () => {
    setIsTestConnectionDetailModalOpen(true);
    setTestConnectionDetailMessage(connectionData.latestTestMessage);
  };

  if (connectionData.status !== CONNECTION_STATUS.NOT_CONFIGURED) {
    if (isSuccess) {
      return (
        <Flex>
          <Icon type={IconTypes.SUCCESS} size={20} color='green' mr={5} />
          {t(`${TRANSLATION_KEY}ConnTableConnectionTestStatusSuccess`)}
        </Flex>
      );
    }

    return (
      <Flex>
        <Icon type={IconTypes.MINUS_CIRCLE} size={20} color='red' mr={5} />
        <Text type={TextTypes.BODY} mr={5}>
          {t(`${TRANSLATION_KEY}ConnTableConnectionTestStatusFailed`)}
        </Text>
        <Button cursor='pointer' type={TextTypes.LINK} onClick={setTestConnectionDetailsOpen}>
          {t(`${TRANSLATION_KEY}ConnTableConnectionTestStatusSeeDetails`)}
        </Button>
      </Flex>
    );
  }

  return null;
};

export const renderTime = (setIsTestModal, setResponse) => (value, connectionData) => {
  if (connectionData.status !== CONNECTION_STATUS.NOT_CONFIGURED) {
    return (
      <TestConnection props={connectionData} value={value} setIsTestModal={setIsTestModal} setResponse={setResponse} />
    );
  }

  return null;
};

export const renderCTA = (row, clickHandler, menuOptions) => {
  return (
    menuOptions.length > 0 && (
      <Flex justifyContent='flex-end' cursor='pointer'>
        <CtaButton
          onClick={e => {
            clickHandler(e, row);
          }}
          dataInstance={`${COMPONENT_NAME}-MoreOptions-${row?.id}`}
        />
      </Flex>
    )
  );
};

export const renderRequirements = (type, fileTransferMode, t) => {
  const requirements = [];
  if (type !== DataSourceTypes.CLIENT_FILE_SYSTEM) {
    requirements.push(
      `${t(`${TRANSLATION_KEY}Connection_RequirementsSourceTitle`)} ${t(
        `${TRANSLATION_KEY}Connection_RequirementsSourceDesc`
      )}`
    );
  }

  requirements.push(
    `${t(`${TRANSLATION_KEY}Connection_RequirementsExtractTitle`)} ${t(
      `${TRANSLATION_KEY}Connection_RequirementsExtractDesc`
    )}`
  );

  if (type !== DataSourceTypes.CLIENT_SOURCE || fileTransferMode !== FileTransferType.MANUAL) {
    requirements.push(
      `${t(`${TRANSLATION_KEY}Connection_RequirementsTransferTitle`)} ${t(
        `${TRANSLATION_KEY}Connection_RequirementsTransferDesc`
      )}`
    );
  }

  return <List type={ListTypes.ORDERED} items={requirements} />;
};

const ConnectionsTable = ({ connections, type, fileTransferMode, rowData, ...otherProps }) => {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [isTestModal, setIsTestModal] = useState(false);
  const [response, setResponse] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [ctaRef, setCtaRef] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] = useState(false);
  const [isEditWarningModalOpen, setIsEditWarningModalOpen] = useState(false);
  const [isEditConnection, setIsEditConnection] = useState(false);
  const [isTestConnectionDetailModalOpen, setIsTestConnectionDetailModalOpen] = useState(false);
  const [testConnectionDetailMessage, setTestConnectionDetailMessage] = useState('');
  const isSetingAsDefault = useSelector(clientSelectors.selectIsSettingConnectionAsDefault);
  const client = useSelector(clientSelectors.selectClient);
  const clientId = client?.id;
  const dispatch = useDispatch();

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  const handleClose = () => {
    dispatch(getClientDSConnections(clientId));
    setIsTestModal(false);
  };

  const handleCloseTestDetail = () => {
    setIsTestConnectionDetailModalOpen(false);
  };

  const handleWarningModalClose = () => {
    setIsEditWarningModalOpen(false);
  };

  const handleEditConnectionModalOpen = () => {
    setIsAddConnectionModalOpen(true);
    setIsEditWarningModalOpen(false);
    setIsEditConnection(true);
  };

  const handleAddConnectionModalClose = () => {
    setIsAddConnectionModalOpen(false);
    setIsEditConnection(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleTest = () => {
    return false;
  };

  const ctaMenuCloseHandler = () => {
    setCtaRef(null);
  };

  const ctaClickHandler = useCallback((e, connection) => {
    setSelectedConnection(connection);
    setCtaRef({ current: e.currentTarget });
  }, []);

  useEffect(() => {
    const options = [];
    if (checkPermissions(permissions, Permissions.CONNECTIONS, Actions.UPDATE)) {
      options.push({
        id: ConnectionOptions.EDIT,
        text: t(`Edit`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL),
      });
    }
    options.push({
      id: ConnectionsContextMenuOptions.SET_TRANSFER_DEFAULT,
      text: t(`${TRANSLATION_KEY}Set_Transfer_As_Default`),
    });
    if (checkPermissions(permissions, Permissions.CONNECTIONS, Actions.DELETE)) {
      options.push({
        id: ConnectionOptions.DELETE,
        text: t(`Delete`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL),
      });
    }

    if (
      t &&
      connections.filter(connection => connection?.secureAgentType?.toLowerCase() === CONNECTION_TYPES.TRANSFER)
        .length > 1 &&
      selectedConnection?.secureAgentType.toLowerCase() === CONNECTION_TYPES.TRANSFER &&
      !selectedConnection?.isDefault
    ) {
      setMenuOptions(options);
    } else {
      setMenuOptions(options?.filter(arr => arr.id !== ConnectionsContextMenuOptions.SET_TRANSFER_DEFAULT));
    }
  }, [t, selectedConnection, permissions]);

  useEffect(() => {
    setHeaders([
      { key: 'name', title: t(`${TRANSLATION_KEY}ConnTableConnectionName`), render: renderName(t) },
      { key: 'secureAgentType', title: t(`${TRANSLATION_KEY}ConnTableConnectionType`) },
      { key: 'status', title: t(`${TRANSLATION_KEY}ConnTableConnectionStatus`), render: renderStatus(t) },
      {
        key: 'latestOnlineStatus',
        title: t(`${TRANSLATION_KEY}ConnTableConnectionTestStatus`),
        render: renderConnectionTestStatus(t, setIsTestConnectionDetailModalOpen, setTestConnectionDetailMessage),
      },
      {
        key: 'latestTestTime',
        title: t(`${TRANSLATION_KEY}ConnTableLastTestDate`),
        render: renderTime(setIsTestModal, setResponse),
      },
      {
        key: '#cta',
        title: '',
        render: (_, row) => {
          return renderCTA(row, ctaClickHandler, menuOptions);
        },
      },
    ]);
  }, [t, ctaClickHandler, menuOptions]);

  const ctaOptionHandler = option => {
    switch (option.id) {
      case ConnectionsContextMenuOptions.SET_TRANSFER_DEFAULT:
        dispatch(setConnectionsAsDefault(selectedConnection?.id, clientId));
        break;
      case ConnectionOptions.EDIT:
        setIsEditWarningModalOpen(true);
        break;
      case ConnectionOptions.DELETE:
      default:
        setIsDeleteModalOpen(true);
        break;
    }
    setCtaRef(null);
  };

  return (
    <Spinner spinning={isSetingAsDefault}>
      <Box dataInstance={COMPONENT_NAME}>
        <Box>
          <Text mb={3} fontWeight='l'>
            {t(`${TRANSLATION_KEY}Connection_RequirementsTitle`)}
          </Text>
          <Text mb={9}>{renderRequirements(type, fileTransferMode, t)}</Text>
        </Box>
        <Table
          {...otherProps}
          headers={headers}
          rows={connections}
          sortBy='lastTestTime'
          sort='asc'
          emptyText={t(`${TRANSLATION_KEY}ConnTableEmpty`)}
        />
      </Box>
      <CtaMenu
        anchorRef={ctaRef}
        onClose={ctaMenuCloseHandler}
        options={menuOptions}
        onOptionClicked={ctaOptionHandler}
        dataInstance={COMPONENT_NAME}
      />
      <EditConnectionWarningModal
        isOpen={isEditWarningModalOpen}
        handleClose={handleWarningModalClose}
        rowData={selectedConnection}
        dataInstance={COMPONENT_NAME}
        handleSubmit={handleEditConnectionModalOpen}
      />
      <AddConnectionModal
        isOpen={isAddConnectionModalOpen}
        handleClose={handleAddConnectionModalClose}
        handleTest={handleTest}
        rowData={rowData}
        selectedConnection={selectedConnection}
        isEdit={isEditConnection}
        dataInstance={`${COMPONENT_NAME}-AddConnection`}
      />
      <DeleteConnectionModal
        isOpen={isDeleteModalOpen}
        handleClose={handleDeleteModalClose}
        dataSourceId={selectedConnection?.id}
        dataInstance={COMPONENT_NAME}
      />
      <TestConnectionModal
        handleClose={handleClose}
        isTestModal={isTestModal}
        response={response}
        dataInstance={`${COMPONENT_NAME}_Test_Connection`}
      />
      <TestConnectionDetailsModal
        isOpen={isTestConnectionDetailModalOpen}
        handleClose={handleCloseTestDetail}
        message={testConnectionDetailMessage}
        dataInstance={`${COMPONENT_NAME}-TestConnectionDetailsModal`}
      />
    </Spinner>
  );
};

export default ConnectionsTable;
