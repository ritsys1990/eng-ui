import React, { useState, useRef } from 'react';
import { ButtonTypes, Button, Popover, PopoverOrigin, Text, TextTypes, Box, List, ListTypes } from 'cortex-look-book';

export const COMPONENT_NAME = 'CL_PIPELINES_LISTPOPOVER';

const ListPopover = ({ title, children, sumarizeContent }) => {
  const container = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onClick = () => {
    setIsOpen(true);
  };

  return (
    <Box ref={container} dataInstance={`${COMPONENT_NAME}-ListPopover`}>
      <Button type={ButtonTypes.LINK} m={3} onClick={onClick} dataInstance={`${COMPONENT_NAME}-ListPopover`}>
        {sumarizeContent}
      </Button>
      <Popover
        isOpen={isOpen}
        anchorRef={container}
        anchorOriginX={PopoverOrigin.START}
        anchorOriginY={PopoverOrigin.END}
        originX={PopoverOrigin.START}
        originY={PopoverOrigin.START}
        mt={5}
        onClose={onClose}
        dataInstance={`${COMPONENT_NAME}-ListPopover`}
      >
        <Box m={8}>
          <Text type={TextTypes.BODY} fontWeight='m' mb={2}>
            {title}
          </Text>
          <List type={ListTypes.UNORDERED} items={children} listStyle='none' />
        </Box>
      </Popover>
    </Box>
  );
};

export default ListPopover;
