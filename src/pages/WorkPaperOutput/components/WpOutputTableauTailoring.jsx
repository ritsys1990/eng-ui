import React from 'react';
import { Button, ButtonTypes, IconTypes } from 'cortex-look-book';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputTableauTailoring = () => {
  const { t } = useTranslation();

  const handleTableauTailoring = () => {
    return null;
  };

  return (
    <Button
      type={ButtonTypes.LINK}
      iconWidth={20}
      icon={IconTypes.ADD_FILE}
      iconColor='white'
      mr={20}
      onClick={handleTableauTailoring}
      dataInstance={`${PAGE_NAME}-TableauTailoring`}
    >
      {t('Pages_WorkpaperProcess_Output_TableauTailoring')}
    </Button>
  );
};

export default WpOutputTableauTailoring;
