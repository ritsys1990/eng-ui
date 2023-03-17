import React from 'react';
import { Button, ButtonTypes, IconTypes } from 'cortex-look-book';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputAddLabel = () => {
  const { t } = useTranslation();

  const handleAddLabel = () => {
    return null;
  };

  return (
    <Button
      type={ButtonTypes.LINK}
      iconWidth={20}
      icon={IconTypes.PLUS}
      mr={20}
      onClick={handleAddLabel}
      dataInstance={`${PAGE_NAME}-AddLabel`}
    >
      {t('Pages_WorkpaperProcess_Output_AddLabel')}
    </Button>
  );
};

export default WpOutputAddLabel;
