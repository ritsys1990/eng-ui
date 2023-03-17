import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';

const TestConnectionModal = props => {
  const { handleClose, isTestModal, response } = props;
  const { t } = useTranslation();
  const COMPONENT_NAME = 'Test_Connection_Modal';

  return (
    <Modal
      onClose={handleClose}
      isOpen={isTestModal}
      onSecondaryButtonClick={handleClose}
      secondaryButtonText={t('Components_ClientSetupConnections_Test_Modal_Secondary_Button')}
      dataInstance={`${COMPONENT_NAME}`}
      size={ModalSizes.SMALL}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Components_ClientSetupConnections_Test_Result_Title')} {response[0]}
        </Text>
        <Text mb={20} sx={{ wordBreak: 'break-word' }}>
          {response[1]}
        </Text>
      </Box>
    </Modal>
  );
};

TestConnectionModal.propTypes = {
  isTestModal: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

TestConnectionModal.defaultProps = {
  isTestModal: false,
};

export default TestConnectionModal;
