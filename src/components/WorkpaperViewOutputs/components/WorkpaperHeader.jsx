import React from 'react';
import { Flex, Text, TextTypes } from 'cortex-look-book';
import LocalizedDate from '../../LocalizedDate/LocalizedDate';

const WorkpaperHeader = ({ wp }) => (
  <Flex>
    <Text width='315px' ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={37} fontWeight='m'>
      {wp.name}
    </Text>
    <Text width='150px' type={TextTypes.BODY}>
      <LocalizedDate date={wp.lastUpdated} />
    </Text>
  </Flex>
);

export default WorkpaperHeader;
