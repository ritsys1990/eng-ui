import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import { useDispatch } from 'react-redux';
import useTranslation from '../../../../../hooks/useTranslation';
import { deleteClientDomain, getClientById } from '../../../../../store/client/actions';
import { COMPONENT_NAME } from './constants/constants';

const DeleteClientDomainModal = props => {
  const { isOpen, handleClose, deleteRow, client } = props;
  const clientId = client?.id;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(deleteClientDomain(clientId, deleteRow)).then(() => {
      dispatch(getClientById(clientId));
    });
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleClose();
      }}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('Pages_Client_Setup_Step1_Domain_Delete_Domain_Yes')}
      secondaryButtonText={t('Pages_Client_Setup_Step1_Domain_Secondary_Button')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Pages_Client_Setup_Step1_Delete_Client_Domain')}
        </Text>
        <Text mb={20}>{t('Pages_Client_Setup_Step1_Domain_Delete_Domain_Confirm')}</Text>
      </Box>
    </Modal>
  );
};

DeleteClientDomainModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

DeleteClientDomainModal.defaultProps = {
  isOpen: false,
};

export default DeleteClientDomainModal;
