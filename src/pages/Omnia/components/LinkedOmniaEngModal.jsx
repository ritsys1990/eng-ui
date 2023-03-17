import React, { useEffect, useState } from 'react';
import {
  Box,
  ListView,
  Container,
  Modal,
  ModalSizes,
  Spinner,
  StateView,
  Text,
  TextTypes,
  Tooltip,
  Icon,
  IconTypes,
  Alert,
  Intent,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { USER_ROLE } from '../constants/constants';
import { getBriefLinkedOmniaEngagements, unlinkOmniaEngagement } from '../../../store/dataExchange/actions';
import { dataExchangeSelectors } from '../../../store/dataExchange/selectors';
import { engagementSelectors } from '../../../store/engagement/selectors';
import { securitySelectors } from '../../../store/security/selectors';

export const COMPONENT_NAME = 'LinkedOmniaEngModal';

// eslint-disable-next-line sonarjs/cognitive-complexity
const LinkedOmniaEngModal = ({ linkedOmniaEngModal, handleClose, cortexEngagementId, openFrom }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deleteOmniaEngagement, setDeleteOmniaEngagement] = useState(false);
  const [deleteOmniaEngId, setDeleteOmniaEngId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [omniaEngagementName, setOmniaEngagementName] = useState('');
  const { clientId } = useParams();
  const linkedOmniaEngagements = useSelector(dataExchangeSelectors.linkedOmniaEngagements);
  const isFetchingLinkedOmniaEngagements = useSelector(dataExchangeSelectors.isFetchingLinkedOmniaEngagements);
  const isUnlinkedOmniaEngagement = useSelector(dataExchangeSelectors.isUnlinkedOmniaEngagement);
  const roles = useSelector(securitySelectors.selectMeRoles);
  const engagements =
    openFrom === 'engagement'
      ? useSelector(engagementSelectors.selectMyList).items
      : useSelector(engagementSelectors.selectClientEngagementList);

  const deleteMessage = t('Pages_Client_Engagement_DeleteOmniaEngagementMessage').replace(
    'omniaEngagementName',
    `${omniaEngagementName}`
  );

  useEffect(() => {
    if (cortexEngagementId && linkedOmniaEngModal) {
      dispatch(getBriefLinkedOmniaEngagements(cortexEngagementId));
    }
  }, [linkedOmniaEngModal, cortexEngagementId]);

  const deleteEngagement = row => {
    setDeleteOmniaEngId(row.omniaEngagementId);
    setOmniaEngagementName(row.omniaEngagementName);
    setDeleteOmniaEngagement(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOmniaEngagement(false);
  };

  const handleDelete = async () => {
    const engagement = engagements.find(eng => eng.id === cortexEngagementId);

    const data = {
      cortexEngagementId,
      omniaEngagementId: deleteOmniaEngId,
      matNumber: engagement?.matNumber,
    };

    const result = await dispatch(unlinkOmniaEngagement(data));
    setDeleteOmniaEngagement(false);
    if (result) {
      dispatch(getBriefLinkedOmniaEngagements(cortexEngagementId));
    } else {
      setIsAlertOpen(true);
    }
  };

  const isAdmin = () => {
    if (roles && cortexEngagementId) {
      const engagement = roles.engagements.find(eng => eng.id === cortexEngagementId);
      const isEngagementAdmin = engagement && engagement.roles.some(role => role.name === USER_ROLE.ENGAGEMENT_ADMIN);
      const clientSetup = roles.clients.find(client => client.id === clientId);
      const isClientSetupAdmin =
        clientSetup && clientSetup.roles.some(role => role.name === USER_ROLE.CLIENT_SETUP_ADMIN);

      return isEngagementAdmin || isClientSetupAdmin;
    }

    return false;
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };
  const handleOmniaModalClose = () => {
    setIsAlertOpen(false);
    handleClose(linkedOmniaEngagements?.length);
  };

  const headers = [
    {
      title: t('Pages_Client_Engagement_LinkedOmniaEngagementsName'),
      key: 'omniaEngagementId',
      render: (name, row) => {
        return (
          <Box>
            {row.isReadyForDeletion ? (
              <Text fontWeight='m' color={row.isReadyForDeletion ? '' : 'gray2'}>
                {row.omniaEngagementName}
              </Text>
            ) : (
              <Tooltip
                showOnHover
                tooltipContent={t('Pages_Client_Engagement_TooltipMessage')}
                dataInstance={`${COMPONENT_NAME}`}
              >
                <Text fontWeight='m' color={row.isReadyForDeletion ? '' : 'gray2'}>
                  {row.omniaEngagementName}
                </Text>
              </Tooltip>
            )}
          </Box>
        );
      },
      id: 1,
    },
    {
      title: '',
      key: 'isReadyForDeletion',
      render: (name, row) => {
        return (
          <Box ml={5} pt={3} pl={2}>
            {isAdmin() ? (
              <Tooltip
                showOnHover
                tooltipContent={
                  row.isReadyForDeletion
                    ? t('Pages_Client_Engagement_DeleteOmniaEngagementModalTitle')
                    : t('Pages_Client_Engagement_TooltipMessage')
                }
                dataInstance={`${COMPONENT_NAME}`}
              >
                <Icon
                  type={IconTypes.CROSS}
                  size={23}
                  style={{ pointerEvents: row.isReadyForDeletion ? 'auto' : 'none' }}
                  cursor={row.isReadyForDeletion ? 'pointer' : null}
                  pointerEvents={row.isReadyForDeletion ? 'auto' : null}
                  color={row.isReadyForDeletion ? 'red' : 'gray2'}
                  onClick={() => deleteEngagement(row)}
                  dataInstance={`${COMPONENT_NAME}_isReadyForDeletion`}
                />
              </Tooltip>
            ) : null}
          </Box>
        );
      },
      id: 2,
    },
  ];

  return (
    <Container>
      <Modal
        isOpen={linkedOmniaEngModal}
        onClose={handleOmniaModalClose}
        size={ModalSizes.MEDIUM}
        onSecondaryButtonClick={handleOmniaModalClose}
        secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        dataInstance={`${COMPONENT_NAME}_linkedOmniaModal`}
      >
        {isAlertOpen && (
          <Alert
            type={Intent.ERROR}
            mb={5}
            message={t('Pages_Client_Engagement_Response_False')}
            onClose={() => handleAlertClose()}
            dataInstance={COMPONENT_NAME}
          />
        )}
        <Spinner spinning={isFetchingLinkedOmniaEngagements}>
          {linkedOmniaEngagements?.length ? (
            <>
              <Box>
                <Text type={TextTypes.H1}>{t('Pages_Client_Engagement_LinkedOmniaEngagements')}</Text>
              </Box>
              <ListView
                headers={headers}
                rows={linkedOmniaEngagements}
                hasCursor={false}
                dataInstance={`${COMPONENT_NAME}_List`}
              />{' '}
            </>
          ) : (
            <StateView title={t('Pages_Client_Engagement_StateView_NoOmniaEngagements')} />
          )}
        </Spinner>
      </Modal>

      <Modal
        isOpen={deleteOmniaEngagement}
        size={ModalSizes.SMALL}
        onSecondaryButtonClick={handleCloseDeleteModal}
        onPrimaryButtonClick={handleDelete}
        primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        secondaryButtonText={t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        dataInstance={`${COMPONENT_NAME}_deleteOmniaModal`}
      >
        <Spinner spinning={isUnlinkedOmniaEngagement}>
          <Box mb={10}>
            <Text type={TextTypes.H1}>{t('Pages_Client_Engagement_DeleteOmniaEngagementModalTitle')}</Text>
          </Box>
          <Text mb={5}>{deleteMessage}</Text>
        </Spinner>
      </Modal>
    </Container>
  );
};
export default LinkedOmniaEngModal;
