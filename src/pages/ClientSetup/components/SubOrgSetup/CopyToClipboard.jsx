import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../hooks/useTranslation';
import { COMPONENT_NAME } from './constants/constants';

const CopyToClipboard = props => {
  const { isOpen, handleClose, title, desc } = props;
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      secondaryButtonText={t('Pages_Client_Setup_Step4_Copy_To_Clipboard_Secondary_Button')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {title}
        </Text>
        <Text mb={20}>{desc}</Text>
      </Box>
    </Modal>
  );
};

CopyToClipboard.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

CopyToClipboard.defaultProps = {
  isOpen: false,
};

export default CopyToClipboard;
