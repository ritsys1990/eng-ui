import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Spinner, Input, Textarea, RadioGroup, Intent, Text, TextTypes, Box } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { CLPipelinesSelectors } from '../../../../../store/contentLibrary/pipelines/selectors';
import { Header } from '../../../../../components/InputUploaderModal/components/Header/Header';
import {
  PIPELINE_DETAILS,
  PIPELINE_TYPE,
  PIPELINE_INITIAL_STATE,
  PIPELINE_FORM_STATE,
} from '../../constants/constants';
import { addCLPipeline, updateCLPipeline } from '../../../../../store/contentLibrary/pipelines/actions';

export const COMPONENT_NAME = 'CL_PIPELINES_ADD_PIPELINE';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PipelineFormModal = ({ isOpen, onClose, formValueProp, isEditModal }) => {
  const { t } = useTranslation();
  const isCLPipelineAdding = useSelector(CLPipelinesSelectors.isCLPipelineAdding);
  const isCLPipelineUpdating = useSelector(CLPipelinesSelectors.isCLPipelineUpdating);
  const [isModified, setIsModified] = useState(false);
  const [formValue, setFormValue] = useState(PIPELINE_INITIAL_STATE);
  const [formState, setFormState] = useState(PIPELINE_FORM_STATE);
  const [showErrors, setShowErrors] = useState({});
  const dispatch = useDispatch();

  const sourceOptions = [
    { value: PIPELINE_TYPE.CORTEX, label: PIPELINE_TYPE.CORTEX },
    { value: PIPELINE_TYPE.TRIFACTA, label: PIPELINE_TYPE.TRIFACTA },
  ];

  const isValidRequiredField = value => !!(value && value.length);

  const handleAddModalSubmit = () => {
    setShowErrors({
      [PIPELINE_DETAILS.NAME]: !isValidRequiredField(formState.value[PIPELINE_DETAILS.NAME]),
    });
    if (!formState.invalid) {
      dispatch(addCLPipeline(formState.value));
      setFormValue(PIPELINE_INITIAL_STATE);
      setFormState(PIPELINE_FORM_STATE);
    }
  };

  const handleOnClose = () => {
    if (!isEditModal) {
      setFormValue(PIPELINE_INITIAL_STATE);
      setFormState(PIPELINE_FORM_STATE);
    }
    setShowErrors({});
    setIsModified(false);
    onClose();
  };

  const handleUpdateModalSubmit = () => {
    if (!isModified) {
      return handleOnClose();
    }
    setShowErrors({
      [PIPELINE_DETAILS.NAME]: !isValidRequiredField(formState.value[PIPELINE_DETAILS.NAME]),
    });
    if (!formState.invalid) {
      dispatch(updateCLPipeline(formState.value));
    }
    setIsModified(false);
    handleOnClose();

    return null;
  };

  const nameError = showErrors[PIPELINE_DETAILS.NAME] ? t('Components_AddNePipelineModal_Validation_Error') : '';

  const handleFormState = (value, invalid) =>
    setFormState({
      ...formState,
      invalid,
      value,
    });

  const setNewValue = (key, newValue) => {
    setIsModified(true);
    const newFormValue = { ...formValue, [key]: newValue };
    setFormValue(newFormValue);

    const { pipelineName, pipelineDescription, pipelineSource, id } = newFormValue;
    const formValues = {
      [PIPELINE_DETAILS.NAME]: (pipelineName || '').trim(),
      [PIPELINE_DETAILS.DESCRIPTION]: (pipelineDescription || '').trim(),
      [PIPELINE_DETAILS.SOURCE]: (pipelineSource || '').trim(),
      [PIPELINE_DETAILS.ID]: (id || '').trim(),
    };

    handleFormState(formValues, !isValidRequiredField(formValues[PIPELINE_DETAILS.NAME]));
  };

  useEffect(() => {
    if (formValueProp && isOpen) {
      setFormValue(formValueProp);
      setFormState({
        invalid: false,
        submitted: false,
        value: { ...formValueProp },
      });
    }
  }, [formValueProp, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      onClickOutside={handleOnClose}
      size='s'
      onPrimaryButtonClick={isEditModal ? handleUpdateModalSubmit : handleAddModalSubmit}
      onSecondaryButtonClick={handleOnClose}
      primaryButtonText={isEditModal ? t('Edit', 'General_') : t('Add', 'General_')}
      secondaryButtonText={t('Close', 'General_')}
      dataInstance={isEditModal ? `${COMPONENT_NAME}-UpdateCLPipeline` : `${COMPONENT_NAME}-AddCLPipeline`}
      disablePrimaryButton={isCLPipelineAdding || isCLPipelineUpdating || !isModified}
      disableSecondaryButton={isCLPipelineAdding || isCLPipelineUpdating}
    >
      <Spinner spinning={isCLPipelineAdding || isCLPipelineUpdating}>
        <Header
          titleText={
            isEditModal
              ? t('Pages_Content_Library_EditPipelineModalTitle')
              : t('Pages_Content_Library_AddPipelineModalTitle')
          }
          pb={3}
        />
        <Box pb={10}>
          <Input
            required
            label={t('Pages_Content_Library_Pipeline_Fields_Headers_Name')}
            value={formValue[PIPELINE_DETAILS.NAME] || ''}
            hint={nameError}
            intent={nameError ? Intent.ERROR : ''}
            onChange={e => setNewValue(PIPELINE_DETAILS.NAME, e.currentTarget.value)}
            placeholder={t('Pages_Content_Library_Pipeline_Fields_Headers_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldName`}
          />
        </Box>
        <Box pb={10}>
          <Textarea
            value={formValue[PIPELINE_DETAILS.DESCRIPTION] || []}
            onChange={e => setNewValue(PIPELINE_DETAILS.DESCRIPTION, e.currentTarget.value)}
            label={t('Pages_Content_Library_Pipeline_Fields_Headers_Description')}
            placeholder={t('Pages_Content_Library_Pipeline_Fields_Headers_Description_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldDescription`}
          />
        </Box>
        {!isEditModal && (
          <Box pb={10} dataInstance={`${COMPONENT_NAME}-SourceOption`}>
            <Text type={TextTypes.H4} fontWeight='m' mb={2}>
              {t('Pages_Content_Library_Pipeline_Fields_Headers_Source')}
            </Text>
            <Text type={TextTypes.H4} mb={2}>
              <RadioGroup
                name='group'
                options={sourceOptions}
                selectedValue={formValue.pipelineSource}
                onOptionChange={value => setNewValue(PIPELINE_DETAILS.SOURCE, value)}
                dataInstance={`${COMPONENT_NAME}-FieldSource`}
                mb={2}
              />
            </Text>
          </Box>
        )}
      </Spinner>
    </Modal>
  );
};

export default PipelineFormModal;
