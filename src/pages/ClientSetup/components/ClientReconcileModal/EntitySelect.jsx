import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectTypes, Text, TextTypes } from 'cortex-look-book';
import { useSelector } from 'react-redux';
import { COMPONENT_NAME, TRANSLATION_KEY } from './constants/constants';
import { settingsSelectors } from '../../../../store/settings/selectors';

const EntitySelect = props => {
  const {
    field,
    value,
    selectedOptions,
    uniqueOptions,
    repeatableOptions,
    disabled,
    onFieldChange,
    textKey,
    valueKey,
    isFetchingData,
  } = props;

  const [allOptions, setAllOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const content = useSelector(settingsSelectors.selectLanguage);

  useEffect(() => {
    const filtered = [...repeatableOptions];

    if (uniqueOptions) {
      filtered.push(
        ...uniqueOptions.filter(option => !selectedOptions.find(selected => selected[valueKey] === option[valueKey]))
      );
    }

    setAllOptions([...repeatableOptions, ...uniqueOptions]);
    setFilteredOptions(filtered);
  }, [repeatableOptions, uniqueOptions, selectedOptions, valueKey]);

  useEffect(() => {
    const selected = allOptions.find(option => option[valueKey] === value);
    if (selected) {
      setSelectedValue([selected]);
    }
  }, [allOptions, value, valueKey]);

  return (
    <Select
      type={SelectTypes.SINGLE}
      value={selectedValue}
      disabled={disabled}
      options={filteredOptions}
      placeholder={content[`${TRANSLATION_KEY}_SelectPlaceholder`]}
      optionValueKey={valueKey}
      optionTextKey={textKey}
      onChange={option => {
        if (option.length) {
          onFieldChange(field, option[0][valueKey]);
        }
      }}
      customRenderSelected={(option, index) => (
        <Text key={index} type={TextTypes.BODY}>
          {option.name}
        </Text>
      )}
      loading={isFetchingData}
      dataInstance={COMPONENT_NAME}
    />
  );
};

EntitySelect.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedOptions: PropTypes.array.isRequired,
  uniqueOptions: PropTypes.array.isRequired,
  repeatableOptions: PropTypes.array,
  disabled: PropTypes.bool,
  onFieldChange: PropTypes.func.isRequired,
  textKey: PropTypes.string,
  valueKey: PropTypes.string,
  isFetchingData: PropTypes.bool,
};

EntitySelect.defaultProps = {
  value: null,
  repeatableOptions: [],
  disabled: false,
  textKey: 'text',
  valueKey: 'value',
  isFetchingData: false,
};

export default EntitySelect;
