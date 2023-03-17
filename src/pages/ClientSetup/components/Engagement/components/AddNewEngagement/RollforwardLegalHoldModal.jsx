import React from 'react';
import PropTypes from 'prop-types';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import { Icon, IconTypes, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import { Flex } from 'reflexbox';

const COMPONENT_NAME = 'RollforwardLegalHoldModal';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement_LegalHold';

const RollforwardLegalHoldModal = ({ isOpen, onClose, onOk }) => {
  const { t } = useTranslation();

  return (
    <Modal
      size={ModalSizes.SMALL}
      isOpen={isOpen}
      onClose={onClose}
      onSecondaryButtonClick={onClose}
      secondaryButtonText={t(`Cancel`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onPrimaryButtonClick={onOk}
      primaryButtonText={t(`Ok`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      dataInstance={COMPONENT_NAME}
    >
      <Flex alignItems='center' mb={9}>
        <Icon type={IconTypes.WARNING} mr={5} size={30} color='yellow' />
        <Text type={TextTypes.H2}>{t(`${TRANSLATION_KEY}_Title`)}</Text>
      </Flex>

      <Text type={TextTypes.BODY} mb={4}>
        {t(`${TRANSLATION_KEY}_Description`)}
      </Text>
    </Modal>
  );
};

RollforwardLegalHoldModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default RollforwardLegalHoldModal;
