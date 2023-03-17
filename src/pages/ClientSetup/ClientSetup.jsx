import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { Accordion, AccordionTypes, Box, Container, Flex, HeaderBar, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useNavContext from '../../hooks/useNavContext';
import { PAGE_NAME } from './constants/constants';
import { getClientExternalRecertificationStatus, getClientRecertificationStatus } from '../../store/security/actions';
import { getClientById, resetOrg } from '../../store/client/actions';
import { securitySelectors } from '../../store/security/selectors';
import { isDeloitte } from '../../utils/securityHelper';
import { Actions, checkPermissions, PagePermissions, Permissions } from '../../utils/permissionsHelper';
import { clientSelectors } from '../../store/client/selectors';
import Engagement from './components/Engagement/Engagement';
import Setup from './components/Setup/Setup';
import useTranslation from '../../hooks/useTranslation';
import { Entities } from './components/Entities/Entities';
import DataSources from './components/DataSources/DataSources';
import Connections from './components/Connections/Connections';
import { SubOrgSetup } from './components/SubOrgSetup/SubOrgSetup';
import { hasPagePermissions, getStepStatus, isFirstNotCompletedStep, getStepTitle } from './utils/ClientSetup.utils';
import { getEngagementsByClient } from '../../store/engagement/actions';
import HeaderTabs from './components/HeaderTabs/HeaderTabs';
import useCheckAuth from '../../hooks/useCheckAuth';
import { isEmpty } from 'lodash';
import { addGlobalError } from '../../store/errors/actions';
import { isLegacyMode } from '../../utils/legacyUtils';

const ClientSetup = props => {
  const { t } = useTranslation();
  const { match } = props;
  const { crumbs } = useNavContext(match);
  const { clientId } = useParams();
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const me = useSelector(securitySelectors.selectMe);
  const client = useSelector(clientSelectors.selectClient);
  const isFetchingMyList = useSelector(clientSelectors.selectFetchingMyList);
  const isFetchingClient = useSelector(clientSelectors.selectFetchingClient);
  const isFetchingClientPermissions = useSelector(securitySelectors.selecGettingClientPermissions);
  const clientSetupStatus = useSelector(clientSelectors.selectClientSetupState);

  const [hasStep1Permissions, setHasStep1Permissions] = useState(false);
  const [hasStep2Permissions, setHasStep2Permissions] = useState(false);
  const [hasStep3Permissions, setHasStep3Permissions] = useState(false);
  const [hasStep4Permissions, setHasStep4Permissions] = useState(false);
  const [hasStep5Permissions, setHasStep5Permissions] = useState(false);
  const [hasStep6Permissions, setHasStep6Permissions] = useState(false);

  const { pagePermissions, permissions } = useCheckAuth({ useClientPermissions: true });

  const hasUpdatedPermissions = () => {
    return (
      hasStep1Permissions !== undefined &&
      hasStep2Permissions !== undefined &&
      hasStep3Permissions !== undefined &&
      hasStep4Permissions !== undefined &&
      hasStep5Permissions !== undefined &&
      hasStep6Permissions !== undefined
    );
  };

  useEffect(() => {
    if (checkPermissions(permissions, Permissions.ENGAGEMENTS, Actions.VIEW)) {
      dispatch(getEngagementsByClient(clientId));
    }
    if (checkPermissions(permissions, Permissions.CLIENT_RECERTIFY, Actions.VIEW)) {
      dispatch(getClientRecertificationStatus(clientId));
    }
    if (checkPermissions(permissions, Permissions.CLIENT_EXTERNAL_ACKNOWLEDGE, Actions.VIEW)) {
      dispatch(getClientExternalRecertificationStatus(clientId));
    }
  }, [dispatch, clientId, permissions]);

  useEffect(() => {
    setHasStep1Permissions(pagePermissions[PagePermissions.CLIENT_SETUP_SETUP]);
    setHasStep2Permissions(pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENTITIES]);
    setHasStep3Permissions(pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENGAGEMENTS]);
    setHasStep4Permissions(pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_INFORMATICA]);
    setHasStep5Permissions(pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DATA_SOURCES]);
    setHasStep6Permissions(pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_CONNECTIONS]);
  }, [pagePermissions]);

  useEffect(() => {
    if (client?.name) {
      document.title = `${client?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [client, t]);

  useEffect(() => {
    dispatch(getClientById(clientId, false)).catch(error => {
      if (error.code !== 401) {
        dispatch(addGlobalError(error));
      }
    });

    return () => {
      dispatch(resetOrg());
    };
  }, [dispatch, clientId]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderView = () => {
    if (isEmpty(pagePermissions)) {
      return null;
    }

    if (!isDeloitte(me) || !hasPagePermissions(pagePermissions, PagePermissions)) {
      return (
        <Box pt={12} dataInstance={`${PAGE_NAME}-NoPermissions`}>
          <Container>
            <Text>{t('Pages_Clients_NoPermissions')}</Text>
          </Container>
        </Box>
      );
    }

    if (isDeloitte(me) && hasPagePermissions(pagePermissions, PagePermissions) && hasUpdatedPermissions()) {
      return (
        <>
          <HeaderBar
            hideViewChange
            onSearchChange={null}
            searchKey=''
            noLinks={isLegacyMode}
            crumbs={crumbs}
            crumbsStartFrom={0}
            dataInstance={`${PAGE_NAME}`}
            searchPlaceholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
          >
            {!isLegacyMode && (
              <Flex justifyContent='space-between'>
                <HeaderTabs />
              </Flex>
            )}
          </HeaderBar>

          {client && client.id === clientId && (
            <Container pt={isLegacyMode ? 0 : 12} pb={15}>
              {!isLegacyMode && (
                <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray' mb={8}>
                  {t('Pages_Client_HeaderBar_SecButtonText')}
                </Text>
              )}
              <Accordion
                isOpened={isFirstNotCompletedStep(clientSetupStatus, 1) && hasStep1Permissions}
                type={AccordionTypes.LARGE}
                dataInstance={`${PAGE_NAME}-Step1`}
                header={getStepTitle(1, t, !hasStep1Permissions, client?.usesSecureAgent)}
                status={getStepStatus(clientSetupStatus.isStep1Completed)}
                disabled={!hasStep1Permissions}
              >
                {hasStep1Permissions && <Setup dataInstance={`${PAGE_NAME}-setup`} />}
              </Accordion>
              <Accordion
                isOpened={isFirstNotCompletedStep(clientSetupStatus, 2) && hasStep2Permissions}
                type={AccordionTypes.LARGE}
                dataInstance={`${PAGE_NAME}-Step2`}
                header={getStepTitle(2, t, !hasStep2Permissions, client?.usesSecureAgent)}
                status={getStepStatus(clientSetupStatus.isStep2Completed)}
                disabled={!hasStep2Permissions}
              >
                {hasStep2Permissions && <Entities />}
              </Accordion>
              <Accordion
                isOpened={isFirstNotCompletedStep(clientSetupStatus, 3) && hasStep3Permissions}
                type={AccordionTypes.LARGE}
                dataInstance={`${PAGE_NAME}-Step3`}
                header={getStepTitle(3, t, !hasStep3Permissions, client?.usesSecureAgent)}
                status={getStepStatus(clientSetupStatus.isStep3Completed)}
                disabled={!hasStep3Permissions}
              >
                {hasStep3Permissions && <Engagement />}
              </Accordion>
              {client?.usesSecureAgent && (
                <Accordion
                  isOpened={isFirstNotCompletedStep(clientSetupStatus, 4) && hasStep4Permissions}
                  type={AccordionTypes.LARGE}
                  dataInstance={`${PAGE_NAME}-Step4`}
                  header={getStepTitle(4, t, !hasStep4Permissions, client?.usesSecureAgent)}
                  status={getStepStatus(clientSetupStatus.isStep4Completed)}
                  disabled={!hasStep4Permissions}
                >
                  {hasStep4Permissions && <SubOrgSetup />}
                </Accordion>
              )}
              {client?.usesSecureAgent && (
                <Accordion
                  isOpened={isFirstNotCompletedStep(clientSetupStatus, 5) && hasStep5Permissions}
                  type={AccordionTypes.LARGE}
                  dataInstance={`${PAGE_NAME}-Step5`}
                  header={getStepTitle(5, t, !hasStep5Permissions, client?.usesSecureAgent)}
                  status={getStepStatus(clientSetupStatus.isStep5Completed)}
                  disabled={!hasStep5Permissions}
                >
                  {hasStep5Permissions && <DataSources clientId={clientId} />}
                </Accordion>
              )}
              {client?.usesSecureAgent && (
                <Accordion
                  isOpened={isFirstNotCompletedStep(clientSetupStatus, 6) && hasStep6Permissions}
                  type={AccordionTypes.LARGE}
                  dataInstance={`${PAGE_NAME}-Step6`}
                  header={getStepTitle(6, t, !hasStep6Permissions, client?.usesSecureAgent)}
                  status={getStepStatus(clientSetupStatus.isStep6Completed)}
                  disabled={!hasStep6Permissions}
                >
                  {hasStep6Permissions && <Connections clientId={clientId} />}
                </Accordion>
              )}
            </Container>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Spinner
      spinning={isFetchingMyList || isFetchingClient || isFetchingClientPermissions || !hasUpdatedPermissions()}
      overlayOpacity={0.7}
      height='100vh'
      size={theme.space[11]}
      pathSize={theme.space[2]}
      dataInstance={`${PAGE_NAME}`}
    >
      {renderView()}
    </Spinner>
  );
};

export default ClientSetup;
