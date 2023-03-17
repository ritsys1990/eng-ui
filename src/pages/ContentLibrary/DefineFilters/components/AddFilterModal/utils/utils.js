import React from 'react';
import { COMPONENT_NAME, FormErrorModel, FILTER_TABLE_KEY, FILTER_TYPE } from '../constants';
import { Box, Button, ButtonTypes, IconTypes, Flex, Input, Intent, Select, SelectTypes } from 'cortex-look-book';

export const getFilterErrors = (
  filterName,
  filterDesc,
  tableValue,
  fieldValue,
  rows,
  selectedOperation,
  selectedFilterValue,
  showErrors,
  defaultValue,
  filterType,
  t
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const errors = { ...FormErrorModel };
  const errorMessage = t('Pages_ContentLibrary_Filter_Error_Message');
  const errorTableMessage = t('Pages_ContentLibrary_Filter_Table_Error_Message');

  // filter name
  if (filterName?.length <= 0) {
    errors.filterName = errorMessage;
  }
  // description
  if (filterDesc?.length <= 0) {
    errors.filterDesc = errorMessage;
  }

  if (tableValue?.length <= 0) {
    errors.tableValue = errorMessage;
  }

  if (fieldValue?.length <= 0) {
    errors.fieldValue = errorMessage;
  }

  if (rows?.length <= 0) {
    errors.rows = errorTableMessage;
  }

  // Default Value
  if (defaultValue?.length <= 0 && filterType === FILTER_TYPE.MANDATORY) {
    errors.defaultValueError = errorMessage;
  }

  if (rows.length > 0) {
    if (rows.length >= selectedOperation?.length) {
      let errorLength = 0;
      rows.map(row => {
        if (selectedOperation?.filter(selected => selected[0].rowId === row.id).length < 1) {
          if (showErrors) {
            errors.selectedOperation[row.id] = errorMessage;
          }
          errorLength++;
        } else {
          errors.selectedOperation[row.id] = null;
        }
        errors.operatorErrorLength = errorLength;

        return errors.operatorErrorLength;
      });
    }

    if (rows.length >= selectedFilterValue.length) {
      let errorLength = 0;
      rows.map(row => {
        if (row?.id) {
          const selectedFilterRow = selectedFilterValue?.filter(selected => selected?.rowId === row?.id);
          if (
            selectedFilterRow.length < 1 ||
            (selectedFilterRow?.length > 0 && selectedFilterRow[0]?.filterValue === '')
          ) {
            if (showErrors) {
              errors.selectedFilterValue[row.id] = errorMessage;
            }
            errorLength++;
          } else {
            errors.selectedFilterValue[row.id] = null;
          }
          errors.filterErrorLength = errorLength;
        }

        return errors.filterErrorLength;
      });
    }
  }

  return errors;
};

export const getHeaders = (
  t,
  operations,
  selectedOperation,
  selectedFilterValue,
  onChangeOperation,
  onFilterValueChange,
  handleContexButtonClick,
  AddFilterOperation,
  rows
) => {
  const errors = { ...FormErrorModel };

  return [
    {
      title: t('Pages_ContentLibrary_Filter_Criteria_Label'),
      key: FILTER_TABLE_KEY.CRITERIA,
      width: '35%',
      render: (_, row) => {
        return (
          <Flex justifyContent='space-between'>
            <Box width='100%'>
              <Select
                required
                type={SelectTypes.SINGLE}
                value={selectedOperation.filter(x => x[0].rowId === row.id)[0] || []}
                options={operations}
                onChange={changeValue => onChangeOperation(changeValue, row)}
                dataInstance={`${COMPONENT_NAME}_Criteria`}
                filtering
                placeholder={t('Pages_Client_Setup_Step4_Sub_Org_Entity_Select')}
                optionValueKey='id'
                optionTextKey='name'
                hint={errors.selectedOperation[row.id]}
                intent={errors.selectedOperation[row.id] ? Intent.ERROR : null}
              />
            </Box>
          </Flex>
        );
      },
    },
    {
      title: t('Pages_ContentLibrary_Text_Example_Label'),
      key: FILTER_TABLE_KEY.FITER_VALUE,
      width: '35%',
      render: (_, row) => {
        return (
          <Flex justifyContent='space-between'>
            <Box width='100%'>
              <Input
                value={selectedFilterValue?.filter(x => x?.rowId === row.id)[0]?.filterValue || ''}
                dataInstance={`${COMPONENT_NAME}-value`}
                inputHeight={40}
                onChange={e => onFilterValueChange(e, row)}
                placeholder={t('Pages_ContentLibrary_Filter_Input_Placeholder')}
                hint={errors.selectedFilterValue[row.id]}
                intent={errors.selectedFilterValue[row.id] ? Intent.ERROR : null}
                optionValueKey='id'
                optionTextKey='name'
              />
            </Box>
          </Flex>
        );
      },
    },
    {
      title: AddFilterOperation(),
      key: 'id',
      render: (_, row) => {
        return (
          <Flex justifyContent='flex-end'>
            <Button
              p={2}
              hidden={rows.length <= 1}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              dataInstance={`${COMPONENT_NAME}_Context_Button`}
              onClick={event => {
                handleContexButtonClick(event, row);
              }}
            />
          </Flex>
        );
      },
    },
  ];
};
