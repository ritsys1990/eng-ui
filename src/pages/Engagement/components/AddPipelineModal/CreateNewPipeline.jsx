import React from 'react';
import { useSelector } from 'react-redux';
import { Spinner, Input, Textarea, RadioGroup, Intent, Text, TextTypes, Box } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants/constants';
import { EngPipelinesSelectors } from '../../../../store/engagement/pipelines/selectors';
import { Header } from '../../../../components/InputUploaderModal/components/Header/Header';
import useTranslation from '../../../../hooks/useTranslation';
import { PIPELINE_DETAILS, PIPELINE_TYPE } from '../../../ContentLibrary/Pipelines/constants/constants';

const CreateNewPipeline = ({ isEditModal, formValue, formState, handleChanges, handleFormState }) => {
  const { t } = useTranslation();
  const isPipelineCreating = useSelector(EngPipelinesSelectors.isPipelineCreating);
  const isPipelineUpdating = useSelector(EngPipelinesSelectors.isPipelineUpdating);

  const sourceOptions = [
    { value: PIPELINE_TYPE.CORTEX, label: PIPELINE_TYPE.CORTEX },
    { value: PIPELINE_TYPE.TRIFACTA, label: PIPELINE_TYPE.TRIFACTA },
  ];

  const isValidRequiredField = value => !!(value && value.length);

  const showErrors = {
    [PIPELINE_DETAILS.NAME]: !isValidRequiredField(formState.value[PIPELINE_DETAILS.NAME]) && formState.submitted,
  };

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...formValue, [key]: newValue };
    handleChanges(newFormValue);

    const { pipelineName, pipelineDescription, pipelineSource, id } = newFormValue;
    const formValues = {
      [PIPELINE_DETAILS.NAME]: (pipelineName || '').trim(),
      [PIPELINE_DETAILS.DESCRIPTION]: (pipelineDescription || '').trim(),
      [PIPELINE_DETAILS.SOURCE]: (pipelineSource || '').trim(),
      [PIPELINE_DETAILS.ID]: (id || '').trim(),
    };

    handleFormState(formValues, !isValidRequiredField(formValues[PIPELINE_DETAILS.NAME]));
  };

  return (
    <Spinner spinning={isPipelineCreating || isPipelineUpdating}>
      <Header
        titleText={
          isEditModal ? t('Pages_Engagement_EditPipelineModalTitle') : t('Pages_Engagement_AddPipelineModalTitle')
        }
        dataInstance={`${COMPONENT_NAME}-CreateNewPipeline`}
      />
      <Box mt={7}>
        <Input
          required
          label={t('Pages_Engagement_Pipeline_Fields_Headers_Name')}
          value={formValue[PIPELINE_DETAILS.NAME] || ''}
          hint={showErrors[PIPELINE_DETAILS.NAME] ? t('Components_AddNewPipelineModal_Validation_Error') : ''}
          intent={showErrors[PIPELINE_DETAILS.NAME] ? Intent.ERROR : ''}
          onChange={e => setNewValue(PIPELINE_DETAILS.NAME, e.currentTarget.value)}
          placeholder={t('Pages_Engagement_Pipeline_Fields_Headers_Name_Placeholder')}
          dataInstance={`${COMPONENT_NAME}-FieldName`}
        />
      </Box>
      <Box mt={7}>
        <Textarea
          value={formValue[PIPELINE_DETAILS.DESCRIPTION] || []}
          onChange={e => setNewValue(PIPELINE_DETAILS.DESCRIPTION, e.currentTarget.value)}
          label={t('Pages_Engagement_Pipeline_Fields_Headers_Description_Placeholder')}
          placeholder={t('Pages_Engagement_Pipeline_Fields_Headers_Description_Placeholder')}
          dataInstance={`${COMPONENT_NAME}-FieldDescription`}
        />
      </Box>
      {!isEditModal && (
        <Box mt={7} dataInstance={`${COMPONENT_NAME}-SourceOption`}>
          <Text type={TextTypes.H4} fontWeight='m' mb={2}>
            {t('Pages_Engagement_Pipeline_Fields_Headers_Source')}
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
  );
};

export default CreateNewPipeline;
