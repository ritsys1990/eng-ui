import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  Card,
  CardTypes,
  Container,
  Flex,
  GapSizes,
  GridView,
  HeaderBar,
  List,
  ListView,
  Modal,
  ModalSizes,
  Spinner,
  StateView,
  Text,
  TextTypes,
  ViewTypes,
  Tooltip,
  Icon,
  IconTypes,
} from 'cortex-look-book';
import useNavContext from '../../hooks/useNavContext';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuditDisclaimer from '../../components/AuditDisclaimer/AuditDisclaimer';
import LinkedOmniaEngModal from '../Omnia/components/LinkedOmniaEngModal';
import { getMyClientById } from '../../store/client/actions';
import { getMyEngagementsByClient } from '../../store/engagement/actions';
import { getEngagementListPermissions } from '../../store/security/actions';
import { getEntities, getStatus } from '../../utils/engagementHelper';
import { isDeloitte, isExternal } from '../../utils/securityHelper';
import useCheckAuth from '../../hooks/useCheckAuth';
import { PagePermissions, checkPermissions, Permissions, Actions } from '../../utils/permissionsHelper';
import WorkPaperViewOutputs from '../../components/WorkpaperViewOutputs/WorkpaperViewOutputs';
import { securitySelectors } from '../../store/security/selectors';
import { engagementSelectors } from '../../store/engagement/selectors';
import { clientSelectors } from '../../store/client/selectors';
import { ThemeContext } from 'styled-components';
import useTranslation from 'src/hooks/useTranslation';
import LocalizedDate from '../../components/LocalizedDate/LocalizedDate';

const PAGE_NAME = 'Client';
const TRANSLATION_KEY = 'Pages_Client_Engagement';

