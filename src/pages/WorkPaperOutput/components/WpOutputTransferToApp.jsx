import React from 'react';
import { Button, ButtonTypes, IconTypes } from 'cortex-look-book';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputTransferToApp = () => {
  const { t } = useTranslation();

  const handleTrasfertoApp = () => {
    return null;
  };

  return (
    <Button
      type={ButtonTypes.LINK}
      iconWidth={20}
      icon={IconTypes.TRANSFER_TO_APP}
      iconColor='white'
      mr={20}
      onClick={handleTrasfertoApp}
      dataInstance={`${PAGE_NAME}-TransferToApp`}
    >
      {t('Pages_WorkpaperProcess_Output_TransferToApplication')}
    </Button>
  );
};

export default WpOutputTransferToApp;
