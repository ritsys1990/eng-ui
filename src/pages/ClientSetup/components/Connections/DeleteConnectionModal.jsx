import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes, Spinner, Text, TextTypes } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY as BASE_TRANSLATION_KEY } from './constants';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { deleteConnection } from '../../../../store/engagement/actions';
import { getClientDSConnections } from '../../../../store/client/actions';
import { clientSelectors } from '../../../../store/client/selectors';

const { DELETE_CONNECTION_MODAL: COMPONENT_NAME } = ComponentNames;
const TRANSLATION_KEY = `${BASE_TRANSLATION_KEY}DeleteConnection_`;

const DeleteConnectionModal = ({ isOpen, handleClose, dataSourceId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const client = useSelector(clientSelectors.selectClient);
  const isDeletingConnection = useSelector(engagementSelectors.selectIsDeletingConnection);

  const handleDeleteConfig = () => {
    dispatch(deleteConnection(dataSourceId)).then(() => {
      dispatch(getClientDSConnections(client?.id));
      handleClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      dataInstance={COMPONENT_NAME}
      size={ModalSizes.SMALL}
      disablePrimaryButton={isDeletingConnection}
      disableSecondaryButton={isDeletingConnection}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onPrimaryButtonClick={handleDeleteConfig}
      onSecondaryButtonClick={handleClose}
    >
      <Spinner spinning={isDeletingConnection} label={t(`${TRANSLATION_KEY}Deleting`)}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t(`${TRANSLATION_KEY}Title`)}
        </Text>
        <Text mb={20}>{t(`${TRANSLATION_KEY}Description`)}</Text>
      </Spinner>
    </Modal>
  );
};

DeleteConnectionModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

DeleteConnectionModal.defaultProps = {
  isOpen: false,
};

export default DeleteConnectionModal;
