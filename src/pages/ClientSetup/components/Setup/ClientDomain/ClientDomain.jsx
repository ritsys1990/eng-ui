import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, ButtonTypes, Flex, IconTypes, Spinner, Table, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { useSelector } from 'react-redux';
import AddClientDomainModal from './AddClientDomainModal';
import DeleteClientDomainModal from './DeleteClientDomainModal';
import { COMPONENT_NAME } from './constants/constants';
import { getTableHeaders } from './utils/utils';
import { clientSelectors } from '../../../../../store/client/selectors';
import useCheckAuth from '../../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../../utils/permissionsHelper';

const ClientDomain = props => {
  const { t } = useTranslation();
  const { client } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteRow, setDeleteRow] = useState();
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdateClient, setCanUpdateClient] = useState(false);
  const isFetchingClient = useSelector(clientSelectors.selectFetchingClient);
  const isAddingDomain = useSelector(clientSelectors.selectAddingDomain);
  const isDeletingDomain = useSelector(clientSelectors.selectDeletingDomain);

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  useEffect(() => {
    const domains = client?.domains;
    setRows(domains?.map(domainName => ({ name: domainName })) || []);
  }, [client]);

  useEffect(() => {
    setIsLoading(isDeletingDomain || isAddingDomain || isFetchingClient);
  }, [isDeletingDomain, isAddingDomain, isFetchingClient]);

  useEffect(() => {
    setCanUpdateClient(checkPermissions(permissions, Permissions.CLIENT, Actions.UPDATE));
  }, [permissions]);

  const deleteDomain = useCallback(row => {
    setIsDelete(true);
    setDeleteRow(row);
  }, []);

  useEffect(() => {
    setHeaders(getTableHeaders(t, deleteDomain, canUpdateClient));
  }, [t, deleteDomain, canUpdateClient]);

  const onAddDomain = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsDelete(false);
  };

  return (
    <Spinner spinning={isLoading}>
      <Box width='100%' my={8} pl={80} dataInstance={`${COMPONENT_NAME}`}>
        <Box>
          <Text type={TextTypes.h4} fontWeight='m' mb={4} color='black'>
            {t('Pages_Client_Setup_Step1_Client_Domain_Title')}
          </Text>
          <Text type={TextTypes.BODY} pb={4} color='gray'>
            {t('Pages_Client_Setup_Step1_Client_Domain_Description')}
          </Text>
        </Box>
        {client?.domains?.length ? (
          <Box py={8}>
            <Table headers={headers} rows={rows} dataInstance={`${COMPONENT_NAME}`} />
          </Box>
        ) : (
          <Flex justifyContent='flex-start' py={8} dataInstance={`${COMPONENT_NAME}-No_Domains`}>
            <Text type={TextTypes.BODY}>{t('Pages_Client_Setup_Step1_Domain_No_Client_Domain')}</Text>
          </Flex>
        )}
        <Box>
          <Button
            type={ButtonTypes.LINK}
            icon={IconTypes.PLUS}
            iconWidth={24}
            onClick={() => onAddDomain()}
            dataInstance={`${COMPONENT_NAME}-AddDomain`}
            disabled={!canUpdateClient}
          >
            <Text type={TextTypes.H3}>{t('Pages_Client_Setup_Step1_Add_Client_Domain')}</Text>
          </Button>
        </Box>
        <AddClientDomainModal
          isOpen={isOpen}
          handleClose={handleClose}
          client={client}
          dataInstance={`${COMPONENT_NAME}-Add_Client_Domain`}
        />
        <DeleteClientDomainModal
          isOpen={isDelete}
          handleClose={handleClose}
          deleteRow={deleteRow}
          client={client}
          dataInstance={`${COMPONENT_NAME}-Delete_Client_Domain`}
        />
      </Box>
    </Spinner>
  );
};

export default ClientDomain;
