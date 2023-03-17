import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import {
  Box,
  Spinner,
  Input,
  Intent,
  Select,
  SelectTypes,
  Textarea,
  AlertHub,
  Radio,
  TextTypes,
  Text,
  Flex,
  Tag,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation from '../../../../../../hooks/useTranslation';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { errorsSelectors } from '../../../../../../store/errors/selectors';
import { deleteDMFieldError } from '../../../../../../store/errors/actions';
import { bundlesSelectors } from '../../../../../../store/bundles/selectors';
import { commonDatamodelSelectors } from '../../../../../../store/contentLibrary/commonDataModels/selectors';
import { DMFieldContainer } from '../../../DataModelDetail/components/AddDMFieldModal/DMFieldModal.styled';
import PropTypes from 'prop-types';
import { dataModelDetails, DM_FIELD_CLASSIFICATION_VALUES } from '../../../constants/constants';
import { Header } from '../../../../../../components/InputUploaderModal/components/Header/Header';
import { StyledInputArea, ConflictedAliasHint } from '../styledComponent';

const COMPONENT_NAME = 'CREATE_NEW_DM_MODAL';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateNewDataModel = forwardRef((props, ref) => {
  const { formValue, formState, handleChanges, handleFormState, handlePrimaryButtonClick, isAddDM } = props;
  const {
    NAME_TECH,
    NAME_NONTECH,
    DESCRIPTION,
    TABLE_ALIAS,
    TEXT_ALIASES,
    ALIAS_FREE_TEXT_ERROR,
    TAG_IDS,
    CDM_ID,
    CLASSIFICATION,
  } = dataModelDetails;
  const dispatch = useDispatch();
  const selectDMFieldErrors = useSelector(errorsSelectors.selectDMFieldErrors);
  const selectTags = useSelector(bundlesSelectors.selectTagsPublishedList);
  const isTagsLoading = useSelector(bundlesSelectors.selectFetchingTagsPublished);
  const isCdmListLoading = useSelector(commonDatamodelSelectors.isFetchingCDMs);
  const commonDataModelList = useSelector(commonDatamodelSelectors.commonDatamodels);
  const isDMUpdating = useSelector(contentLibraryDMSelectors.isDMUpdating);
  const [tags, setTags] = useState([]);
  const [cdmListOptions, setCdmListOptions] = useState([]);
  const [titleText, setTitleText] = useState('');
  const [isInvalidCDMText, setIsInvalidCDMText] = useState(false);
  const [invalidCDMHint, setInvalidCDMHint] = useState('');

  const { t } = useTranslation();
  const aliasTextErrorMessage = `Components_AddNewWorkpaperModal_Alias_Validation_Error`;
  const freeTextAliasesvalidPattern = /^[A-Za-z0-9_,]+$/;

  const isValidRequiredField = value => {
    if (value && value.length > 0) {
      return value?.indexOf('.') > -1 ? t('Components_AddDMModal_Validation_Error') : '';
    }

    return t('Components_AddNewWorkpaperModal_Validation_Error');
  };

  const isValidText = (value = '', matchPattern, errorMessage = aliasTextErrorMessage) => {
    if (!value) {
      return '';
    }

    return value && value.match(matchPattern) ? '' : t(errorMessage);
  };

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...formValue, [key]: newValue };

    const isValidAliasFreeText = isValidText(
      newFormValue?.textAliases,
      freeTextAliasesvalidPattern,
      aliasTextErrorMessage
    );

    newFormValue['aliasFreeTextError'] = isValidAliasFreeText;

    handleChanges(newFormValue);

    const { nameTech, description, tableAlias, textAliases, nameNonTech, tagIds, cdmId, classification } = newFormValue;
    const formValues = {
      [NAME_TECH]: (nameTech || '').trim(),
      [NAME_NONTECH]: (nameNonTech || '').trim(),
      [TABLE_ALIAS]: tableAlias || [],
      [TEXT_ALIASES]: textAliases || '',
      [DESCRIPTION]: (description || '').trim(),
      [TAG_IDS]: (tagIds || []).map(({ id }) => id),
      [CDM_ID]: cdmId && cdmId.length > 0 ? [{ id: cdmId[0].id, name: cdmId[0].name }] : [],
      [CLASSIFICATION]: classification,
      [ALIAS_FREE_TEXT_ERROR]: isValidAliasFreeText || '',
    };

    handleFormState(formValues, isValidRequiredField(formValues[NAME_TECH]) || !!isValidAliasFreeText);
  };

  const handleDeleteAlias = (aliasType, index) => {
    const modifiedAliasesList = [...formValue[aliasType]];
    modifiedAliasesList.splice(index, 1);
    setNewValue(aliasType, modifiedAliasesList);
  };

  const showErrors = {
    [NAME_TECH]: formState.submitted ? isValidRequiredField(formState.value[NAME_TECH]) : '',
  };
  const onTextchangeCDM = invalidCDMText => {
    if (!invalidCDMText) {
      setIsInvalidCDMText(false);
      setInvalidCDMHint('');
    } else {
      setIsInvalidCDMText(true);
    }
  };
  const getFieldModal = () => {
    const nameError = showErrors[NAME_TECH];

    return (
      <Spinner spinning={isDMUpdating}>
        <DMFieldContainer>
          <Input
            required
            label={t('Pages_Content_Library_DataModel_Fields_Headers_TableTech')}
            value={formValue[NAME_TECH] || ''}
            hint={nameError}
            intent={nameError ? Intent.ERROR : ''}
            onChange={e => setNewValue(NAME_TECH, e.currentTarget.value)}
            placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldNameTech`}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Input
            label={t('Pages_Content_Library_DataModel_Fields_Headers_TableNonTech')}
            value={formValue[NAME_NONTECH] || ''}
            intent={showErrors[NAME_NONTECH] ? Intent.ERROR : ''}
            onChange={e => setNewValue(NAME_NONTECH, e.currentTarget.value)}
            placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldNameNonTech`}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Text type={TextTypes.BODY} fontSize='12px' fontWeight='m' mb={3}>
            {t('Pages_Content_Library_DataModel_Fields_Headers_TABLE_ALIASES')}
          </Text>
          <StyledInputArea
            dataInstance={`${COMPONENT_NAME}-Table-ALIASES-CHIPS_WRAPPER`}
            className='CHIPS-Table-ALIASES_WRAPPER'
            isConflictingAlias={formValue[ALIAS_FREE_TEXT_ERROR]}
            isFreeTextError={!!formValue[ALIAS_FREE_TEXT_ERROR]}
          >
            <>
              {formValue[TABLE_ALIAS]?.map((eachAlias, index) => {
                if (eachAlias) {
                  return (
                    <Tag
                      dataInstance={`${COMPONENT_NAME}-Table-ALIASES-CHIPS-${eachAlias}`}
                      key={index}
                      style={{ margin: '0.5%' }}
                      isClosable
                      onClose={() => {
                        handleDeleteAlias(TABLE_ALIAS, index);
                      }}
                    >
                      {eachAlias}
                    </Tag>
                  );
                }

                return null;
              })}
              <Input
                value={formValue[TEXT_ALIASES] || ''}
                style={{ flexGrow: '1', margin: '0,5% 0%' }}
                onChange={e => setNewValue(TEXT_ALIASES, e.currentTarget.value)}
                dataInstance={`${COMPONENT_NAME}-TableAlias`}
                className='FREE-TEXT-ALIASES'
              />
            </>
          </StyledInputArea>
          {formValue[ALIAS_FREE_TEXT_ERROR] && (
            <ConflictedAliasHint type={TextTypes.H4}>{t(aliasTextErrorMessage)}</ConflictedAliasHint>
          )}
        </DMFieldContainer>
        <DMFieldContainer>
          <Select
            type={SelectTypes.MULTIPLE}
            label={t('Components_AddNewWorkpaperModal_Tags')}
            hint={showErrors[TAG_IDS] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
            intent={showErrors[TAG_IDS] ? Intent.ERROR : ''}
            options={tags}
            filtering
            value={formValue[TAG_IDS] || []}
            onChange={e =>
              setNewValue(
                TAG_IDS,
                Object.keys(e).map(key => e[key])
              )
            }
            loading={isTagsLoading}
            emptyMessage={t('Components_AddNewWorkpaperModal_Tags_Placeholder')}
            optionValueKey='id'
            optionTextKey='name'
            childrenListKey='tags'
            dataInstance={`${COMPONENT_NAME}-Tags`}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Components_CommonDataModelList_Name')}
            options={cdmListOptions}
            filtering
            value={formValue[CDM_ID]}
            onChange={e =>
              setNewValue(
                CDM_ID,
                Object.keys(e).map(key => e[key])
              )
            }
            onInputChange={onTextchangeCDM}
            loading={isCdmListLoading}
            emptyMessage={t('Components_CommonDataModelList_Name_Placeholder')}
            optionValueKey='id'
            optionTextKey='name'
            hint={invalidCDMHint}
            intent={invalidCDMHint ? Intent.ERROR : ''}
            dataInstance={`${COMPONENT_NAME}-FieldCommonDataModels`}
          />
        </DMFieldContainer>

        <DMFieldContainer>
          <Textarea
            value={formValue[DESCRIPTION] || []}
            onChange={e => setNewValue(DESCRIPTION, e.currentTarget.value)}
            label={t('Components_AddNewWorkpaperModal_Description')}
            placeholder={t('Components_AddNewWorkpaperModal_Description_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldDescription`}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Box>
            <Text type={TextTypes.H4} fontWeight='m' mb={3}>
              {t('Components_AddNewWorkpaperModal_Classification')}
            </Text>
            <Flex>
              {DM_FIELD_CLASSIFICATION_VALUES.map(eachValue => {
                return (
                  <Flex pr={11} key={eachValue}>
                    <Radio
                      name={CLASSIFICATION}
                      dataInstance={`${COMPONENT_NAME}-Field-${eachValue}`}
                      py={4}
                      value={eachValue}
                      onOptionSelected={value => setNewValue(CLASSIFICATION, value)}
                      checked={formValue[CLASSIFICATION] === eachValue}
                    />
                    <Text fontWeight='s' type={TextTypes.BODY} py={4} ml={-3}>
                      {t(`Components_AddNewWorkpaperModal_${eachValue}`)}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </DMFieldContainer>
      </Spinner>
    );
  };

  const onErrorClose = errorKey => {
    dispatch(deleteDMFieldError(errorKey));
  };

  useEffect(() => {
    if (selectTags?.items?.length > 0) {
      const publishedTags = selectTags.items.filter(tag => tag?.tags?.length > 0);
      setTags(publishedTags || []);
    }
  }, [selectTags]);

  useEffect(() => {
    if (commonDataModelList?.length > 0) {
      setCdmListOptions(commonDataModelList || []);
    }
  }, [commonDataModelList]);

  useImperativeHandle(ref, () => ({
    submit() {
      if (isInvalidCDMText) {
        setInvalidCDMHint(t('Components_AddNewWorkpaperModal_CDM_Validation_Error'));
      } else {
        handlePrimaryButtonClick();
      }
    },
  }));

  useEffect(() => {
    if (isAddDM) {
      setTitleText(t('Components_InputUploaderModal_Trifacta_Upload_DM'));
    } else {
      setTitleText(t('Components_InputUploaderModal_Trifacta_Edit_DM'));
    }
  }, [isAddDM]);

  let objAliasDMFieldError = null;
  let arrstrSelectDMFieldErrors = [];

  if (selectDMFieldErrors[0]?.body?.errors[0]?.msg.includes('|')) {
    arrstrSelectDMFieldErrors = selectDMFieldErrors[0]?.body?.errors[0]?.msg.split('|');
  }

  if (arrstrSelectDMFieldErrors && arrstrSelectDMFieldErrors.length > 1) {
    const [, strAliasNameErrorMsg] = arrstrSelectDMFieldErrors;

    objAliasDMFieldError = JSON.parse(JSON.stringify(selectDMFieldErrors));

    objAliasDMFieldError[0].message = strAliasNameErrorMsg;
  }

  if (objAliasDMFieldError && objAliasDMFieldError[0]) {
    selectDMFieldErrors.push(objAliasDMFieldError[0]);
  }

  const uniqueSelectDMFieldErrorMsgs = [];
  const uniqueSelectDMFieldErrors = selectDMFieldErrors.filter(element => {
    const isDuplicate = uniqueSelectDMFieldErrorMsgs.includes(element.message);

    if (!isDuplicate) {
      uniqueSelectDMFieldErrorMsgs.push(element.message);

      return true;
    }

    return false;
  });

  return (
    <>
      <Header titleText={titleText} pb={3} />
      {uniqueSelectDMFieldErrors.map(currentValue => (
        <AlertHub key={currentValue.message.replaceAll(/\s/g, '')} alerts={currentValue} onClose={onErrorClose} />
      ))}

      {getFieldModal()}
    </>
  );
});

CreateNewDataModel.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  formValue: PropTypes.shape({}).isRequired,
  handleChanges: PropTypes.func.isRequired,
  handleFormState: PropTypes.func.isRequired,
};

export default CreateNewDataModel;
