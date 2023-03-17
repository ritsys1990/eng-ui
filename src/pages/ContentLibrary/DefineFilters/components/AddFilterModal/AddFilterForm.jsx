import React, { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from 'react';
import {
  AlertHub,
  Box,
  Button,
  Radio,
  Flex,
  Input,
  Intent,
  Select,
  SelectTypes,
  Spinner,
  Table,
  Text,
  TextTypes,
} from 'cortex-look-book';
import { useSelector, useDispatch } from 'react-redux';
import useTranslation from 'src/hooks/useTranslation';
import {
  COMPONENT_NAME,
  FormErrorModel,
  FILTER_TYPE,
  OPERATIONS,
  getFilterTypeOptions,
  radioGroupName,
} from './constants';
import { createSourceVersionFilter, editSourceVersionFilter, fetchFieldsContext } from 'src/store/bundles/actions';
import { BundlesActionTypes } from 'src/store/bundles/actionTypes';
import { bundlesSelectors } from 'src/store/bundles/selectors';

import { getFilterErrors, getHeaders } from './utils/utils';
import FilterContextMenu from './FilterContextMenu';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddFilterForm = forwardRef((props, ref) => {
  const { handleClose, selectedFilter, isEditMode, setIsChanged, isChanged } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const IsCreatingSourceVersionFilter = useSelector(bundlesSelectors.selectIsCreatingSourceVersionFilter);
  const isEditingSourceFilter = useSelector(bundlesSelectors.selectIsEditingSourceFilter);
  const SourcerVersionFilterError = useSelector(bundlesSelectors.selectSourcerVersionFilterError);
  const tableContexts = useSelector(bundlesSelectors?.selectTableContexts);
  const bundleNameDetails = useSelector(bundlesSelectors.selectBundleNameDetails);
  const bundleContexts = useSelector(bundlesSelectors?.selectBundleContexts);
  const isFetchingFieldContext = useSelector(bundlesSelectors.selectIsFetchingFieldContext);

  const [targetTables, setTargetTables] = useState([]);
  const [targetField, setTargetField] = useState([]);
  const [tableValue, setTableValue] = useState([]);
  const [fieldValue, setFieldValue] = useState([]);
  const [rows, setRows] = useState([]);
  const [operations, setOperations] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState([]);
  const [selectedFilterValue, setSelectedFilterValue] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [selectedRow, setSelectedRow] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [filterId, setFilterId] = useState('');
  const [filterType, setFilterType] = useState(FILTER_TYPE.SUGGESTED);
  const [defaultValue, setDefaultValue] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setFilterName(selectedFilter?.name);
      setFilterDesc(selectedFilter?.description);
      const table = tableContexts?.items.filter(item => item.sourceTableId === selectedFilter?.tableId);
      setTableValue([{ id: table?.[0]?.id, name: selectedFilter?.tableName, tableId: selectedFilter?.tableId }]);
      setFieldValue([{ id: selectedFilter?.fieldId, name: selectedFilter?.fieldName }]);
      setFilterId(selectedFilter?.id);
      setFilterType(selectedFilter?.type);
      setDefaultValue(selectedFilter.defaultValue || '');
    }
  }, [selectedFilter, isEditMode]);

  useEffect(() => {
    setIsEditEnabled(true);
  }, [isEditMode]);

  useEffect(() => {
    const tables = tableContexts?.items;
    if (tables) {
      setTargetTables(
        tables?.map(x => ({
          id: x.id,
          name: `${x.nameTech}`,
          tableId: x.sourceTableId,
        }))
      );
    }
  }, [tableContexts]);

  useEffect(() => {
    if (targetTables && tableValue?.length > 0) {
      const bundleContextId = bundleContexts?.items[0]?.id;
      const tableContextId = tableValue[0]?.id;
      if (isChanged) {
        setFieldValue([]);
      }
      dispatch(fetchFieldsContext(bundleNameDetails?.bundleId, bundleContextId, tableContextId)).then(fields => {
        setTargetField(
          fields?.items?.map(x => ({
            id: x.id,
            name: `${x.nameTech}`,
          }))
        );
      });
    }
  }, [targetTables, tableValue]);

  const onChangeOperation = useCallback(
    (changeVal, row) => {
      if (changeVal?.length > 0) {
        const filtered = selectedOperation;
        const removeIndex = filtered
          .map(item => {
            return item[0].rowId;
          })
          .indexOf(row.id);
        if (removeIndex !== -1) {
          const removable = filtered?.filter(o => o[0].rowId === row.id);
          filtered.splice(removeIndex, 1);
          setSelectedOperation(filtered);
          setOperations([...operations, removable[0][0]]);
        }
        const newChangeVal = changeVal;
        newChangeVal[0].rowId = row.id;
        const values = [...selectedOperation, newChangeVal];
        setSelectedOperation(values);
        setIsChanged(true);
      }
    },
    [selectedOperation, setOperations, setSelectedOperation]
  );

  useEffect(() => {
    if (isEditMode && isEditEnabled) {
      const existingOperators = selectedFilter?.filterOperations;
      const selecteOperationsArray = [];
      const selectedFilterValueArray = [];
      rows.forEach((row, index) => {
        selecteOperationsArray.push([
          {
            id: operations?.filter(op => op.name === existingOperators[index].operation)[0].id,
            name: existingOperators[index].operation,
            rowId: row.id,
          },
        ]);

        selectedFilterValueArray.push({
          rowId: row?.id,
          filterValue: existingOperators[index].filterValue,
        });
      });
      setSelectedOperation(selecteOperationsArray);
      setSelectedFilterValue(selectedFilterValueArray);
    }
  }, [rows, isEditMode, isEditEnabled]);

  const onFilterValueChange = useCallback(
    (e, row) => {
      const index = rows?.findIndex(r => r.id === row.id);
      const values = [...selectedFilterValue];
      values[index] = { rowId: row?.id, filterValue: e.target.value };
      setSelectedFilterValue(values);
      setIsChanged(true);
    },
    [rows, selectedFilterValue]
  );

  const onCloseAlerts = () => {
    dispatch({
      type: BundlesActionTypes.CREATE_SOURCE_VERSION_FILTER_REMOVE_ERROR,
    });
  };

  useEffect(() => {
    setOperations(OPERATIONS);
    onCloseAlerts();
  }, []);

  useEffect(() => {
    setRows(rows);
  }, [selectedOperation]);

  useEffect(() => {
    if (isEditMode) {
      const existingOperators = selectedFilter.filterOperations;
      const existingRows = [];
      existingOperators.forEach(() => {
        const id = uuidv4();
        existingRows.push({ id });
      });
      setRows(existingRows);
    }
  }, [selectedFilter, isEditMode]);

  useEffect(() => {
    if (selectedOperation.length > 0) {
      const filtered = operations?.filter(o => !selectedOperation?.find(o2 => o.name === o2[0].name));
      setOperations(filtered);
    }
  }, [selectedOperation]);

  const onNameChange = e => {
    setIsChanged(true);
    setFilterName(e.target.value);
  };

  const onDescriptionChange = e => {
    setIsChanged(true);
    setFilterDesc(e.target.value);
  };

  const onChangeTable = value => {
    setIsChanged(true);
    setTableValue(value);
  };

  const onChangeField = value => {
    setIsChanged(true);
    setFieldValue(value);
  };

  const onChangeOption = value => {
    setFilterType(value);
    setIsChanged(true);
  };

  const onDefaultValueChange = value => {
    setDefaultValue(value);
    setIsChanged(true);
  };

  const getErrors = getFilterErrors(
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
  );

  const hasErrors = () => {
    const errors = getErrors;

    return (
      errors.filterName ||
      errors.filterDesc ||
      errors.tableValue ||
      errors.fieldValue ||
      errors.rows ||
      errors.defaultValueError ||
      errors.operatorErrorLength > 0 ||
      errors.filterErrorLength > 0
    );
  };

  const errors = showErrors ? getErrors : { ...FormErrorModel };

  useEffect(() => {
    if (fieldValue.length > 0 && !selectedFilter) {
      setFieldValue([]);
      errors.fieldValue = t('Pages_ContentLibrary_Filter_Error_Message');
    }
  }, [tableValue, selectedFilter]);

  const AddFilterData = () => {
    if (rows.length < 6) {
      setIsEditEnabled(false);
      const id = uuidv4();
      setRows(() => [...rows, { id }]);
    }

    if (errors) {
      errors.rows = null;
    }
  };

  const AddFilterOperation = useCallback(() => {
    return (
      <Button type='link' icon='plus' onClick={AddFilterData}>
        {t('Pages_ContentLibrary_Filters_Add_Filter_Operation')}
      </Button>
    );
  }, [AddFilterData]);

  const deleteFilterOperation = () => {
    setIsEditEnabled(false);
    setRows(rows.filter(row => row.id !== selectedRow.id));
    const deleted = selectedOperation.filter(selectedVal => selectedVal[0].rowId === selectedRow.id);
    setSelectedOperation(selectedOperation.filter(selectedVal => selectedVal[0].rowId !== selectedRow.id));
    setSelectedFilterValue(selectedFilterValue.filter(changeVal => changeVal.rowId !== selectedRow.id));
    if (deleted.length > 0) {
      delete deleted[0][0].rowId;
      setOperations([...operations, deleted[0][0]]);
    }
    setIsMenuOpen(false);
    setIsChanged(true);
  };

  const handleContexButtonClick = useCallback((event, row) => {
    setContextButtonRef({ current: event.target });
    setSelectedRow(row);
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    setHeaders(
      getHeaders(
        t,
        operations,
        selectedOperation,
        selectedFilterValue,
        onChangeOperation,
        onFilterValueChange,
        handleContexButtonClick,
        AddFilterOperation,
        rows
      )
    );
  }, [t, operations, selectedOperation, selectedFilterValue, rows]);

  const handleCreateSourceVersionCallback = res => {
    if (res) {
      handleClose();
    }
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (hasErrors()) {
      return;
    }

    const filteredOpeations = [];
    selectedOperation.forEach(selected => {
      return selectedFilterValue.forEach(filtered => {
        if (filtered.rowId === selected[0].rowId) {
          return filteredOpeations.push({
            FilterCriteria: selected[0].name,
            FilterValue: filtered.filterValue,
          });
        }

        return true;
      });
    });

    const sourceVersionId = bundleNameDetails?.sourceVersionId;
    const data = {
      BundleId: bundleNameDetails?.bundleId,
      Name: filterName,
      Description: filterDesc,
      Type: filterType,
      TableId: tableValue?.[0]?.tableId,
      TableName: tableValue?.[0]?.name,
      FieldId: fieldValue?.[0]?.id,
      FieldName: fieldValue?.[0]?.name,
      FilterOperations: filteredOpeations,
      DefaultValue: filterType === FILTER_TYPE.MANDATORY ? defaultValue : '',
    };

    if (!isEditMode) {
      dispatch(createSourceVersionFilter(bundleNameDetails?.bundleId, sourceVersionId, data)).then(
        handleCreateSourceVersionCallback
      );
    } else {
      dispatch(editSourceVersionFilter(bundleNameDetails?.bundleId, sourceVersionId, filterId, data)).then(
        handleCreateSourceVersionCallback
      );
    }
    setIsChanged(false);
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  return (
    <Spinner
      spinning={IsCreatingSourceVersionFilter || isEditingSourceFilter}
      overlayOpacity={0.7}
      dataInstance={`${COMPONENT_NAME}`}
    >
      <Box width='100%'>
        <Text type={TextTypes.H2} fontWeight='l'>
          {isEditMode
            ? t(`Pages_ContentLibrary_Filter_Table_Edit_Filter`)
            : t('Pages_ContentLibrary_AddFilter_ModalTitle')}
        </Text>
        <Box my={3}>
          <AlertHub
            alerts={SourcerVersionFilterError}
            onClose={onCloseAlerts}
            dataInstance={`${COMPONENT_NAME}_Alerts`}
          />
        </Box>
        <Box py={4}>
          <Box mt={7} dataInstance={`${COMPONENT_NAME}-Filter-Options`}>
            <Text type={TextTypes.H4} mb={2} fontWeight='m'>
              <Box color='red' pr={4} display='inline-block'>
                *
              </Box>
              {t('Pages_ContentLibrary_Filter_Type_Label')}
            </Text>

            <Flex py={2} dataInstance={`${COMPONENT_NAME}-Filter-Type-Wrapper`}>
              {getFilterTypeOptions(t).map(eachOption => {
                return (
                  <Radio
                    key={`${COMPONENT_NAME}-Filter-Type-option-${eachOption.text}`}
                    dataInstance={`${COMPONENT_NAME}-Filter-Type-option-${eachOption.text}`}
                    name={radioGroupName}
                    label={eachOption.text}
                    value={eachOption.value}
                    mb={4}
                    pr={4}
                    radioSize={16}
                    fontSize={14}
                    fontWeight='s'
                    checked={eachOption.value === filterType}
                    onOptionSelected={onChangeOption}
                  />
                );
              })}
            </Flex>
          </Box>

          <Box width='50%' mt={4}>
            <Input
              required
              label={t('Pages_ContentLibrary_Filters_Name')}
              value={filterName}
              placeholder={t('Pages_ContentLibrary_Filters_Name')}
              dataInstance={`${COMPONENT_NAME}_Filter_Name`}
              onChange={onNameChange}
              hint={errors.filterName}
              intent={errors.filterName ? Intent.ERROR : null}
            />
          </Box>
          <Box mt={4}>
            <Input
              required
              label={t('Pages_ContentLibrary_Filters_Desc')}
              value={filterDesc}
              placeholder={t('Pages_ContentLibrary_Filters_Desc')}
              dataInstance={`${COMPONENT_NAME}_Filter_Desc`}
              onChange={onDescriptionChange}
              hint={errors.filterDesc}
              intent={errors.filterDesc ? Intent.ERROR : null}
            />
          </Box>
          <Flex justifyContent='space-between'>
            <Box width='50%' mr={4} my={4}>
              <Select
                required
                label={t('Pages_ContentLibrary_Filters_Table')}
                type={SelectTypes.SINGLE}
                value={tableValue}
                options={targetTables}
                onChange={val => onChangeTable(val)}
                filtering
                dataInstance={`${COMPONENT_NAME}_Target_Table`}
                placeholder={t('Pages_Client_Setup_Step4_Sub_Org_Entity_Select')}
                hint={errors.tableValue}
                intent={errors.tableValue ? Intent.ERROR : null}
                optionValueKey='id'
                optionTextKey='name'
              />
            </Box>
            <Box width='50%' ml={4} my={4}>
              <Spinner spinning={isFetchingFieldContext} overlayOpacity={0.7}>
                <Select
                  required
                  label={t('Pages_ContentLibrary_Filters_Field')}
                  type={SelectTypes.SINGLE}
                  value={fieldValue || []}
                  onChange={val => onChangeField(val)}
                  options={targetField || []}
                  loading={false}
                  disabled={targetField?.length < 1}
                  filtering
                  dataInstance={`${COMPONENT_NAME}_Table_Field`}
                  placeholder={t('Pages_Client_Setup_Step4_Sub_Org_Entity_Select')}
                  hint={errors.fieldValue}
                  intent={errors.fieldValue ? Intent.ERROR : null}
                  optionValueKey='id'
                  optionTextKey='name'
                />
              </Spinner>
            </Box>
          </Flex>
          <Box my={4}>
            <FilterContextMenu
              deleteFilterOperation={deleteFilterOperation}
              isOpen={isMenuOpen}
              buttonRef={contextButtonRef}
              onClose={() => setIsMenuOpen(false)}
              dataInstance={`${COMPONENT_NAME}_Filter_Context_Menu`}
            />
            <Table headers={headers} dataInstance={`${COMPONENT_NAME}-table`} rows={rows} />
            <Text type={TextTypes.H4} mt={2} color='errorBorder'>
              {errors.rows}
            </Text>
          </Box>

          <Box>
            <Flex dataInstance={`${COMPONENT_NAME}-Default-Value-Wrapper`} mt={1}>
              {filterType === FILTER_TYPE.MANDATORY && (
                <Input
                  required
                  label={t('Pages_ContentLibrary_Filters_Mandatory_Dafault_Label')}
                  placeholder={t('Pages_ContentLibrary_Filters_Mandatory_Default_Value_Placeholder')}
                  value={defaultValue}
                  dataInstance={`${COMPONENT_NAME}_Mandatory_Default_value`}
                  onChange={e => onDefaultValueChange(e.target.value)}
                  hint={errors.defaultValueError}
                  intent={errors.defaultValueError ? Intent.ERROR : null}
                />
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Spinner>
  );
});

export default AddFilterForm;
