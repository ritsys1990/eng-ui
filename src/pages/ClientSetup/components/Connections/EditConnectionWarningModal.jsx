import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes, Spinner, Text, TextTypes } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY as BASE_TRANSLATION_KEY } from './constants';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';

const { EDIT_CONNECTION_WARNING_MODAL: COMPONENT_NAME } = ComponentNames;
const TRANSLATION_KEY = `${BASE_TRANSLATION_KEY}EditConnection_`;

const EditConnectionWarningModal = ({ isOpen, handleClose, handleSubmit }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      dataInstance={COMPONENT_NAME}
      size={ModalSizes.SMALL}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
    >
      <Spinner>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t(`${TRANSLATION_KEY}Title`)}
        </Text>
        <Text mb={20}>{t(`${TRANSLATION_KEY}Description`)}</Text>
      </Spinner>
    </Modal>
  );
};

EditConnectionWarningModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

EditConnectionWarningModal.defaultProps = {
  isOpen: false,
};

export default EditConnectionWarningModal;
