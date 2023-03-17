import { Alert, AlertTypes, Box, Modal, Spinner, Table, Text, TextTypes } from 'cortex-look-book';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import { engagementSelectors } from '../../../../../../store/engagement/selectors';
import { provisionEngagements } from '../../../../../../store/engagement/actions';
import { addGlobalError } from '../../../../../../store/errors/actions';

const COMPONENT_NAME = 'ConnectToGlobalscapeModal';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_ConnectToGlobalscapeModal';

const ConnectToGlobalscapeModal = ({ isModalOpen, handleClose }) => {
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [notConnectedEngagements, setNotConnectedEngagements] = useState([]);
  const engagements = useSelector(engagementSelectors.selectClientEngagementList);
  const isProvisioningEngagements = useSelector(engagementSelectors.selectIsProvisioningEngagements);
  const [messageSent, setMessageSent] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onPrimaryButtonClick = () => {
    setError(null);
    dispatch(provisionEngagements(notConnectedEngagements)).then(response => {
      if (response instanceof Error) {
        setError(response);
      } else {
        dispatch(
          addGlobalError({
            type: AlertTypes.SUCCESS,
            message: t(`${TRANSLATION_KEY}_SuccessMessage`),
          })
        );
        setMessageSent(true);
        handleClose();
      }
    });
  };

  const onErrorClose = () => {
    setError(null);
  };

  useEffect(() => {
    setNotConnectedEngagements(engagements.filter(eng => !eng.efT_EXT_EngagementLink || !eng.efT_INT_EngagementLink));
  }, [engagements]);

  useEffect(() => {
    setHeaders([
      {
        title: t(`${TRANSLATION_KEY}_TableHeader`),
        key: 'name',
      },
    ]);
  }, [t]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      dataInstance={COMPONENT_NAME}
      primaryButtonText={t(`${TRANSLATION_KEY}_PrimaryButton`)}
      onPrimaryButtonClick={onPrimaryButtonClick}
      disablePrimaryButton={isProvisioningEngagements || messageSent}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onSecondaryButtonClick={handleClose}
    >
      {error && (
        <Alert
          message={error?.message}
          type={AlertTypes.ERROR}
          mb={5}
          id={`${COMPONENT_NAME}_Error`}
          onClose={onErrorClose}
          dataInstance={`${COMPONENT_NAME}-Error`}
        />
      )}
      <Spinner spinning={isProvisioningEngagements}>
        <Box mb={9}>
          <Text type={TextTypes.H2} fontWeight='l'>
            {t(`${TRANSLATION_KEY}_Title`)}
          </Text>
        </Box>
        <Box mb={9}>
          <Table headers={headers} rows={notConnectedEngagements} />
        </Box>
      </Spinner>
    </Modal>
  );
};

ConnectToGlobalscapeModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ConnectToGlobalscapeModal;
