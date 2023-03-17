import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Tag,
  TextTypes,
  AlertHub,
  Modal,
  ModalSizes,
  Spinner,
  Input,
  Intent,
  Text,
  Select,
  SelectTypes,
  Textarea,
  Checkbox,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { errorsSelectors } from '../../../../../../store/errors/selectors';
import { deleteDMFieldError } from '../../../../../../store/errors/actions';
import { StyledInputArea, ConflictedAliasHint } from '../styledComponents';
import { DMFieldContainer } from './DMFieldModal.styled';
import {
  dmFieldDetailsInnerHeaderCheckBox,
  dmFieldDetailsTopHeaderCheckBox,
  dmFieldDetailsInnerHeader,
  dmFieldCheckboxDisable,
  dmFieldDetails,
  aliasesUtilities,
} from '../../../constants/constants';

const COMPONENT_NAME = 'DM_FIELD_MODAL';

const validPattern = /^[A-Za-z0-9_]+$/;
const freeTextAliasesvalidPattern = /^[A-Za-z0-9_,]+$/;

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddDMFieldModal = forwardRef((props, ref) => {
  const {
    isModalOpen,
    handleClose,
    dataInstance,
    loading,
    formValue,
    formState,
    handleChanges,
    handleFormState,
    handlePrimaryButtonClick,
    isAddField,
    entityDateField,
  } = props;

  const {
    NAME_TECH,
    NAME_NONTECH,
    TYPE,
    DESCRIPTION,
    MODEL_TAGS,
    RELEASE,
    ANALYTICS_SUPPORT,
    SOURCE_OF_TERM,
    ALIASES,
    BUSINESS_RULES,
    TRANSFORMATON_RULES,
    RECONCILIATION,
    KEY,
    MANDATORY,
    TIME_FILTER,
    ENTITY_FILTER,
  } = dmFieldDetails;

  const {
    CONFLICTED_ALIASES,
    TEXT_ALIASES,
    CONFLICTING_NAME_TECH,
    ALIAS_CONFLICTED_TEXT_ERROR,
    ALIAS_FREE_TEXT_ERROR,
  } = aliasesUtilities;

  const dispatch = useDispatch();
  const fieldTypes = useSelector(contentLibraryDMSelectors.fieldTypes);
  const selectDMFieldErrors = useSelector(errorsSelectors.selectDMFieldErrors);

  const { t } = useTranslation();

  const aliasTextErrorMessage = `Pages_Content_Library_Alias_Validation_Error`;
  const nameValidation = `Pages_Content_Library_DMFields_Name_Validation_Error`;

  const isValidRequiredField = value => !!(value && value.length);

  const isValidText = (value = '', matchPattern, errorMessage = nameValidation) => {
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
    const isValidAliasConflictedText = isValidText(
      newFormValue?.conflictedAliases?.join(),
      validPattern,
      aliasTextErrorMessage
    );

    newFormValue['aliasFreeTextError'] = isValidAliasFreeText;
    newFormValue['aliasConflictedTextError'] = isValidAliasConflictedText;

    handleChanges(newFormValue);
    const {
      nameTech,
      description,
      nameNonTech,
      type,
      modelTags,
      release,
      analyticsSupported,
      sourceOfTerm,
      aliases,
      conflictedAliases,
      textAliases,
      businessRules,
      transformationRules,
      requiredforReconciliation,
      isKey,
      isMandatory,
      isTimeFilter,
      isEntityFilter,
    } = newFormValue;
    const dataType = (type || [])[0];

    const formValues = {
      [NAME_TECH]: (nameTech || '').trim(),
      [NAME_NONTECH]: (nameNonTech || '').trim(),
      [DESCRIPTION]: (description || '').trim(),
      [TYPE]: dataType ? dataType.code : '',
      [MODEL_TAGS]: (modelTags || '').trim(),
      [RELEASE]: (release || '').trim(),
      [ANALYTICS_SUPPORT]: (analyticsSupported || '').trim(),
      [SOURCE_OF_TERM]: (sourceOfTerm || '').trim(),
      [ALIASES]: aliases || [],
      [CONFLICTED_ALIASES]: conflictedAliases || [],
      [TEXT_ALIASES]: textAliases || '',
      [BUSINESS_RULES]: (businessRules || '').trim(),
      [TRANSFORMATON_RULES]: (transformationRules || '').trim(),
      [RECONCILIATION]: requiredforReconciliation,
      [KEY]: isKey,
      [MANDATORY]: isMandatory,
      [TIME_FILTER]: isTimeFilter,
      [ENTITY_FILTER]: isEntityFilter,
      [ALIAS_FREE_TEXT_ERROR]: isValidAliasFreeText || '',
      [ALIAS_CONFLICTED_TEXT_ERROR]: isValidAliasConflictedText || '',
    };
    handleFormState(
      formValues,
      isValidText(formValues[NAME_TECH], validPattern) ||
        !isValidRequiredField(formValues[TYPE]) ||
        !isValidRequiredField(formValues[NAME_TECH]) ||
        !isValidRequiredField(formValues[DESCRIPTION]) ||
        !isValidRequiredField(formValues[NAME_NONTECH]) ||
        !!isValidAliasFreeText ||
        !!isValidAliasConflictedText
    );
  };

  const handleEditConflictedAlias = (value, index) => {
    const modifiedAliasesList = [...formValue[CONFLICTED_ALIASES]];
    modifiedAliasesList[index] = value;
    setNewValue(CONFLICTED_ALIASES, modifiedAliasesList);
  };

  const handleDeleteAlias = (aliasType, index) => {
    const modifiedAliasesList = [...formValue[aliasType]];
    modifiedAliasesList.splice(index, 1);
    setNewValue(aliasType, modifiedAliasesList);
  };

  const showErrors = {
    [TYPE]: !isValidRequiredField(formState.value[TYPE]) && formState.submitted,
    [NAME_TECH]: !isValidRequiredField(formState.value[NAME_TECH]) && formState.submitted,
    [DESCRIPTION]: !isValidRequiredField(formState.value[DESCRIPTION]) && formState.submitted,
    [NAME_NONTECH]: !isValidRequiredField(formState.value[NAME_NONTECH]) && formState.submitted,
  };

  const onModalClose = () => {
    handleClose();
  };

  const getIsDisabled = eachCheckBox => {
    const valueIndex = dmFieldCheckboxDisable.indexOf(eachCheckBox);
    // valueIndex can be 0,1 for dmFieldDetailsInnerHeaderCheckBox.length ===2

    return (
      // if same checkbox {eachCheckBox} is pre selected in onther DM field
      (entityDateField?.[dmFieldCheckboxDisable[valueIndex]] &&
        entityDateField[dmFieldCheckboxDisable[valueIndex]] !== formValue.id) ||
      // if other checkbox {not eachCheckBox} is pre selected in same DM field
      formValue[dmFieldDetailsInnerHeaderCheckBox[dmFieldCheckboxDisable[1 - valueIndex]]]
    );
  };

  const getFieldModal = () => {
    const nameError = showErrors[NAME_TECH]
      ? t('Components_AddNewWorkpaperModal_Validation_Error')
      : isValidText(formValue[NAME_TECH], validPattern);

    const getHintNameTech = () => {
      if (formState.value?.[CONFLICTING_NAME_TECH]) return formState.value[CONFLICTING_NAME_TECH];

      return nameError;
    };

    return (
      <Spinner spinning={loading}>
        <DMFieldContainer>
          <div ref={ref.dmFieldNameRef} key={`${COMPONENT_NAME}-Field-NAME_TECH-Wrapper`}>
            <Input
              required
              label={t('Pages_Content_Library_DataModel_Fields_Headers_NAME_TECH')}
              value={formValue[NAME_TECH] || ''}
              hint={getHintNameTech()}
              intent={nameError || formState.value[CONFLICTING_NAME_TECH] ? Intent.ERROR : ''}
              onChange={e => setNewValue(NAME_TECH, e.currentTarget.value)}
              placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
              dataInstance={`${COMPONENT_NAME}-Field-NAME_TECH`}
            />
          </div>
        </DMFieldContainer>
        <DMFieldContainer>
          <Input
            required
            label={t('Pages_Content_Library_DataModel_Fields_Label_NAME_NONTECH')}
            value={formValue[NAME_NONTECH] || ''}
            intent={showErrors[NAME_NONTECH] ? Intent.ERROR : ''}
            onChange={e => setNewValue(NAME_NONTECH, e.currentTarget.value)}
            placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-Field-NAME_NONTECH`}
            hint={showErrors[NAME_NONTECH] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Select
            required
            type={SelectTypes.SINGLE}
            label={t('Pages_Content_Library_DataModel_Fields_Headers_TYPE')}
            hint={showErrors[TYPE] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
            intent={showErrors[TYPE] ? Intent.ERROR : ''}
            options={fieldTypes}
            value={formValue[TYPE] || []}
            onChange={e =>
              setNewValue(
                TYPE,
                Object.keys(e).map(key => e[key])
              )
            }
            loading={false}
            emptyMessage={t('Components_AddNewWorkpaperModal_Tags_Placeholder')}
            optionValueKey='code'
            optionTextKey='displayName'
            childrenListKey='tags'
            dataInstance={`${COMPONENT_NAME}-TYPE`}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Textarea
            required
            value={formValue[DESCRIPTION] || []}
            onChange={e => setNewValue(DESCRIPTION, e.currentTarget.value)}
            label={t('Pages_Content_Library_DataModel_Fields_Headers_DESCRIPTION')}
            placeholder={t('Components_AddNewWorkpaperModal_Description_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-Field-DESCRIPTION`}
            hint={showErrors[DESCRIPTION] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
            intent={showErrors[DESCRIPTION] ? Intent.ERROR : Intent.INFO}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <div ref={ref.dmFieldAlisesRef} key={`${COMPONENT_NAME}-Field-Aliases-Wrapper`}>
            <Text type={TextTypes.H4} fontWeight='m' mb={2} display='inline-block'>
              {t('Pages_Content_Library_DataModel_Fields_Headers_ALIASES')}
            </Text>
            <StyledInputArea
              dataInstance={`${COMPONENT_NAME}-Field-ALIASES-CHIPS-FIELD_WRAPPER`}
              className='CHIPS-FIELD_WRAPPER'
              isConflictingAlias={
                formValue[ALIAS_FREE_TEXT_ERROR] ||
                formValue[ALIAS_CONFLICTED_TEXT_ERROR] ||
                formValue[CONFLICTED_ALIASES].length > 0
              }
              isFreeTextError={!!formValue[ALIAS_FREE_TEXT_ERROR]}
            >
              <>
                {formValue[ALIASES]?.map((eachAlias, index) => {
                  if (eachAlias) {
                    return (
                      <Tag
                        dataInstance={`${COMPONENT_NAME}-Field-ALIASES-CHIPS-NonConflicting-${eachAlias}`}
                        key={index}
                        style={{ margin: '0.5%' }}
                        isClosable
                        onClose={() => {
                          handleDeleteAlias(ALIASES, index);
                        }}
                      >
                        {eachAlias}
                      </Tag>
                    );
                  }

                  return null;
                })}
                {formValue[CONFLICTED_ALIASES]?.map((eachAlias, index) => {
                  return (
                    <Tag
                      dataInstance={`${COMPONENT_NAME}-Field-ALIASES-CHIPS-Conflicting-${eachAlias}`}
                      type='error'
                      key={index}
                      style={{ margin: '0.5%' }}
                      isEditable
                      editableTextValue={eachAlias}
                      onEditText={event => {
                        handleEditConflictedAlias(event.target.value, index);
                      }}
                      isClosable
                      onClose={() => {
                        handleDeleteAlias(CONFLICTED_ALIASES, index);
                      }}
                    />
                  );
                })}
                <Input
                  value={formValue[TEXT_ALIASES]}
                  onChange={e => {
                    setNewValue(TEXT_ALIASES, e.currentTarget.value);
                  }}
                  style={{ flexGrow: '1', margin: '0,5% 0%' }}
                  placeholder={t('Components_AddNewWorkpaperModal_Aliases_Placeholder')}
                  dataInstance={`${COMPONENT_NAME}-ALIASES`}
                  className='FREE-TEXT-ALIASES'
                />
              </>
            </StyledInputArea>

            {(formValue[ALIAS_CONFLICTED_TEXT_ERROR] || formValue[ALIAS_FREE_TEXT_ERROR]) && (
              <ConflictedAliasHint type={TextTypes.H4}>{t(aliasTextErrorMessage)}</ConflictedAliasHint>
            )}
            {formValue[CONFLICTED_ALIASES].length > 0 && (
              <ConflictedAliasHint type={TextTypes.H4}>
                {t(`Components_AddNewWorkpaperModal_Aliases_Conflict_Error`)}
              </ConflictedAliasHint>
            )}
          </div>
        </DMFieldContainer>
        <>
          {Object.keys(dmFieldDetailsInnerHeader).map(eachField => {
            return (
              <DMFieldContainer key={eachField}>
                <Input
                  label={t(`Pages_Content_Library_DataModel_Fields_Headers_${eachField}`)}
                  value={formValue[dmFieldDetails[eachField]] || ''}
                  onChange={e => setNewValue(dmFieldDetails[eachField], e.currentTarget.value)}
                  placeholder={t(`Components_AddNewWorkpaperModal_${eachField}_Placeholder`)}
                  dataInstance={`${COMPONENT_NAME}-${eachField}`}
                />
              </DMFieldContainer>
            );
          })}
        </>
        <>
          {Object.keys({ ...dmFieldDetailsTopHeaderCheckBox }).map(eachCheckBox => {
            return (
              <DMFieldContainer key={eachCheckBox}>
                <Checkbox
                  dataInstance={`${COMPONENT_NAME}_Field_${eachCheckBox}`}
                  label={t(`Pages_Content_Library_DataModel_Fields_Headers_${eachCheckBox}`)}
                  isChecked={!!formValue[dmFieldDetails[eachCheckBox]]}
                  onChange={event => {
                    setNewValue(dmFieldDetails[eachCheckBox], event.target.checked);
                  }}
                />
              </DMFieldContainer>
            );
          })}
        </>
        <>
          {Object.keys({ ...dmFieldDetailsInnerHeaderCheckBox }).map(eachCheckBox => {
            return (
              <DMFieldContainer key={eachCheckBox}>
                <Checkbox
                  dataInstance={`${COMPONENT_NAME}_Field_${eachCheckBox}`}
                  label={t(`Pages_Content_Library_DataModel_Fields_Headers_${eachCheckBox}`)}
                  isChecked={!!formValue[dmFieldDetails[eachCheckBox]]}
                  onChange={event => {
                    setNewValue(dmFieldDetails[eachCheckBox], event.target.checked);
                  }}
                  disabled={getIsDisabled(eachCheckBox)}
                />
              </DMFieldContainer>
            );
          })}
        </>
      </Spinner>
    );
  };

  const onErrorClose = errorKey => {
    dispatch(deleteDMFieldError(errorKey));
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onModalClose}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onSecondaryButtonClick={onModalClose}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      disablePrimaryButton={formState?.invalid === 'initial' || loading}
      size={ModalSizes.MEDIUM}
      minHeight='500px'
      dataInstance={`${dataInstance}_${COMPONENT_NAME}`}
    >
      <DMFieldContainer>
        <Text>
          {isAddField
            ? t('Pages_Content_Library_DMFields_Name_Validation_AddField')
            : t('Pages_Content_Library_DMFields_Name_Validation_EditField')}
        </Text>
      </DMFieldContainer>
      <AlertHub alerts={selectDMFieldErrors} onClose={onErrorClose} />
      {getFieldModal()}
    </Modal>
  );
});

AddDMFieldModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  formState: PropTypes.shape({}).isRequired,
  formValue: PropTypes.shape({}).isRequired,
  handleChanges: PropTypes.func.isRequired,
  handleFormState: PropTypes.func.isRequired,
};

export default AddDMFieldModal;
