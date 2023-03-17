import React, { useState, useEffect } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Intent,
  Text,
  TextTypes,
  Flex,
  Input,
  DropDownRadioSelect,
  Box,
  DropdownMultiSelect,
  Button,
  ButtonTypes,
  RadioGroup,
  Alert,
  AlertTypes,
  Spinner,
} from 'cortex-look-book';
import {
  checkChildWorkpaperNameExists,
  saveWorkPaperFilterData,
  getChildWorkPapers,
} from '../../../store/childWorkpapers/actions';
import { sortDataByTableName } from '../Utils/Utils';
import {
  COMPONENT_NAME,
  childWorkpaperFormFields,
  getFilterSelectionOptions,
  INPUT_CONTROL_PROPTYPES,
} from '../constants/constants';
import { getOutput } from '../../../store/workpaperProcess/step3/actions';
import { wpStep3Selectors } from '../../../store/workpaperProcess/step3/selectors';
import { v4 as uuidv4 } from 'uuid';
import { childWorkpaperSelectors } from '../../../store/childWorkpapers/selectors';
import FilterGrid from './FilterGrid';
import { ChildWorkpaperFilter } from '../Enum/Enum';
import { addGlobalError } from '../../../store/errors/actions';

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterForm = props => {
  const {
    engagementId,
    formValue,
    workpaperId,
    workpaper,
    outputs,
    childworkpaperCount,
    setFiltersOpen,
    setAddNewChild,
    syncingOutputs,
    selectIsFetchingOutput,
    maxChildWPLimit,
    isLoading,
    editChildWPClick,
    nameAndDescriptionValue,
    isFilterApplied,
    editChildWPDetails,
    setEditChildWPClick,
    setEditChildWPDetails,
  } = props;
  const { NAME, DESCRIPTION } = childWorkpaperFormFields;
  const { t } = useTranslation();
  const [formValues, setFormValue] = useState(formValue);
  const [isNameReq, setNameReq] = useState(false);
  const dispatch = useDispatch();
  const [isNameDup, setNameDup] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);
  const output = useSelector(wpStep3Selectors.selectOutput);
  const [filterData, setFilterData] = useState({});
  const [ensureFilter, setEnsureFilter] = useState(true);
  const [ensureValidation, setEnsureValidation] = useState(true);
  const [selectedFilterData, setselectedFilterData] = useState([]);
  const [limitExceeds, setLimitExceeds] = useState(false);
  const [loading, setloading] = useState(false);
  const [showWPErrorMsg, setWpCountErrorMessage] = useState(false);
  const [mutliSelectDropdownData, setMutliSelectDropdownData] = useState([]);
  const [showColumnsMsg, setColumnsMsg] = useState(false);
  const [isNameMaxLengthTouch, setNameMaxLengthTouch] = useState(false);
  const [isNameInputNameMaxLengthTouch, setNameInputNameMaxLengthTouch] = useState(false);
  const selectSavingChildWorkpaperFilterData = useSelector(
    childWorkpaperSelectors.selectSavingChildWorkpaperFilterData
  );

  const childWpColumns = useSelector(childWorkpaperSelectors.childWpColumns);

  useEffect(() => {
    if (workpaper?.workpaperSource && selectedValue !== 0) {
      dispatch(getOutput(workpaperId, selectedValue, null, workpaper.workpaperSource));
    }
  }, [selectedValue]);

  const sortByNameAlphabetically = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  if (output?.schema?.length) {
    output.schema = output.schema.sort(sortByNameAlphabetically);
  }

  const getHintOrIntent = secName => {
    if (isNameReq && !formValues[NAME]) {
      return secName === INPUT_CONTROL_PROPTYPES.HINT
        ? t('Components_AddNewWorkpaperModal_Validation_Error')
        : Intent.ERROR;
    } else if (isNameDup && formValues[NAME]) {
      return secName === INPUT_CONTROL_PROPTYPES.HINT
        ? t('Components_AddWorkpaperModal_Step2_DuplicateName')
        : Intent.ERROR;
    } else if (isNameMaxLengthTouch && formValues[NAME]) {
      return secName === INPUT_CONTROL_PROPTYPES.HINT
        ? t('Components_AddWorkpaperModal_Name_Maximum_Length_Error')
        : Intent.ERROR;
    }

    return '';
  };

  const onValidateWPName = event => {
    if (event.target.value && engagementId) {
      dispatch(checkChildWorkpaperNameExists(engagementId, formValues[NAME], filterData?.id)).then(nameExists => {
        if (formValues[NAME]) {
          setNameDup(nameExists);
        }
      });
    }
  };

  const onChangeInput = (key, event) => {
    const newFormValue = { ...formValues, [key]: event.target.value };
    if (key === NAME) {
      setNameDup(false);
      if (newFormValue[NAME]) {
        setNameReq(false);
      } else {
        setNameReq(true);
      }
      if (event.target.value.length > 155) {
        setNameMaxLengthTouch(true);
      } else {
        setNameMaxLengthTouch(false);
      }
    }
    setFormValue(newFormValue);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const getUniqueDataAndKeepLastOccurrence = data => {
    return [...data]
      .reverse()
      .filter(
        (value, i, a) =>
          a.findIndex(tempData =>
            tempData?.columnName || tempData?.hasFilter
              ? tempData?.columnName === value?.columnName
              : tempData?.tableName === value?.tableName
          ) === i
      )
      .reverse();
  };

  const mergeArrays = (previousFilterData, modifiedFilter) => {
    const newlyAddedFilterData = getUniqueDataAndKeepLastOccurrence(modifiedFilter);
    const oldFilterdData = getUniqueDataAndKeepLastOccurrence(previousFilterData);

    return oldFilterdData?.map(
      obj => (newlyAddedFilterData && newlyAddedFilterData.find(p => p?.columnName === obj?.columnName)) || obj
    );
  };

  const handleAddFilter = () => {
    if (isNameMaxLengthTouch) {
      scrollToTop();
    } else {
      setLimitExceeds(false);
      setWpCountErrorMessage(false);
      if (formValues[NAME].length === 0) {
        setEnsureValidation(false);
      } else {
        setEnsureValidation(true);
      }

      const selectedTableName = outputs?.dataTable?.filter(x => x.id === selectedValue)[0]?.name;

      if (formValues[NAME].length + selectedTableName.length > 255) {
        setNameInputNameMaxLengthTouch(true);
      } else {
        setNameInputNameMaxLengthTouch(false);
      }
      if (ensureValidation) {
        const workpaperDetailId = filterData?.id;
        const childWorkPaperId = filterData?.childWorkPaperId;

        const filterDataSet = {
          engagementId,
          parentWorkpaperId: workpaperId,
          childWorkpaperName: formValues[NAME],
          description: formValues[DESCRIPTION],
          filters:
            ensureFilter === true
              ? selectedFilterData
              : [
                  {
                    id: uuidv4(),
                    tableId: selectedValue,
                    tableName: selectedTableName,
                    hasFilter: false,
                  },
                ],
        };
        if (workpaperDetailId) {
          filterDataSet.id = workpaperDetailId;
        }
        if (childWorkPaperId) {
          filterDataSet.childWorkPaperId = childWorkPaperId;
        }
        let updatedFilter = {};
        let updateFilObj = [];
        if (filterData?.filters?.length > 0) {
          const getMergedNewFilterData = mergeArrays(filterData?.filters, selectedFilterData);
          updatedFilter = { ...filterData, filters: [...getMergedNewFilterData] };
          if (filterDataSet?.filters?.length > 1) {
            filterDataSet.filters = getUniqueDataAndKeepLastOccurrence(filterDataSet?.filters);
          }
          updateFilObj = filterDataSet?.filters?.filter(
            item =>
              !updatedFilter?.filters?.find(
                rm => rm?.columnName === item?.columnName && rm?.tableName === item?.tableName
              )
          );
          updateFilObj?.forEach(filter => filter !== null && updatedFilter?.filters?.push(filter));
          if (updatedFilter?.filters?.length > ChildWorkpaperFilter.MaxFilterRows) {
            setLimitExceeds(true);
          } else {
            updatedFilter.filters = getUniqueDataAndKeepLastOccurrence(updatedFilter?.filters);
            setFilterData({ ...updatedFilter });
          }
        } else {
          setFilterData(filterDataSet);
        }
      }
    }
  };

  const optionChange = changedValues => {
    const receivedUniqueData = getUniqueDataAndKeepLastOccurrence(changedValues);
    if (selectedValue !== 0) {
      const selectedTableName = outputs?.dataTable?.filter(x => x.id === selectedValue)?.[0]?.name;

      const getFilterData = receivedUniqueData.map(event => {
        if (event?.columnName && event?.filterValue) {
          return {
            id: uuidv4(),
            tableId: selectedValue,
            tableName: selectedTableName,
            columnName: event.columnName,
            filterValue: event.filterValue,
            hasFilter: true,
          };
        }

        return null;
      });
      setselectedFilterData(getFilterData);
    }
  };

  const saveWorkPaper = wpFilterData => {
    const allowSave = !editChildWPClick ? childworkpaperCount < maxChildWPLimit : editChildWPClick;
    if (isNameReq || isNameDup || isNameMaxLengthTouch) {
      scrollToTop();
    } else if (wpFilterData && allowSave) {
      const filterDataObj = wpFilterData;
      setWpCountErrorMessage(false);
      filterDataObj.childWorkpaperName = formValues[NAME];
      filterDataObj.description = formValues[DESCRIPTION];
      dispatch(saveWorkPaperFilterData(filterDataObj, addGlobalError, editChildWPClick)).then(resp => {
        if (resp) {
          setloading(true);
          dispatch(getChildWorkPapers(filterDataObj?.parentWorkPaperId || filterDataObj?.parentWorkpaperId));
          setEditChildWPClick(false);
          setEditChildWPDetails({});
          setFiltersOpen(false);
          setAddNewChild(false);
          setFilterData({});
          setFormValue(formValue);
          setNameDup(false);
          setNameReq(false);
          setSelectedValue(0);
          setselectedFilterData([]);
          setloading(false);
        }
      });
    } else if (wpFilterData) {
      setWpCountErrorMessage(true);
      scrollToTop();
    }
  };
  useEffect(() => {
    const newFormValue = { ...formValues, ...nameAndDescriptionValue };
    if (editChildWPClick) {
      setFormValue(newFormValue);
      setEnsureFilter(isFilterApplied);
      if (editChildWPDetails?.filters?.length) {
        editChildWPDetails.filters = editChildWPDetails.filters.sort(sortDataByTableName);
      }
      setFilterData(editChildWPDetails);
    }
  }, [nameAndDescriptionValue, editChildWPClick]);

  useEffect(() => {
    if (editChildWPClick && outputs?.dataTable?.length > 0) {
      const filterValue = editChildWPDetails?.filters?.[0]?.tableName;
      const data = outputs.dataTable;
      const index = data.findIndex(item => item.name === filterValue);
      const { id } = data?.[index];
      setSelectedValue(id);
    }
  }, [editChildWPDetails, editChildWPClick, loading, outputs?.dataTable]);

  useEffect(() => {
    let masterData = output?.schema;
    const childData = editChildWPDetails?.filters;
    if (masterData && childWpColumns?.length > 0) {
      const childWpColumnsNotCaseSensitive = childWpColumns.map(item => {
        return item.toLowerCase();
      });
      masterData = masterData.filter(col => {
        return childWpColumnsNotCaseSensitive.includes(col.name.toLowerCase());
      });
    }
    if (masterData && childData && editChildWPClick) {
      masterData = masterData.map(obj => {
        const { name } = obj;
        const objThatExist = childData.find(o => o.columnName === name);

        return { ...obj, ...objThatExist };
      });
      setMutliSelectDropdownData(masterData);
      optionChange(masterData);
      if (masterData.length === 0) {
        setColumnsMsg(true);
      } else {
        setColumnsMsg(false);
      }
    } else if (masterData) {
      setMutliSelectDropdownData(masterData);
      if (masterData.length === 0) {
        setColumnsMsg(true);
      } else {
        setColumnsMsg(false);
      }
    }
  }, [output, editChildWPDetails]);

  return (
    <Spinner spinning={selectSavingChildWorkpaperFilterData}>
      <Container pb={20} mt={35}>
        <Box ml={12} pl={5}>
          {!ensureValidation && (
            <Alert
              message={t('Components_CHILDWPFILTER_Validation_Error')}
              type={AlertTypes.WARNING}
              mb={5}
              id={`${COMPONENT_NAME}_Warning_Modified`}
              onClose={() => setEnsureValidation(true)}
              dataInstance={`${COMPONENT_NAME}_Warning_Modified_ensureValidation`}
            />
          )}
          {showWPErrorMsg && (
            <Alert
              message={t('Components_ChildWp_Save_WorkPaper_Max_Error')}
              type={AlertTypes.WARNING}
              mb={5}
              id={`${COMPONENT_NAME}_Warning_Modified`}
              onClose={() => setWpCountErrorMessage(false)}
              dataInstance={`${COMPONENT_NAME}_Warning_Modified`}
            />
          )}
          {isNameInputNameMaxLengthTouch && (
            <Alert
              message={t('Components_AddWorkpaperModal_Name_AND_InputName_Maximum_Length_Error')}
              type={AlertTypes.WARNING}
              mb={5}
              id={`${COMPONENT_NAME}_NameValidation`}
              onClose={() => setNameInputNameMaxLengthTouch(false)}
              dataInstance={`${COMPONENT_NAME}_NameValidation`}
            />
          )}
          <Flex dataInstance={`${COMPONENT_NAME}-Parent`}>
            <Text type={TextTypes.H6} fontWeight='s' mt='3' mr='5'>
              {`${t('Components_CHILDWPFILTER_NAME_INPUT_TITLE')} :`}
            </Text>
            <Input
              required
              value={formValues[NAME]}
              hint={getHintOrIntent(INPUT_CONTROL_PROPTYPES.HINT)}
              intent={getHintOrIntent(INPUT_CONTROL_PROPTYPES.INTENT)}
              placeholder={t('Components_CHILDWPFILER_NAME_PLACEHOLDER')}
              width='30%'
              onChange={event => {
                onChangeInput(NAME, event);
              }}
              onBlur={event => {
                onValidateWPName(event);
              }}
              dataInstance={`${COMPONENT_NAME}-WorkpaperName`}
            />

            <Text type={TextTypes.H6} fontWeight='s' mt='3' ml='13' mr='5'>
              {`${t('Components_CHILDWPFILTER_DESC_INPUT_TITLE')} :`}
            </Text>

            <Input
              value={formValues[DESCRIPTION]}
              placeholder={t('Components_CHILDWPFILER_DESC_PLACEHOLDER')}
              width='45%'
              onChange={event => {
                onChangeInput(DESCRIPTION, event);
              }}
              dataInstance={`${COMPONENT_NAME}-WorkpaperDescription`}
            />
          </Flex>
          <Flex>
            <Box alignItems='right' width='100%' mt='10' ml='42%'>
              <RadioGroup
                dataInstance={`${COMPONENT_NAME}-FilterOption`}
                fontWeight='s'
                options={getFilterSelectionOptions(t)}
                selectedValue={ensureFilter}
                onOptionChange={value => setEnsureFilter(value)}
              />
            </Box>
          </Flex>
          <Flex>
            <Box alignItems='left' width='35%'>
              <Text type={TextTypes.H6} fontWeight='s' mt='10' mr='5' mb='5'>
                {`${t('Components_CHILDWPFILTER_TABLE_INPUT_TITLE')} :`}
              </Text>
              {!isLoading && (
                <Spinner spinning={syncingOutputs}>
                  <Box my={8} mt='1' width='355px'>
                    {!loading && (
                      <DropDownRadioSelect
                        name='Select'
                        options={outputs?.dataTable?.map(x => {
                          return { value: x.id, label: x.name };
                        })}
                        fontWeight='s'
                        selectedValue={selectedValue}
                        onOptionChange={value => setSelectedValue(value)}
                        py={8}
                        borderColor='lightGray'
                        borderTop={1}
                        borderBottom={1}
                        dataInstance={`${COMPONENT_NAME}-DrpDownRadioSelect`}
                        editChildWPClick={editChildWPClick}
                      />
                    )}
                  </Box>
                </Spinner>
              )}
            </Box>
            {ensureFilter && (
              <Box alignItems='right' width='55%' ml='13'>
                {!syncingOutputs && (
                  <Text type={TextTypes.H6} fontWeight='s' mt='10' mb='5'>
                    {`${t('Components_CHILDWPFILER_COLUMNS_INPUT_TITLE')} :`}
                  </Text>
                )}
                {!syncingOutputs && (
                  <Spinner
                    spinning={selectIsFetchingOutput}
                    dataInstance={`${COMPONENT_NAME}-DrpDownMultiSelect_Loader`}
                  >
                    <Box my={8} mt='1'>
                      {!loading && !showColumnsMsg && (
                        <DropdownMultiSelect
                          name='Columns in'
                          dropdownValues={mutliSelectDropdownData.map(x => {
                            return { id: x.name, column: x.name, columnName: x.name, filterValue: x.filterValue };
                          })}
                          dataInstance={`${COMPONENT_NAME}-DrpDownMultiSelect`}
                          onChangeFilter={optionChange}
                          selectedSource={selectedValue || 0}
                          editChildWPClick={editChildWPClick}
                        />
                      )}
                      {showColumnsMsg && (
                        <Text fontWeight='m' mr={5} mt={5}>
                          {`${t('Components_CHILDWP_COLUMNS_Error')} `}
                        </Text>
                      )}
                    </Box>
                  </Spinner>
                )}
              </Box>
            )}
          </Flex>
          <Flex justifyContent='flex-end'>
            {limitExceeds && (
              <Text color='red' fontWeight='m' mr={5} mt={5}>
                {`${t('Components_Child_Workpaper_FilterGrid_Save_WorkPaper_Max_Rows')} `}
              </Text>
            )}
            <Button
              type={ButtonTypes.PRIMARY}
              mr={4}
              onClick={handleAddFilter}
              dataInstance={`${COMPONENT_NAME}_AddFilter`}
            >
              <Text type={TextTypes.H3}>{t('Components_Child_Workpaper_FilterGrid_Add_Filter')}</Text>
            </Button>
          </Flex>
          <FilterGrid
            filterData={filterData}
            setFilterData={setFilterData}
            setAddNewChild={setAddNewChild}
            dataInstance={`${COMPONENT_NAME}_FilterGrid`}
          />
          {filterData?.filters?.length > 0 && (
            <Flex justifyContent='flex-end'>
              <Button
                type={ButtonTypes.PRIMARY}
                onClick={() => saveWorkPaper(filterData)}
                dataInstance={`${COMPONENT_NAME}_SaveButton`}
              >
                <Text type={TextTypes.H3}>{t('Components_Child_Workpaper_FilterGrid_Save_WorkPaper')}</Text>
              </Button>
            </Flex>
          )}
        </Box>
      </Container>
    </Spinner>
  );
};

FilterForm.propTypes = {
  engagementId: PropTypes.string.isRequired,
  formState: PropTypes.shape({}).isRequired,
  formValue: PropTypes.shape({}).isRequired,
};

export default FilterForm;
