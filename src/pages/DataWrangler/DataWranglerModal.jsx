import React from 'react';
import { Modal, Text, TextTypes } from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';

const DataWranglerModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      secondaryButtonText='Close'
      onSecondaryButtonClick={onClose}
      onClickOutside={onClose}
      size='l'
      mb={5}
    >
      <Text type={TextTypes.H2} fontWeight='l' mb={5}>
        {t('pages_Trifacta_Alert_Info_Title')}
      </Text>
      <iframe
        src='/Trifacta_Steps_Full_Sample.pdf'
        id='learnMoreFrame'
        title={t('Pages_Trifacta_Iframe_Title')}
        frameBorder='0'
        width='100%'
        height='700px'
      />
    </Modal>
  );
};
export default DataWranglerModal;
