import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from '../../../../../../hooks/useTranslation';
import { Box, Flex, TextTypes, Text, RadioGroup } from 'cortex-look-book';
import { noop } from '../../../../../../utils/errorHelper';
import { getAddNewDMOptions } from '../../../utils/DataModelsHelper';

const AddDataModelOptions = props => {
  const { value, onSelected, dataInstance } = props;
  const { t } = useTranslation();

  const options = getAddNewDMOptions(t);

  return (
    <Box width='100%'>
      <Flex>
        <Text type={TextTypes.H2} fontWeight='s' dataInstance={`${dataInstance}-Header`}>
          {t('Components_InputUploaderModal_Trifacta_Upload_DM')}
        </Text>
      </Flex>
      <Box my={8}>
        <RadioGroup
          dataInstance={`${dataInstance}-Options`}
          fontWeight='s'
          name='uploader'
          options={options}
          selectedValue={value || ''}
          py={8}
          borderColor='lightGray'
          borderTop={1}
          borderBottom={1}
          onOptionChange={onSelected}
        />
      </Box>
    </Box>
  );
};

export default AddDataModelOptions;

AddDataModelOptions.propTypes = {
  value: PropTypes.string,
  onSelected: PropTypes.func,
};

AddDataModelOptions.defaultProps = {
  value: '',
  onSelected: noop,
};
