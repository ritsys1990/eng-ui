import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, ButtonTypes, Flex, IconTypes, Spinner, Table, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { COMPONENT_NAME } from '../constants/constants';
import { getSubOrgHeaders } from '../utils/utils';
import CreateEditSubOrgModal from './CreateEditSubOrgModal';
import CopyToClipboard from '../CopyToClipboard';
import copy from 'copy-to-clipboard';
import { clientSelectors } from '../../../../../store/client/selectors';
import SubOrgContextMenu from './SubOrgContextMenu';
import DeleteSubOrgModal from './DeleteSubOrgModal';
import { generateToken } from '../../../../../store/client/actions';

const SubOrg = props => {
  const { client, orgId, isOrgEnabled } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isCreatingSubOrg = useSelector(clientSelectors.selectIsCreatingSubOrg);
  const isDeletingSubOrg = useSelector(clientSelectors.selectIsDeletingSubOrg);
  const isUpdatingSubOrg = useSelector(clientSelectors.selectIsUpdatingSubOrg);
  const isFetchingClient = useSelector(clientSelectors.selectFetchingClient);
  const isGettingOrg = useSelector(clientSelectors.selectIsGettingOrg);
  const isGeneratingToken = useSelector(clientSelectors.selectIsGeneratingToken);
  const orgDetails = useSelector(clientSelectors.selectOrg);

  const [subOrgRows, setSubOrgRows] = useState([]);
  const [subOrgHeaders, setsubOrgHeaders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUUIDCopied, setIsUUIDCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [isDeleteSubOrg, setIsDeleteSubOrg] = useState(false);
  const [selectedRow, setSeletedRow] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenCopied, setIsTokenCopied] = useState(false);

  const copySubOrg = useCallback(orgUUID => {
    if (copy(orgUUID, { message: 'Press #{key} to copy' })) {
      setIsUUIDCopied(true);
    }
  }, []);

  const copyToken = useCallback(token => {
    if (copy(token, { message: 'Press #{key} to copy' })) {
      setIsTokenCopied(true);
    }
  }, []);

  const handleContextMenuClick = useCallback((event, row) => {
    setIsMenuOpen(true);
    setContextButtonRef({ current: event.target });
    setSeletedRow(row);
  }, []);

  useEffect(() => {
    setIsLoading(
      isCreatingSubOrg || isDeletingSubOrg || isUpdatingSubOrg || isGettingOrg || isGeneratingToken || isFetchingClient
    );
  }, [isCreatingSubOrg, isDeletingSubOrg, isUpdatingSubOrg, isGettingOrg, isGeneratingToken, isFetchingClient]);

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (orgDetails?.orgId && orgDetails?.subOrgs?.length > 0) {
      setSubOrgRows(orgDetails?.subOrgs);
    } else {
      setSubOrgRows([]);
    }
  }, [orgDetails, client]);

  const generateSubOrgToken = useCallback(
    (subOrgId, id) => {
      dispatch(generateToken(subOrgId, id));
    },
    [generateToken, orgId]
  );

  useEffect(() => {
    setsubOrgHeaders(
      getSubOrgHeaders(t, client?.entities, generateSubOrgToken, copySubOrg, handleContextMenuClick, copyToken, orgId)
    );
  }, [t, client, generateToken, copySubOrg, handleContextMenuClick, copyToken, orgId]);

  const handleSubOrg = () => {
    setIsOpen(true);
    setSeletedRow([]);
    setIsCreating(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsUUIDCopied(false);
    setIsDeleteSubOrg(false);
    setIsTokenCopied(false);
  };

  const onEditSubOrgMenu = row => {
    setSeletedRow(row);
    setIsOpen(true);
    setIsCreating(false);
  };

  const onDeleteSubOrgMenu = row => {
    setSeletedRow(row);
    setIsDeleteSubOrg(true);
  };

  const onRegnerateToken = () => {
    setIsMenuOpen(false);
  };

  return (
    <Spinner spinning={isLoading} overlayOpacity={0.7}>
      <SubOrgContextMenu
        orgId={orgId}
        isOpen={isMenuOpen}
        buttonRef={contextButtonRef}
        onClose={handleMenuClose}
        onEditSubOrgMenu={onEditSubOrgMenu}
        onRegnerateToken={onRegnerateToken}
        onDeleteSubOrgMenu={onDeleteSubOrgMenu}
        row={selectedRow}
        dataInstance={`${COMPONENT_NAME}_SubOrg_Context_Menu`}
      />
      <Text type={TextTypes.h4} fontWeight='m' mb={4}>
        {t('Pages_Client_Setup_Step4_Config_Sub_Orgs_Title')}
      </Text>

      <Box dataInstance={`${COMPONENT_NAME}-Sub-Org`} mb={4}>
        {subOrgRows?.length > 0 && isOrgEnabled ? (
          <Table headers={subOrgHeaders} rows={subOrgRows} dataInstance={`${COMPONENT_NAME}`} />
        ) : (
          <Flex justifyContent='flex-start' py={8} dataInstance={`${COMPONENT_NAME}-No-SubOrg`}>
            <Text type={TextTypes.BODY} fontWeight='s'>
              {t('Pages_Client_Setup_Step4_Config_No_Sub_Orgs_Desc')}
            </Text>
          </Flex>
        )}
      </Box>

      {isOrgEnabled && (
        <Button
          type={ButtonTypes.LINK}
          icon={IconTypes.PLUS}
          iconWidth={24}
          onClick={handleSubOrg}
          dataInstance={`${COMPONENT_NAME}_Add_SubOrg`}
        >
          <Text type={TextTypes.H3}>{t('Pages_Client_Setup_Step1_Add_SubOrg')}</Text>
        </Button>
      )}

      <CreateEditSubOrgModal
        client={client}
        isOpen={isOpen}
        orgId={orgId}
        isCreating={isCreating}
        selectedRow={selectedRow}
        dataInstance={`${COMPONENT_NAME}_Create_Edit_SubOrg`}
        handleClose={handleClose}
      />
      <DeleteSubOrgModal
        isOpen={isDeleteSubOrg}
        orgId={orgId}
        handleClose={handleClose}
        clientId={client?.id}
        selectedRow={selectedRow}
        dataInstance={`${COMPONENT_NAME}_Delete_SubOrg`}
      />
      <CopyToClipboard
        isOpen={isUUIDCopied || isTokenCopied}
        handleClose={handleClose}
        dataInstance={`${COMPONENT_NAME}-Copy_To_Clipboard_SubOrg`}
        title={
          isUUIDCopied
            ? t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Suborg_Title')
            : t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Token_Title')
        }
        desc={
          isUUIDCopied
            ? t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Suborg_Desc')
            : t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Token_Desc')
        }
      />
    </Spinner>
  );
};

export default SubOrg;
