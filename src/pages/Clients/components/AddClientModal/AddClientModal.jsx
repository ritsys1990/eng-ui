import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes } from 'cortex-look-book';
import { useSelector } from 'react-redux';
import AddClientForm from './AddClientForm';
import { securitySelectors } from '../../../../store/security/selectors';
import { Constants, COMPONENT_NAME } from './constants';
import { clientSelectors } from '../../../../store/client/selectors';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

const AddClientModal = props => {
  const { isOpen, handleClose } = props;
  const { t } = useTranslation();

  const formRef = useRef();
  const me = useSelector(securitySelectors.selectMe);
  const permissions = useSelector(securitySelectors.selectPermissions);
  const isLoading = useSelector(clientSelectors.selectCreateClientLoading);
  const [isCreatingClientStorage, setIsCreatingClientStorage] = useState(false);
  const { add: isGlobalClientPermission } = permissions.permissions.globalClient;
  const memberFirmCode = me.memberFirmCode ? me.memberFirmCode : Constants.defaultMemberFirmCode;

  const handleSubmit = () => {
    if (((formRef || {}).current || {}).submit) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading && !isCreatingClientStorage) {
          handleClose();
        }
      }}
      onClickOutside={() => {}}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('Add', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      disablePrimaryButton={isLoading || isCreatingClientStorage}
      disableSecondaryButton={isLoading || isCreatingClientStorage}
      size={ModalSizes.MEDIUM}
      dataInstance={COMPONENT_NAME}
    >
      <AddClientForm
        isLoading={isLoading || isCreatingClientStorage}
        ref={formRef}
        memberFirmCode={memberFirmCode}
        setIsCreatingClientStorage={setIsCreatingClientStorage}
        isCreatingClientStorage={isCreatingClientStorage}
        isGlobalClientPermission={isGlobalClientPermission}
      />
    </Modal>
  );
};

AddClientModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

AddClientModal.defaultProps = {
  isOpen: false,
};

export default AddClientModal;
