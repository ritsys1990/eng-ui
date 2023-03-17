import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { COMPONENT_NAME } from '../constants/constants';
import { deleteSubOrg } from '../../../../../store/client/actions';
import { useDispatch } from 'react-redux';

const DeleteSubOrgModal = props => {
  const { isOpen, handleClose, clientId, selectedRow } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(deleteSubOrg(clientId, selectedRow.id));
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('Pages_Client_Setup_Step4_Domain_Delete_Org_Yes')}
      secondaryButtonText={t('Pages_Client_Setup_Step4_Delete_Org_Secondary_Button')}
      size={ModalSizes.SMALL}
      dataInstance={`${COMPONENT_NAME}_SubOrg_Delete`}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Pages_Client_Setup_Step4_Delete_Suborg_Title')}
        </Text>
        <Text mb={20}>
          {t('Pages_Client_Setup_Step4_Confirm_Org_Delete')} {selectedRow.name}
          {t('Pages_Client_Setup_Step4_Confirm_Delete_Suborg')}
        </Text>
      </Box>
    </Modal>
  );
};

DeleteSubOrgModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

DeleteSubOrgModal.defaultProps = {
  isOpen: false,
};

export default DeleteSubOrgModal;
