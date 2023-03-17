import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  HeadSelectOption,
  Icon,
  IconTypes,
  Intent,
  Select,
  SelectOption,
  SelectTypes,
  Text,
  TextTypes,
} from 'cortex-look-book';

import PropTypes from 'prop-types';
import { COMPONENT_NAME } from './constants';
import { noop } from '../../../../utils/errorHelper';
import useTranslation from 'src/hooks/useTranslation';

export const SelectSheets = ({ sheets = [], valid = noop, onSheetChange = noop, onLastSelectedChange = noop }) => {
  const SELECT_ALL = -1;
  const { t } = useTranslation();
  const selectAllValue = [{ value: -1, text: t('Components_InputUploaderModal_SelectSheet') }];
  const [toggle, setToggle] = useState(false);
  const [lastSelected, setLastSelected] = useState((sheets && sheets[0]) || []);
  const [excelSheets, setExcelSheets] = useState([...selectAllValue]);
  const [intent, setIntent] = useState(null);
  const withSelectAll = [...selectAllValue, ...sheets];

  useEffect(() => {
    if (!toggle && excelSheets.length === sheets.length) {
      setToggle(true);
      setExcelSheets([...selectAllValue]);
    }

    onSheetChange(!toggle ? excelSheets : sheets);
    onLastSelectedChange(lastSelected);
    setIntent(excelSheets.length ? null : Intent.ERROR);
  }, [excelSheets]);

  useEffect(() => {
    valid(!excelSheets.length);
  }, [excelSheets]);

  useEffect(() => {
    if (sheets.length && excelSheets.length === 1 && excelSheets[0].value === SELECT_ALL) {
      setExcelSheets([sheets[0]]);
    }
  }, [sheets]);

  const onOptionSelect = selectedSheet => {
    if (toggle) {
      setToggle(false);
      setExcelSheets(sheets.filter(sheet => sheet.value !== selectedSheet.value));

      return;
    }

    const hasInList = excelSheets.find(sheet => sheet.value === selectedSheet.value);

    const data = excelSheets.filter(sheet => sheet.value !== selectedSheet.value);

    setExcelSheets(hasInList ? data : [selectedSheet, ...excelSheets]);
    setLastSelected(selectedSheet);
  };

  const onAllOptionsSelect = () => {
    setToggle(!toggle);
    setExcelSheets(!toggle ? [...selectAllValue] : []);
  };

  const onSelectChange = items => {
    setExcelSheets(items);
  };

  const getValue = (isSelectedAll, selectedSheets) => {
    if (isSelectedAll && selectedSheets.length) {
      return selectAllValue;
    } else if (selectedSheets.length) {
      return selectedSheets;
    }

    return [];
  };

  const isSelected = (current, list) => list.find(item => item.value === current.value);

  return (
    <Box>
      <Select
        sx={{
          minWidth: '200px',
        }}
        dataInstance={COMPONENT_NAME}
        intent={intent}
        placeholder={t('Components_InputUploaderModal_SelectSheet_Placeholder')}
        required
        type={SelectTypes.MULTIPLE}
        label={t('Components_InputUploaderModal_SelectSheet_Label')}
        value={getValue(toggle, excelSheets)}
        options={withSelectAll}
        onChange={onSelectChange}
        customRender={(option, index) => (
          <Flex key={`key-${index}`}>
            {option.value === SELECT_ALL ? (
              <HeadSelectOption onClick={onAllOptionsSelect}>
                <Text type={TextTypes.H4}>{option.text}</Text>
                {toggle && <Icon type={IconTypes.CHECK} width={16} />}
              </HeadSelectOption>
            ) : (
              <SelectOption onClick={() => onOptionSelect(option)}>
                <Text type={TextTypes.H4}>{option.text}</Text>

                {toggle ? (
                  <Icon type={IconTypes.CHECK} width={16} />
                ) : (
                  isSelected(option, excelSheets) && <Icon type={IconTypes.CHECK} width={16} />
                )}
              </SelectOption>
            )}
          </Flex>
        )}
      />
    </Box>
  );
};

SelectSheets.propTypes = {
  sheets: PropTypes.array,
  valid: PropTypes.func,
  onSheetChange: PropTypes.func,
  onLastSelectedChange: PropTypes.func,
};

SelectSheets.defaultProps = {
  sheets: [],
  valid: noop,
  onSheetChange: noop,
  onLastSelectedChange: noop,
};
