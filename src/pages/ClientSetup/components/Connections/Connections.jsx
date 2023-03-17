import React, { useState, useEffect } from 'react';
import { Spinner, Text } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { clientSelectors } from 'src/store/client/selectors';
import { getClientDSConnections, getAllPublishedConnTemp, setConnectionsAsDefault } from 'src/store/client/actions';
import { ComponentNames, TRANSLATION_KEY, SECURE_AGENT_TYPES } from './constants';
import useTranslation from 'src/hooks/useTranslation';
import DataSourcesTable from './DataSourcesTable';
import AddConnectionModal from './AddConnectionModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

const { MAIN: COMPONENT_NAME } = ComponentNames;

// eslint-disable-next-line sonarjs/cognitive-complexity
const Connections = props => {
  const { clientId } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const dataSources = useSelector(clientSelectors.selectDSConnections);
  const isFetchingDataSources = useSelector(clientSelectors.selectIsFetchingDSConnections);
  const isTesting = useSelector(clientSelectors.selectIsTestingConnection);
  const { permissions } = useCheckAuth({ useClientPermissions: true });

  useEffect(() => {
    dispatch(getClientDSConnections(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    if (dataSources.length) {
      const filteredDataSources = dataSources.filter(
        dataSource =>
          dataSource.connections.length > 0 &&
          dataSource.connections.filter(e => e.secureAgentType === SECURE_AGENT_TYPES.TRANSFER).length > 1
      );
      if (filteredDataSources.length > 0) {
        filteredDataSources.forEach(dataSource => {
          const connections = dataSource?.connections?.filter(
            conn => conn.secureAgentType === SECURE_AGENT_TYPES.TRANSFER
          );
          if (connections.length > 0 && connections.every(connection => !connection.isDefault)) {
            connections.sort((a, b) => new Date(a.statusChangedTime) - new Date(b.statusChangedTime));
            dispatch(setConnectionsAsDefault(connections[0]?.id, clientId));
          }
        });
      }
    }
  }, [dataSources]);

  // API call to fetch the connection templates which is published to use it in Add connection modal
  // It has been called here as the data is pulled at once from here and manipulate it in the Add Connection modal
  // so that no need to call it every time when we load the modal
  useEffect(() => {
    if (checkPermissions(permissions, Permissions.CONNECTOR_TEMPLATES, Actions.VIEW)) {
      dispatch(getAllPublishedConnTemp());
    }
  }, [dispatch, permissions]);

  // close handler for the add connection modal
  const handleClose = () => {
    setIsAddConnectionModalOpen(false);
  };

  // test handler for the add connection modal
  const handleTest = () => {
    return false;
  };

  // handler to open the add connection modal
  const onAddConnection = row => {
    setRowData(row);
    setIsAddConnectionModalOpen(true);
  };

  return (
    <Spinner dataInstance={COMPONENT_NAME} spinning={isFetchingDataSources || isTesting} pl={90}>
      <Text color='gray' mb={8}>
        {t(`${TRANSLATION_KEY}Instructions`)}
      </Text>
      {dataSources?.length > 0 ? (
        <DataSourcesTable
          dataInstance={`${COMPONENT_NAME}-Table`}
          dataSources={dataSources}
          onAddConnection={onAddConnection}
        />
      ) : (
        <Text dataInstance={`${COMPONENT_NAME}-EmptyState`} textAlign='center' p={8}>
          {t(`${TRANSLATION_KEY}Empty`)}
        </Text>
      )}
      <AddConnectionModal
        isOpen={isAddConnectionModalOpen}
        handleClose={handleClose}
        handleTest={handleTest}
        rowData={rowData}
        dataInstance={`${COMPONENT_NAME}-AddConnection`}
      />
    </Spinner>
  );
};

export default Connections;
