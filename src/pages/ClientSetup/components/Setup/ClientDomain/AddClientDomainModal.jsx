import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import AddClientDomain from './AddClientDomain';
import { COMPONENT_NAME } from './constants/constants';

const AddClientDomainModal = props => {
  const { isOpen, handleClose, client } = props;
  const formRef = useRef();
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (((formRef || {}).current || {}).submit) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('Pages_Client_Setup_Step1_Domain_Primary_Button')}
      secondaryButtonText={t('Pages_Client_Setup_Step1_Domain_Secondary_Button')}
      size={ModalSizes.MEDIUM}
      dataInstance={`${COMPONENT_NAME}`}
    >
      <AddClientDomain
        ref={formRef}
        client={client}
        handleClose={handleClose}
        dataInstance={`${COMPONENT_NAME}-Add_Client_Domain`}
      />
    </Modal>
  );
};

AddClientDomainModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

AddClientDomainModal.defaultProps = {
  isOpen: false,
};

export default AddClientDomainModal;
