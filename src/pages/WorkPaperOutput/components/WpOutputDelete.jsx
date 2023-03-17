import React from 'react';
import { Button, ButtonTypes, IconTypes } from 'cortex-look-book';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputDelete = () => {
  const { t } = useTranslation();

  const handleDelete = () => {
    return null;
  };

  return (
    <Button
      type={ButtonTypes.LINK}
      iconWidth={20}
      icon={IconTypes.DELETE}
      mr={20}
      onClick={handleDelete}
      dataInstance={`${PAGE_NAME}-Delete`}
    >
      {t('Pages_WorkpaperProcess_Output_Delete')}
    </Button>
  );
};

export default WpOutputDelete;