const Client = props => {
  const { crumbs } = useNavContext(props.match);
  const { clientId } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useContext(ThemeContext);

  const [entities, setEntities] = useState(null);
  const [engagementsToShow, setEngagementsToShow] = useState([]);
  const [contentType, setContentType] = useState(ViewTypes.LIST_VIEW);
  const [viewOutputs, setViewOutputs] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [linkedOmniaEngModal, setLinkedOmniaEngModal] = useState(false);
  const [cortexEngagementId, setCortexEngagementId] = useState(null);

  const me = useSelector(securitySelectors.selectMe);
  const client = useSelector(clientSelectors.selectClient);
  const isFetchingMyList = useSelector(clientSelectors.selectFetchingMyList);
  const engagements = useSelector(engagementSelectors.selectMyList);
  const isFetchingEngagements = useSelector(engagementSelectors.selectFetchingMyList);
  const dispatch = useDispatch();
  const { permissions, pagePermissions } = useCheckAuth({ useClientPermissions: true });
  const fetchingEngagementListPermision = useSelector(securitySelectors.selectFetchingEngagementListPermissions);
  const engagementListPermissions = useSelector(securitySelectors.selectEngagementListPermissions);

  useEffect(() => {
    if (!isFetchingEngagements && engagements && engagements.totalCount > 0) {
      const engagementIds = engagements.items.map(engagement => engagement.id);
      dispatch(getEngagementListPermissions(engagementIds, clientId));
    }
  }, [engagements]);

  const engagementFields = {
    fiscalYearEnd: t('Pages_Client_EngagementFields_FiscalYear'),
    status: t('Pages_Client_EngagementFields_Status'),
    entities: t('Pages_Client_EngagementFields_Entities'),
    outputs: t('Pages_Client_EngagementFields_WorkpaperOutputs'),
  };

  const handleClientSetup = () => {
    history.push(`/clients/${clientId}/setup`);
  };

  const handleSecondaryButton = () => {
    if (
      pagePermissions &&
      (pagePermissions[PagePermissions.CLIENT_SETUP_SETUP] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_APPLICATION_MAPPING] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_COMPONENT_MAPPING] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENTITIES] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENGAGEMENTS] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_CONNECTIONS] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DATA_SOURCES] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DETAILS] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_INFORMATICA] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_STAGING] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_USERS])
    ) {
      return () => handleClientSetup();
    }

    return null;
  };

  const hasEngagementPermission = engagementId => {
    const engagementPermissions = engagementListPermissions?.find(engagement => engagement.id === engagementId);

    return (
      engagementPermissions?.permissions[PagePermissions.ENGAGEMENT_ENGAGEMENT_DASHBOARD] ||
      engagementPermissions?.permissions[PagePermissions.ENGAGEMENT_USERS_DASHBOARD]
    );
  };

  const handleGoToEngagement = engagementId => {
    if (hasEngagementPermission(engagementId)) {
      history.push(`/engagements/${engagementId}`);
    }
  };

  const handleSearchChange = (value, filteredList) => {
    setEngagementsToShow(filteredList);
  };

  const onOpenOutputs = (id, e) => {
    e.stopPropagation();
    setSelectedEngagement(id);
    setViewOutputs(true);
  };

  useEffect(() => {
    dispatch(getMyClientById(clientId));
    dispatch(getMyEngagementsByClient(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    if (client && client.entities) {
      setEntities(client.entities);
    }
  }, [client]);

  useEffect(() => {
    if (client?.name) {
      document.title = `${client?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [client]);

  useEffect(() => {
    setEngagementsToShow(engagements.items ? engagements.items : []);
  }, [engagements]);

  const handleClose = updateEngagements => {
    setCortexEngagementId(null);
    setLinkedOmniaEngModal(false);
    if (!updateEngagements) {
      dispatch(getMyEngagementsByClient(clientId));
    }
  };

  const handleOpen = engagementId => {
    setLinkedOmniaEngModal(true);
    setCortexEngagementId(engagementId);
  };

  const headers = [
    {
      title: t('Pages_Client_PageTitle'),
      key: 'engagementsOverview',
      render: (name, row) => {
        return (
          <Box
            cursor={hasEngagementPermission(row.id) ? 'pointer' : 'default'}
            onClick={() => handleGoToEngagement(row.id)}
            dataInstance={`${PAGE_NAME}-Engagement-${row.id}`}
          >
            <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={50} fontWeight='m'>
              {row.name}
            </Text>
            <Text type={TextTypes.H4}>{getEntities(row, entities)}</Text>
          </Box>
        );
      },
      id: 1,
    },
    {
      title: engagementFields.fiscalYearEnd,
      key: 'fiscalYearEnd',
      render: (name, row) => (
        <Text
          cursor={hasEngagementPermission(row.id) ? 'pointer' : 'default'}
          onClick={() => handleGoToEngagement(row.id)}
          dataInstance={`${PAGE_NAME}-Engagement-${row.id}`}
        >
          {row.fiscalYearEnd ? <LocalizedDate date={row.fiscalYearEnd} /> : '-'}
        </Text>
      ),
      id: 2,
    },
    {
      title: engagementFields.status,
      key: 'fiscalYearEnd',
      render: (name, row) => (
        <Text
          cursor={hasEngagementPermission(row.id) ? 'pointer' : 'default'}
          onClick={() => handleGoToEngagement(row.id)}
          dataInstance={`${PAGE_NAME}-Engagement-${row.id}`}
        >
          {getStatus(row, isDeloitte(me))}
        </Text>
      ),
      id: 3,
    },
    {
      title: engagementFields.outputs,
      key: 'outputs',
      render: (name, row) => (
        <Box
          cursor={hasEngagementPermission(row.id) ? 'pointer' : 'default'}
          onClick={() => handleGoToEngagement(row.id)}
          dataInstance={`${PAGE_NAME}-Engagement-${row.id}`}
        >
          <Button type={ButtonTypes.LINK} onClick={e => onOpenOutputs(row.id, e)} dataInstance={`${PAGE_NAME}-Output`}>
            {t('Pages_Client_ViewOutputs')}
          </Button>
        </Box>
      ),
      id: 4,
    },
    {
      title: t('Pages_Client_OmniaLinked'),
      key: 'omniaLinked',
      render: (name, row) => (
        <Box ml={5} pt={3} pl={2}>
          <Tooltip
            showOnHover
            tooltipContent={t(`${TRANSLATION_KEY}_${row.linkedOmniaEngagements.length ? 'Linked' : 'Not_Linked'}`)}
            dataInstance={`${PAGE_NAME}-Omnia`}
          >
            <Icon
              type={IconTypes.OMNIA_LOGO}
              size={23}
              style={{ pointerEvents: row.linkedOmniaEngagements.length ? 'auto' : 'none' }}
              cursor={row.linkedOmniaEngagements.length ? 'pointer' : null}
              pointerEvents={row.linkedOmniaEngagements.length ? 'auto' : null}
              color={row.linkedOmniaEngagements.length ? 'blue' : 'gray2'}
              onClick={() => handleOpen(row.id)}
              dataInstance={`${PAGE_NAME}-Omnia`}
            />
          </Tooltip>
        </Box>
      ),
      id: 3,
    },
  ];

  const renderEngagements = () => {
    if (engagementsToShow && engagementsToShow.length > 0) {
      if (contentType === ViewTypes.TILE_VIEW) {
        return (
          <GridView gap={GapSizes.LARGE} itemsPerRow={3} width='100%' pt={5} mb={9} dataInstance={PAGE_NAME}>
            {engagementsToShow.map(engagement => {
              const dataSource = {
                fiscalYearEnd: engagement.fiscalYearEnd ? <LocalizedDate date={engagement.fiscalYearEnd} /> : '-',
                status: getStatus(engagement, isDeloitte(me)),
                entities: getEntities(engagement, entities),
                outputs: (
                  <Button
                    type={ButtonTypes.LINK}
                    onClick={e => onOpenOutputs(engagement.id, e)}
                    dataInstance={`${PAGE_NAME}-Output`}
                  >
                    {t('Pages_Client_ViewOutputs')}
                  </Button>
                ),
              };

              return (
                <Card
                  key={engagement.id}
                  type={CardTypes.DISPLAY}
                  title={
                    <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={40} fontWeight='m'>
                      {engagement.name}
                    </Text>
                  }
                  width='auto'
                  sx={{
                    borderLeft: '4px solid #000',
                  }}
                  onTitleClick={() => {
                    handleGoToEngagement(engagement.id);
                  }}
                  dataInstance={PAGE_NAME}
                >
                  <List type='properties' dataSource={dataSource} fields={engagementFields} />
                </Card>
              );
            })}
          </GridView>
        );
      }

      let tableHeaders = headers;

      if (isExternal(me) && !checkPermissions(permissions, Permissions.CLIENT_EXTERNAL_OUTPUTS, Actions.VIEW)) {
        tableHeaders = headers.filter(header => header.key !== 'outputs');
      }

      return <ListView headers={tableHeaders} rows={engagementsToShow} hasCursor={false} />;
    }

    return (
      <StateView
        dataInstance={PAGE_NAME}
        title={
          engagements && engagements.items && engagements.items.length === 0
            ? t('Pages_Client_NoEngagementMessage_First')
            : t('Pages_Client_NoEngagementMessage_EmptySearch')
        }
      />
    );
  };

  const renderClientPage = () => {
    if (isFetchingMyList) {
      return (
        <Spinner spinning size={theme.space[11]} pathSize={theme.space[2]} label=''>
          <Flex height='90vh' />
        </Spinner>
      );
    } else if (client) {
      return (
        <>
          <HeaderBar
            onViewChange={type => setContentType(type)}
            hideViewChange={false}
            currentView={contentType}
            onSecondaryButtonClick={isDeloitte(me) ? handleSecondaryButton() : null}
            secondaryButtonText={t('Pages_Client_HeaderBar_SecButtonText')}
            searchPlaceholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
            searchData={engagements.items ? engagements.items : []}
            onSearchChange={handleSearchChange}
            useSearchKey
            searchKey='name'
            crumbs={crumbs}
            crumbsStartFrom={0}
            dataInstance={PAGE_NAME}
          />
          <Container pt={12}>
            {contentType === ViewTypes.TILE_VIEW ? (
              <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray'>
                {t('Pages_Client_PageTitle')}
              </Text>
            ) : null}
            <Spinner spinning={isFetchingEngagements || fetchingEngagementListPermision}>{renderEngagements()}</Spinner>
            <Box pt={40} pb={40}>
              <AuditDisclaimer />
            </Box>

            {viewOutputs && (
              <Modal
                isOpen={viewOutputs}
                closable
                size={ModalSizes.EXTRA_LARGE}
                secondaryButtonText={t('Components_AddWorkpaperModal_Step1_Secondary')}
                onSecondaryButtonClick={() => setViewOutputs(false)}
                onClickOutside={() => setViewOutputs(false)}
                dataInstance={`${PAGE_NAME}-Output`}
              >
                <Box mb={10}>
                  <Text type={TextTypes.H1}>{t('Components_ViewOutputs_ModalHeader')}</Text>
                </Box>
                <WorkPaperViewOutputs id={selectedEngagement} />
              </Modal>
            )}
            <LinkedOmniaEngModal
              cortexEngagementId={cortexEngagementId}
              linkedOmniaEngModal={linkedOmniaEngModal}
              handleClose={handleClose}
              openFrom='engagement'
            />
          </Container>
        </>
      );
    }

    return null;
  };

  return renderClientPage();
};

export default Client;
