import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text } from 'cortex-look-book';
import useTranslation from '../../../../hooks/useTranslation';

import { ComponentNames } from './constants';

const { TEST_CONNECTION_DETAILS_MODAL: COMPONENT_NAME } = ComponentNames;

const TestConnectionDetailsModal = ({ isOpen, handleClose, message }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleClose}
      primaryButtonText={t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Secondary_Button')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Box mb={10}>
        <Text mb={25}>{message}</Text>
      </Box>
    </Modal>
  );
};

TestConnectionDetailsModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

TestConnectionDetailsModal.defaultProps = {
  isOpen: false,
};

export default TestConnectionDetailsModal;
