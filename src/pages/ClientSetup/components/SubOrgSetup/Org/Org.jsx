import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, ButtonTypes, Flex, IconTypes, Link, Spinner, Table, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { COMPONENT_NAME } from '../constants/constants';
import { getOrgHeaders, getOrgRows } from '../utils/utils';
import { createClientOrg, linkToExistingOrg, deleteClientOrg } from '../../../../../store/client/actions';
import { clientSelectors } from '../../../../../store/client/selectors';
import DeleteOrgModal from './DeleteOrgModal';
import LinkToOrg from './LinkToOrgModal';
import CopyToClipboard from '../CopyToClipboard';
import copy from 'copy-to-clipboard';
import useCheckAuth from '../../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../../utils/permissionsHelper';

const Org = props => {
  const { orgDetails, client, setOrgEnabled } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isCreatingOrg = useSelector(clientSelectors.selectIsCreatingOrg);
  const isDeletingOrg = useSelector(clientSelectors.selectisDeletingOrg);
  const isGettingOrg = useSelector(clientSelectors.selectIsGettingOrg);
  const isLinkingOrg = useSelector(clientSelectors.selectIsLinkingOrg);
  const [orgHeaders, setOrgHeaders] = useState([]);
  const [orgRows, setOrgRows] = useState([]);
  const [isDeleteOrg, setIsDeleteOrg] = useState(false);
  const [isLinkToOrg, setIsLinkToOrg] = useState(false);
  const [isCopied, setisCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  const deleteOrg = useCallback(() => {
    setIsDeleteOrg(true);
  }, [orgDetails]);

  const copyOrg = useCallback(orgUUID => {
    if (copy(orgUUID, { message: 'Press #{key} to copy' })) {
      setisCopied(true);
    }
  }, []);

  const addOrg = () => {
    dispatch(createClientOrg(client?.id)).then(orgs => {
      setOrgRows(getOrgRows(orgs));
      setOrgEnabled(true);
    });
    setIsDeleteOrg(false);
  };

  const linkOrg = () => {
    setIsLinkToOrg(true);
  };

  useEffect(() => {
    setIsLoading(isCreatingOrg || isGettingOrg || isDeletingOrg || isLinkingOrg);
  }, [isCreatingOrg, isGettingOrg, isDeletingOrg, isLinkingOrg]);

  useEffect(() => {
    if (orgDetails?.orgId && client) {
      setOrgEnabled(true);
      setOrgRows(getOrgRows(orgDetails));
    }
    setOrgHeaders(getOrgHeaders(t, permissions, deleteOrg, copyOrg));
  }, [t, permissions, deleteOrg, copyOrg, orgDetails, client]);

  const handleClose = () => {
    setIsDeleteOrg(false);
    setIsLinkToOrg(false);
    setisCopied(false);
  };

  const handleSubmit = () => {
    setIsDeleteOrg(false);
    setIsLinkToOrg(false);
    dispatch(deleteClientOrg(client?.id)).then(() => {
      setOrgRows(getOrgRows([]));
      setOrgEnabled(false);
    });
  };

  const handleLinkToOrg = (orgName, clientId) => {
    dispatch(linkToExistingOrg(orgName, clientId)).then(orgs => {
      setOrgRows(getOrgRows(orgs));
      setOrgEnabled(true);
    });
    setIsLinkToOrg(false);
  };

  return (
    <Spinner spinning={isLoading} overlayOpacity={0.7}>
      <Text type={TextTypes.BODY} pb={4} color='gray'>
        {t('Pages_Client_Setup_Step4_Sub_Org_Description')}
      </Text>

      <Box mb={25} dataInstance={`${COMPONENT_NAME}-Org`}>
        <Text type={TextTypes.h4} fontWeight='m' mb={4}>
          {t('Pages_Client_Setup_Step4_Config_Org_Title')}
        </Text>

        {!checkPermissions(permissions, Permissions.ORGS, Actions.ADD) && (
          <Text type={TextTypes.BODY} py={2}>
            {t('Pages_Client_Setup_Secure_Agent_Installation_Team')}
            <Link
              external
              to={`mailto:${t('Components_HeaderHelp_SupportModal_Client_Email')}`}
              dataInstance={COMPONENT_NAME}
            >
              {t('Pages_Client_Setup_Secure_Agent_Installation_Link')}
            </Link>
          </Text>
        )}

        <Box py={8}>
          <Table headers={orgHeaders} rows={orgRows} dataInstance={`${COMPONENT_NAME}`} />
        </Box>
        {orgRows.length === 0 && checkPermissions(permissions, Permissions.ORGS, Actions.ADD) && (
          <Box>
            <Flex justifyContent='space-between'>
              <Button
                type={ButtonTypes.LINK}
                icon={IconTypes.PLUS}
                iconWidth={24}
                onClick={addOrg}
                dataInstance={`${COMPONENT_NAME}-Add_New_Org`}
              >
                {t('Pages_Client_Setup_Step4_Add_New_Org_Button')}
              </Button>
              <Button
                type={ButtonTypes.LINK}
                icon={IconTypes.PLUS}
                iconWidth={24}
                onClick={linkOrg}
                dataInstance={`${COMPONENT_NAME}-Link_Org`}
              >
                {t('Pages_Client_Setup_Step4_Link_To_Org_Button')}
              </Button>
            </Flex>
          </Box>
        )}
      </Box>

      <DeleteOrgModal
        isOpen={isDeleteOrg}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        orgDetails={orgDetails}
        dataInstance={`${COMPONENT_NAME}-Delete_Org`}
      />
      <LinkToOrg
        isOpen={isLinkToOrg}
        handleClose={handleClose}
        handleLinkToOrg={handleLinkToOrg}
        client={client}
        dataInstance={`${COMPONENT_NAME}-Link_To_Org`}
      />
      <CopyToClipboard
        isOpen={isCopied}
        handleClose={handleClose}
        title={t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Org_Title')}
        desc={t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Org_Desc')}
        dataInstance={`${COMPONENT_NAME}-Copy_To_Clipboard`}
      />
    </Spinner>
  );
};

export default Org;
