import React, { useState } from 'react';
import { Box, Button, ButtonTypes, ContextMenu, IconTypes, Popover, PopoverOrigin } from 'cortex-look-book';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputSaveTo = () => {
  const { t } = useTranslation();

  const [contextSaveToRef, setContextSaveToRef] = useState({ current: null });
  const [isOpenSaveTo, setIsOpenSaveTo] = useState(false);

  const handleSaveTo = e => {
    setContextSaveToRef({ current: e.target });
    setIsOpenSaveTo(true);
  };

  const handleNavToOutput = () => {
    return null;
  };

  const renderContentNavMenu = () => {
    const options = [
      { id: 'DL', text: t('Pages_WorkpaperProcess_Output_SaveTo_DL') },
      { id: 'SQL', text: t('Pages_WorkpaperProcess_Output_SaveTo_SQL') },
    ];

    return <ContextMenu options={options} onOptionClicked={handleNavToOutput} dataInstance={`${PAGE_NAME}-SaveTo`} />;
  };

  return (
    <Box display='inline-block'>
      <Button
        type={ButtonTypes.LINK}
        iconWidth={20}
        icon={IconTypes.SAVE}
        mr={20}
        onClick={handleSaveTo}
        dataInstance={`${PAGE_NAME}-SaveTo`}
      >
        {t('Pages_WorkpaperProcess_Output_SaveTo')}
      </Button>

      <Popover
        isOpen={isOpenSaveTo}
        anchorRef={contextSaveToRef}
        anchorOriginY={PopoverOrigin.END}
        onClose={() => setIsOpenSaveTo(false)}
        mt={4}
      >
        {renderContentNavMenu()}
      </Popover>
    </Box>
  );
};

export default WpOutputSaveTo;
