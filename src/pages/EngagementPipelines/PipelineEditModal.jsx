import React from 'react';
import { Modal, ModalSizes, AlertHub } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import CreateNewPipeline from '../Engagement/components/AddPipelineModal/CreateNewPipeline';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { updatePipeline } from '../../store/engagement/pipelines/actions';
import { deleteUpdatePipelineError, resetUpdatePipelineError } from '../../store/errors/actions';
import { errorsSelectors } from '../../store/errors/selectors';

export const COMPONENT_NAME = 'PipelineEditModal';

const PipelineEditModal = ({
  isModalOpen,
  handleClose,
  formState,
  formValue,
  updateFormValue,
  updateFormState,
  engagementId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errors = useSelector(errorsSelectors.selectUpdatePipelineErrors);

  const editPipeline = async () => {
    if (formState.invalid) {
      updateFormState({ ...formState, submitted: true });

      return;
    }
    const res = await dispatch(updatePipeline(engagementId, formState.value));

    if (res) {
      handleClose();
    }
  };

  const onErrorClose = errorKey => {
    dispatch(deleteUpdatePipelineError(errorKey));
  };

  const resetModal = () => {
    dispatch(resetUpdatePipelineError());
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      onPrimaryButtonClick={editPipeline}
      onSecondaryButtonClick={handleClose}
      onRemoveFromDom={resetModal}
      primaryButtonText={t('Edit', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.SMALL}
      minHeight='auto'
      disablePrimaryButton={false}
      dataInstance={`${COMPONENT_NAME}`}
    >
      <AlertHub alerts={errors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}-AlertHub`} />
      <CreateNewPipeline
        isEditModal
        formState={formState}
        formValue={formValue}
        handleFormState={(value, invalid) =>
          updateFormState({
            ...formState,
            invalid,
            value,
          })
        }
        handleChanges={newValue => updateFormValue(newValue)}
      />
    </Modal>
  );
};

export default PipelineEditModal;
