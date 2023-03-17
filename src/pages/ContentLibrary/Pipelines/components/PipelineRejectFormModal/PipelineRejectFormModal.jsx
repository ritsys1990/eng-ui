import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Spinner, Intent, Textarea, Box } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { CLPipelinesSelectors } from '../../../../../store/contentLibrary/pipelines/selectors';
import { Header } from '../../../../../components/InputUploaderModal/components/Header/Header';
import {
  PIPELINE_DETAILS_REJECT,
  PIPELINE_REJECT_INITIAL_STATE,
  PIPELINE_REJECT_FORM_STATE,
} from '../../constants/constants';
import { rejectPipeline } from '../../../../../store/contentLibrary/pipelines/actions';

export const COMPONENT_NAME = 'CL_PIPELINES_ADD_PIPELINE';

const PipelineRejectFormModal = ({ isOpen, onClose, selectedPipeline }) => {
  const { t } = useTranslation();
  const isCLPipelineAdding = useSelector(CLPipelinesSelectors.isCLPipelineAdding);
  const isCLPipelineUpdating = useSelector(CLPipelinesSelectors.isCLPipelineUpdating);
  const [formValue, setFormValue] = useState(PIPELINE_REJECT_INITIAL_STATE);
  const [formState, setFormState] = useState(PIPELINE_REJECT_FORM_STATE);
  const [showErrors, setShowErrors] = useState({});
  const dispatch = useDispatch();

  const isValidRequiredField = value => !!(value && value.length);

  const handleRejectModalSubmit = () => {
    setShowErrors({
      [PIPELINE_DETAILS_REJECT.REASON]: !isValidRequiredField(formState.value[PIPELINE_DETAILS_REJECT.REASON]),
    });
    if (!formState.invalid) {
      dispatch(rejectPipeline({ ...formState.value, Id: selectedPipeline.id }));
      setFormValue(PIPELINE_REJECT_INITIAL_STATE);
      setFormState(PIPELINE_REJECT_FORM_STATE);
      onClose();
    }
  };

  const handleOnClose = () => {
    setFormValue(PIPELINE_REJECT_INITIAL_STATE);
    setFormState(PIPELINE_REJECT_FORM_STATE);

    onClose();
  };

  const nameError = showErrors[PIPELINE_DETAILS_REJECT.REASON]
    ? t('Components_AddNePipelineModal_Validation_Error')
    : '';

  const handleFormState = (value, invalid) =>
    setFormState({
      ...formState,
      invalid,
      value,
    });

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...formValue, [key]: newValue };
    setFormValue(newFormValue);

    const { EngagementId, Id, Reason } = newFormValue;
    const formValues = {
      [PIPELINE_DETAILS_REJECT.ENGAGEMENT_ID]: (EngagementId || '').trim(),
      [PIPELINE_DETAILS_REJECT.REASON]: (Reason || '').trim(),
      [PIPELINE_DETAILS_REJECT.ID]: (Id || '').trim(),
    };

    handleFormState(formValues, !isValidRequiredField(formValues[PIPELINE_DETAILS_REJECT.REASON]));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      onClickOutside={handleOnClose}
      size='s'
      onPrimaryButtonClick={handleRejectModalSubmit}
      onSecondaryButtonClick={handleOnClose}
      primaryButtonText={t('REJECT', 'General_')}
      secondaryButtonText={t('Close', 'General_')}
      dataInstance={`${COMPONENT_NAME}-RejectCLPipeline`}
      disablePrimaryButton={isCLPipelineAdding || isCLPipelineUpdating}
      disableSecondaryButton={isCLPipelineAdding || isCLPipelineUpdating}
    >
      <Spinner spinning={isCLPipelineAdding || isCLPipelineUpdating}>
        <Header titleText={t('Pages_Content_Library_RejectPipelineModalTitle')} pb={3} />
        <Box pb={10}>
          <Textarea
            required
            value={formValue[PIPELINE_DETAILS_REJECT.REASON] || []}
            onChange={e => setNewValue(PIPELINE_DETAILS_REJECT.REASON, e.currentTarget.value)}
            label={t('Pages_Content_Library_Pipeline_Fields_Headers_RejectReason')}
            placeholder={t('Pages_Content_Library_Pipeline_Fields_Headers_RejectReason_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldRejectReason`}
            hint={nameError}
            intent={nameError ? Intent.ERROR : ''}
          />
        </Box>
      </Spinner>
    </Modal>
  );
};

export default PipelineRejectFormModal;
