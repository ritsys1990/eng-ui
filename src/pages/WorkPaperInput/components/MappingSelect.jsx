import React from 'react';
import { Flex, Icon, IconTypes, Select, SelectTypes, Text, TextTypes } from 'cortex-look-book';
import { ARROW_WIDTH, NULL_FIELD, SELECT_WIDTH, TRANSLATION_KEY } from '../constants/WorkPaperInputConstants';
import { COMPONENT_NAME } from './constants';
import useTranslation from 'src/hooks/useTranslation';

const MappingSelect = props => {
  const { field, value, selectedOptions, disabled, mandatoryFields, nonMandatoryFields, onFieldChange } = props;
  const { t } = useTranslation();

  const filteredOptions = [
    {
      name: '',
      options: [{ name: t(`${TRANSLATION_KEY}_NullField`), value: NULL_FIELD }],
    },
  ];

  if (mandatoryFields) {
    filteredOptions.push({
      name: t(`${TRANSLATION_KEY}_MandatorySelect`),
      options: mandatoryFields.filter(option => !selectedOptions.includes(option.value)),
    });
  }

  if (nonMandatoryFields) {
    filteredOptions.push({
      name: t(`${TRANSLATION_KEY}_NonMandatorySelect`),
      options: nonMandatoryFields.filter(option => !selectedOptions.includes(option.value)),
    });
  }

  return (
    <Flex
      mb={4}
      sx={{
        wordWrap: 'break-word',
      }}
    >
      <Text type={TextTypes.BODY} alignItems='center' p={4} width={SELECT_WIDTH} backgroundColor='lightGray2'>
        {/^_[0-9]+$/.test(field) ? field.replace('_', 'BlankHeader') : field}
      </Text>
      <Icon display='flex' type={IconTypes.ARROWRIGHT} width={ARROW_WIDTH} />
      <Select
        width={SELECT_WIDTH}
        type={SelectTypes.SINGLE}
        value={value}
        disabled={disabled}
        options={filteredOptions}
        placeholder={t(`${TRANSLATION_KEY}_SelectPlaceholder`)}
        optionValueKey='value'
        optionTextKey='name'
        childrenListKey='options'
        onChange={option => onFieldChange(field, option[0].value)}
        customRenderSelected={(option, index) => (
          <Text key={index} type={TextTypes.BODY} color='black'>
            {option.name}
          </Text>
        )}
        dataInstance={COMPONENT_NAME}
      />
    </Flex>
  );
};

export default MappingSelect;
