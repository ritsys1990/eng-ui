import React, { useEffect, useState } from 'react';
import { Spinner, Input, Intent, Textarea, AlertHub, Modal, ModalSizes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import {
  updateCommonDataModel,
  getAllCommonDataModels,
} from '../../../../../../store/contentLibrary/commonDataModels/actions';
import { errorsSelectors } from '../../../../../../store/errors/selectors';
import { deleteDMFieldError } from '../../../../../../store/errors/actions';
import { DMFieldContainer } from '../../../DataModelDetail/components/AddDMFieldModal/DMFieldModal.styled';
import { cdmDetails, CDM_INITIAL_STATE, CDM_FORM_STATE } from '../../../constants/constants';
import { Header } from '../../../../../../components/InputUploaderModal/components/Header/Header';
import { commonDatamodelSelectors } from '../../../../../../store/contentLibrary/commonDataModels/selectors';

const COMPONENT_NAME = 'CREATE_NEW_CDM_MODAL';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddCommonDataModelModal = props => {
  const { isAddCDM, isOpen, handleClose, selectedCDM } = props;
  const { NAME, DESCRIPTION } = cdmDetails;
  const [titleText, setTitleText] = useState('');
  const [cdmValue, setCDMValue] = useState(CDM_INITIAL_STATE);
  const [cdmFormState, setCDMFormState] = useState(CDM_FORM_STATE);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectDMFieldErrors = useSelector(errorsSelectors.selectDMFieldErrors);
  const isUpdatingCDM = useSelector(commonDatamodelSelectors.isUpdatingCDM);

  const isValidRequiredField = value => !!(value && value.length);

  const handleFormState = (value, invalid) =>
    setCDMFormState({
      ...cdmFormState,
      invalid,
      value,
    });

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...cdmValue, [key]: newValue };
    setCDMValue(newFormValue);

    const { name, description } = newFormValue;
    const formValues = {
      [NAME]: (name || '').trim(),
      [DESCRIPTION]: (description || '').trim(),
    };

    const isValidForm = !isValidRequiredField(formValues[NAME]) || !isValidRequiredField(formValues[DESCRIPTION]);

    handleFormState(formValues, isValidForm);
  };

  const showErrors = {
    [NAME]: !isValidRequiredField(cdmFormState.value[NAME]) && cdmFormState.submitted,
    [DESCRIPTION]: !isValidRequiredField(cdmFormState.value[DESCRIPTION]) && cdmFormState.submitted,
  };

  const closeModal = () => {
    setCDMValue(CDM_INITIAL_STATE);
    setCDMFormState(CDM_FORM_STATE);
    handleClose();
  };

  const handlePrimaryButtonClick = () => {
    setCDMFormState({
      ...cdmFormState,
      submitted: true,
    });
    if (!cdmFormState.invalid) {
      const commonDM = {
        id: isAddCDM ? null : selectedCDM?.id,
        name: cdmValue.name?.trim(),
        description: cdmValue.description?.trim(),
      };
      dispatch(updateCommonDataModel(commonDM)).then(resp => {
        closeModal();
        if (resp) {
          dispatch(getAllCommonDataModels());
        }
      });
    }
  };

  const isDisablePrimaryButton = () => {
    if (
      (!isAddCDM && cdmValue[NAME] === selectedCDM?.name && cdmValue[DESCRIPTION] === selectedCDM?.description) ||
      isUpdatingCDM
    ) {
      return true;
    }

    return false;
  };

  const getContent = () => {
    const nameError = showErrors[NAME] ? t('Components_AddNewWorkpaperModal_Validation_Error') : '';
    const descError = showErrors[DESCRIPTION] ? t('Components_AddNewWorkpaperModal_Validation_Error') : '';

    return (
      <Spinner spinning={isUpdatingCDM}>
        <DMFieldContainer>
          <Input
            required
            label={t('Pages_Content_Library_CommonDataModels_ModalNameLabel')}
            value={cdmValue[NAME] || ''}
            hint={nameError}
            intent={nameError ? Intent.ERROR : ''}
            onChange={e => setNewValue(NAME, e.currentTarget.value)}
            placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldName`}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Textarea
            required
            value={cdmValue[DESCRIPTION] || ''}
            hint={descError}
            intent={descError ? Intent.ERROR : ''}
            onChange={e => setNewValue(DESCRIPTION, e.currentTarget.value)}
            label={t('Pages_Content_Library_CommonDataModels_ModalNameDescription')}
            placeholder={t('Components_AddNewWorkpaperModal_Description_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldDescription`}
          />
        </DMFieldContainer>
      </Spinner>
    );
  };

  const onErrorClose = errorKey => {
    dispatch(deleteDMFieldError(errorKey));
  };

  useEffect(() => {
    if (isAddCDM) {
      setTitleText(t('Pages_Content_Library_CommonDataModels_ModalTitleAdd'));
      setCDMValue(CDM_INITIAL_STATE);
    } else {
      setTitleText(t('Pages_Content_Library_CommonDataModels_ModalTitleEdit'));
      setCDMValue({
        [NAME]: selectedCDM?.name,
        [DESCRIPTION]: selectedCDM?.description,
      });
    }
  }, [isAddCDM, selectedCDM]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onSecondaryButtonClick={closeModal}
      disablePrimaryButton={isDisablePrimaryButton()}
      primaryButtonText={
        isAddCDM
          ? t('Componenet_AddDataModelModal_PrimaryText_Create')
          : t('Componenet_AddDataModelModal_PrimaryText_Edit')
      }
      secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.MEDIUM}
      dataInstance={`${COMPONENT_NAME}-Modal`}
    >
      <Header titleText={titleText} pb={3} />
      <AlertHub alerts={selectDMFieldErrors} onClose={onErrorClose} />
      {getContent()}
    </Modal>
  );
};

export default AddCommonDataModelModal;
