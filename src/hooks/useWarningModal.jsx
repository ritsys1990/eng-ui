import React, { useState } from 'react';
import { Text, TextTypes, Modal, ModalSizes } from 'cortex-look-book';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

/**
 * Simple reusable warning modal for easily user action confirmations.
 *
 * Returns object having:
 * renderWarningModal: put that somewhere in your component's render function
 * showWarningModal: function accepting text and callback.
 *
 * Modal will show and hide accordingly, no further options, be free to add your own.
 * have fun!
 */
const INITIAL_STATE = { show: false };

const useWarningModal = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(INITIAL_STATE);

  const showWarningModal = (message, action, saveToJe = false) => {
    const conf = { message, action, show: true, saveToJe };
    setConfig(conf);
  };

  const hideModal = () => {
    const conf = { ...config, show: false };
    setConfig(conf);
  };

  const runAction = () => {
    hideModal();
    config?.action && config.action(); // eslint-disable-line no-unused-expressions
  };

  const renderWarningModal = () => (
    <Modal
      isOpen={config?.show || false}
      onClose={hideModal}
      onPrimaryButtonClick={runAction}
      onSecondaryButtonClick={config?.saveToJe ? null : () => hideModal()}
      primaryButtonText={
        config?.saveToJe
          ? t('Upper_OK', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)
          : t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)
      }
      secondaryButtonText={t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.SMALL}
    >
      <Text type={TextTypes.BODY} my={6} sx={{ wordWrap: 'break-word' }}>
        {config?.message}
      </Text>
    </Modal>
  );

  return { renderWarningModal, showWarningModal };
};

export default useWarningModal;
