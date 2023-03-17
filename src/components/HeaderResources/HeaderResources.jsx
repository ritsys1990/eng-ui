import React, { useRef, useState } from 'react';
import { Box, Button, ButtonTypes, ContextMenu, Icon, IconTypes, Popover, PopoverOrigin } from 'cortex-look-book';
import env from 'env';
import { COMPONENT_NAME } from './constants/constants';
import useTranslation from 'src/hooks/useTranslation';

const HeaderResources = () => {
  const { t } = useTranslation();
  const containerRef = useRef();
  const [isContextOpen, setContextOpen] = useState(false);

  const MenuOptions = [{ id: '1', text: t('Components_HeaderResources_Menu') }];

  const handleButtonClick = () => {
    setContextOpen(true);
  };

  const handleOptionClicked = () => {
    window.open(env.JOURNALENTRYTESTING_URL);
  };

  return (
    <Box>
      <div ref={containerRef}>
        <Button type={ButtonTypes.FLAT} onClick={handleButtonClick} dataInstance={COMPONENT_NAME}>
          <Icon type={IconTypes.EXTERNAL_TAB} size={30} color='white' />
        </Button>
      </div>
      <Popover
        isOpen={isContextOpen}
        anchorRef={containerRef}
        anchorOriginX={PopoverOrigin.END}
        anchorOriginY={PopoverOrigin.END}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.START}
        onClose={() => setContextOpen(false)}
        dataInstance={COMPONENT_NAME}
        m={5}
        width={200}
      >
        <ContextMenu options={MenuOptions} onOptionClicked={handleOptionClicked} dataInstance={COMPONENT_NAME} />
      </Popover>
    </Box>
  );
};

export default HeaderResources;
