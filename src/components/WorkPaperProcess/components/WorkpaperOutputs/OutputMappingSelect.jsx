import React from 'react';
import { Flex, Icon, IconTypes, Select, SelectTypes, Text, TextTypes } from 'cortex-look-book';
import { ARROW_WIDTH, SELECT_WIDTH, COMPONENT_NAME } from './output.consts';
import useTranslation from 'src/hooks/useTranslation';

const OutputMappingSelect = props => {
  const { field, value, onFieldChange, options, inputChangeDebounce, filtering, isCentralizedDSUpdated } = props;
  const { t } = useTranslation();

  return (
    <Flex
      mb={4}
      sx={{
        wordWrap: 'break-word',
      }}
    >
      <Text
        type={TextTypes.BODY}
        // display='flex'
        alignItems='center'
        p={4}
        width={SELECT_WIDTH}
        backgroundColor='lightGray2'
      >
        {field}
      </Text>
      <Icon display='flex' type={IconTypes.ARROWRIGHT} width={ARROW_WIDTH} />
      <Select
        width={SELECT_WIDTH}
        type={SelectTypes.AUTO_COMPLETE}
        value={value}
        options={options}
        filtering={filtering}
        disabled={isCentralizedDSUpdated}
        required
        placeholder={t('Components_OutputMappingScreen_SelectPlaceholder')}
        optionValueKey='newFieldName'
        optionTextKey='newFieldName'
        onChange={option => {
          if (option.length > 0) {
            onFieldChange(field, option[0].newFieldName);
          }
        }}
        inputChangeDebounce={inputChangeDebounce}
        customRenderSelected={(option, index) => (
          <Text key={index} type={TextTypes.BODY} color='black'>
            {option.newFieldName}
          </Text>
        )}
        dataInstance={COMPONENT_NAME}
      />
    </Flex>
  );
};

export default OutputMappingSelect;
