import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes, Spinner, Text, TextTypes } from 'cortex-look-book';
import {
  DELETE_MODAL_COMPONENT_NAME as COMPONENT_NAME,
  DELETE_MODAL_TRANSLATION_KEY as TRANSLATION_KEY,
} from './constants/constants';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntity } from '../../../../store/client/actions';
import { clientSelectors } from '../../../../store/client/selectors';

const DeleteEntityModal = ({ isModalOpen, handleClose, onRemoveFromDom, clientId, entityId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isDeletingEntity = useSelector(clientSelectors.selectIsDeletingEntity);

  const handleDeleteEntity = () => {
    dispatch(deleteEntity(clientId, entityId)).then(() => {
      handleClose();
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      dataInstance={COMPONENT_NAME}
      onRemoveFromDom={onRemoveFromDom}
      size={ModalSizes.SMALL}
      disablePrimaryButton={isDeletingEntity}
      disableSecondaryButton={isDeletingEntity}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onPrimaryButtonClick={handleDeleteEntity}
      onSecondaryButtonClick={handleClose}
    >
      <Spinner spinning={isDeletingEntity} label={t(`${TRANSLATION_KEY}_Deleting`)}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t(`${TRANSLATION_KEY}_Title`)}
        </Text>
        <Text mb={20}>{t(`${TRANSLATION_KEY}_Description`)}</Text>
      </Spinner>
    </Modal>
  );
};

DeleteEntityModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  onRemoveFromDom: PropTypes.func,
};

DeleteEntityModal.defaultProps = {
  isModalOpen: false,
  onRemoveFromDom: null,
};

export default DeleteEntityModal;
