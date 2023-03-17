import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { COMPONENT_NAME } from '../constants/constants';

const DeleteOrgModal = props => {
  const { isOpen, handleClose, handleSubmit, orgDetails } = props;
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('Pages_Client_Setup_Step4_Domain_Delete_Org_Yes')}
      secondaryButtonText={t('Pages_Client_Setup_Step4_Delete_Org_Secondary_Button')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Pages_Client_Setup_Step4_Delete_Org')}
        </Text>
        <Text mb={20}>
          {t('Pages_Client_Setup_Step4_Confirm_Org_Delete')} {orgDetails?.name}{' '}
          {t('Pages_Client_Setup_Step4_Confirm_Delete_Org_Mapping')}
        </Text>
      </Box>
    </Modal>
  );
};

DeleteOrgModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

DeleteOrgModal.defaultProps = {
  isOpen: false,
};

export default DeleteOrgModal;
