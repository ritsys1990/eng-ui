import React, { useState, useRef } from 'react';
import { Box, ContextMenu, Flex, Icon, IconTypes, Popover, PopoverOrigin, Text, TextTypes } from 'cortex-look-book';
import { flatMap } from 'lodash';

const COMPONENT_NAME = 'WorkbookNav';

const WorkbookNav = ({ workbooks, view, onViewChange, dataInstance }) => {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const views = flatMap(workbooks, x =>
    x.views.map(v => ({ ...v, workbookId: x.workbookId, id: `${x.id}-${v.name}` }))
  );
  const onClickHandler = () => {
    setIsOpen(true);
  };

  const onOptionClickHandler = option => {
    const { value } = option;
    if (onViewChange) {
      onViewChange(value);
    }
    setIsOpen(false);
  };

  const menuOptions = views.map(v => ({ text: v.name, id: v.id, value: v }));

  return (
    <Box display='inline-block' dataInstance={`${dataInstance}_${COMPONENT_NAME}`} cursor='pointer'>
      <Flex ref={ref} alignItems='center' onClick={onClickHandler}>
        <Text type={TextTypes.H1}>{view?.name}</Text>
        <Icon type={IconTypes.CHEVRON_DOWN} size={25} ml={2} />
      </Flex>
      <Popover
        isOpen={isOpen}
        anchorRef={ref}
        anchorOriginX={PopoverOrigin.START}
        anchorOriginY={PopoverOrigin.END}
        originX={PopoverOrigin.START}
        originY={PopoverOrigin.START}
        onClose={() => setIsOpen(false)}
        mt={5}
        width={400}
        maxHeight='40vh'
        overflowY='auto'
      >
        <ContextMenu
          options={menuOptions}
          onOptionClicked={onOptionClickHandler}
          dataInstance={COMPONENT_NAME}
          sx={{ overflowWrap: 'break-word' }}
        />
      </Popover>
    </Box>
  );
};

export default WorkbookNav;
