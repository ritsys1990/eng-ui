import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Tag, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants';
import { noop } from '../../../../utils/errorHelper';

export const FileIndicator = ({ fileName, isNameCanClose = true, label, onDeleteFile }) => {
  return (
    <Box>
      {label && (
        <Text type={TextTypes.H4} fontWeight='m' mb={2}>
          {label}
        </Text>
      )}
      <Flex flexWrap='wrap' justifyContent='flex-start' alignItems='center' width='100%' minHeight='36px'>
        <Tag isClosable={isNameCanClose} onClose={onDeleteFile} dataInstance={COMPONENT_NAME}>
          {fileName}
        </Tag>
      </Flex>
    </Box>
  );
};

FileIndicator.propTypes = {
  fileName: PropTypes.string,
  isNameCanClose: PropTypes.bool,
  label: PropTypes.string,
  onDeleteFile: PropTypes.func,
};

FileIndicator.defaultProps = {
  fileName: '',
  isNameCanClose: true,
  label: '',
  onDeleteFile: noop,
};
