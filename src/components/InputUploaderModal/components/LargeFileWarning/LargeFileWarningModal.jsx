import React from 'react';
import { Modal, ModalSizes, Text } from 'cortex-look-book';
import env from 'env';
import { Header } from '../Header/Header';
import { convertBytes } from '../../../../utils/fileHelper';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

const COMPONENT_NAME = 'LargeFileWarning';

const LargeFileWarningModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      dataInstance={COMPONENT_NAME}
      isOpen={isOpen}
      onClose={onClose}
      onPrimaryButtonClick={onClose}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.SMALL}
    >
      <Header titleText={t('Pages_WorkpaperProcess_Step1_LargeFileWarningModal_Title')} />
      <br />
      <Text>
        {t('Pages_WorkpaperProcess_Step1_LargeFileWarningModal_Description').replace(
          '{size}',
          `${convertBytes(env.FILE_UPLOAD_MAX_BYTES)}`
        )}
      </Text>
      <br />
      <Text>
        <strong>{t('Pages_WorkpaperProcess_Step1_LargeFileWarningModal_NoteTitle')}</strong>
        {t('Pages_WorkpaperProcess_Step1_LargeFileWarningModal_NoteDescription')}
      </Text>
    </Modal>
  );
};

export default LargeFileWarningModal;
