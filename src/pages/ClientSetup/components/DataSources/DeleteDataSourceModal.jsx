import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes, Spinner, Text, TextTypes } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY as BASE_TRANSLATION_KEY } from './constants';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDataSource } from '../../../../store/client/actions';
import { clientSelectors } from '../../../../store/client/selectors';

const { DELETE_DATASOURCE_MODAL: COMPONENT_NAME } = ComponentNames;
const TRANSLATION_KEY = `${BASE_TRANSLATION_KEY}DeleteDataSource_`;

const DeleteDataSourceModal = ({ isOpen, onClose, onRemoveFromDom, dataSource }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isDeletingDataSource = useSelector(clientSelectors.selectIsDeletingDataSource);

  const handleDeleteDataSource = () => {
    dispatch(deleteDataSource(dataSource)).then(() => {
      onClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dataInstance={COMPONENT_NAME}
      onRemoveFromDom={onRemoveFromDom}
      size={ModalSizes.SMALL}
      disablePrimaryButton={isDeletingDataSource}
      disableSecondaryButton={isDeletingDataSource}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onPrimaryButtonClick={handleDeleteDataSource}
      onSecondaryButtonClick={onClose}
    >
      <Spinner spinning={isDeletingDataSource} label={t(`${TRANSLATION_KEY}Deleting`)}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t(`${TRANSLATION_KEY}Title`)}
        </Text>
        <Text mb={20}>{t(`${TRANSLATION_KEY}Description`)}</Text>
      </Spinner>
    </Modal>
  );
};

DeleteDataSourceModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRemoveFromDom: PropTypes.func,
};

DeleteDataSourceModal.defaultProps = {
  isOpen: false,
  onRemoveFromDom: null,
};

export default DeleteDataSourceModal;
