import { Modal, Text, ModalSizes, TextTypes } from 'cortex-look-book';
import React from 'react';
import PropTypes from 'prop-types';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';

const COMPONENT_NAME = 'RejectionReasonModal';
const TRANSLATION_KEY = 'Components_ClientSetupDataSources_RejectionModal';

const RejectionReasonModal = ({ isOpen, onClose, subscription }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onPrimaryButtonClick={onClose}
      primaryButtonText={t(`Ok`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      dataInstance={COMPONENT_NAME}
      size={ModalSizes.MEDIUM}
    >
      <Text type={TextTypes.H2} mb={9}>
        <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
      </Text>
      <Text type={TextTypes.BODY} mb={4}>
        {subscription?.statusChangedBy}&nbsp;{t(`${TRANSLATION_KEY}_Line1`)}
      </Text>
      <Text type={TextTypes.BODY} mb={4}>
        <Text display='inline' fontWeight='l'>
          {t(`${TRANSLATION_KEY}_Line2`)}
        </Text>
        &nbsp;{subscription?.rejectionReason}
      </Text>
    </Modal>
  );
};

RejectionReasonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subscription: PropTypes.object,
};

RejectionReasonModal.defaultProps = {
  subscription: {},
};

export default RejectionReasonModal;
