import React from 'react';
import { Flex, Text, TextTypes, Box } from 'cortex-look-book';
import PropTypes from 'prop-types';
import useTranslation from '../../../hooks/useTranslation';
import { COMPONENT_NAME } from '../constants/constants';

const ChildWorkPaperHeader = ({ wp }) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex
        justifyContent='space-between'
        dataInstance={`${COMPONENT_NAME}-ChildWorkPaperHeader`}
        alignItems='center'
        fontSize='s'
        mt='-10'
      >
        <Text textAlign='left' type={TextTypes.H3}>
          <Flex>
            {t('Components_Child_Workpaper_Text_Name')}{' '}
            <Box color='gray' ml='2'>
              {' '}
              {wp?.name}{' '}
            </Box>
          </Flex>
        </Text>
      </Flex>
    </>
  );
};

ChildWorkPaperHeader.propTypes = {
  wp: PropTypes.object,
};

ChildWorkPaperHeader.defaultProps = {
  wp: {},
};

export default ChildWorkPaperHeader;
