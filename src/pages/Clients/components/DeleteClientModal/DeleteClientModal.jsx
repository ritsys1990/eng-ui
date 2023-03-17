import React from 'react';
import { Modal, ModalSizes, Spinner, Text } from 'cortex-look-book';
import { useSelector, useDispatch } from 'react-redux';
import { clientSelectors } from '../../../../store/client/selectors';
import { deleteClient } from '../../../../store/client/actions';
import { COMPONENT_NAME } from './constants';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

const DeleteClientModal = props => {
  const { isOpen, onClose, clientId } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const isDeletingClient = useSelector(clientSelectors.selectIsDeletingClient);

  const handleDeleteClient = () => {
    dispatch(deleteClient(clientId)).then(() => {
      onClose();
    });
  };

  return (
    <Modal
      size={ModalSizes.SMALL}
      isOpen={isOpen}
      primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      disablePrimaryButton={isDeletingClient}
      disableSecondaryButton={isDeletingClient}
      onPrimaryButtonClick={handleDeleteClient}
      onSecondaryButtonClick={onClose}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isDeletingClient} label={t('Pages_Clients_DeleteClientSpinner')}>
        <Text pb={6}>{t('Pages_Clients_DeleteClient')}</Text>
      </Spinner>
    </Modal>
  );
};

export default DeleteClientModal;
