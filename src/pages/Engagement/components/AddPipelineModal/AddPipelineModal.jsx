import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AlertHub, Flex, Icon, IconTypes, Modal, ModalSizes } from 'cortex-look-book';
import ChoosePipelineForm from './ChoosePipelineForm';
import CreateNewPipeline from './CreateNewPipeline';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { createPipeline, setAddPipelineSelected } from '../../../../store/engagement/pipelines/actions';
import { deleteAddPipelineError, resetAddPipelineError } from '../../../../store/errors/actions';
import { errorsSelectors } from '../../../../store/errors/selectors';
import { EngPipelinesSelectors } from '../../../../store/engagement/pipelines/selectors';
import NamePipelineStep from './NamePipelineStep';
import { PIPELINE_INITIAL_STATE, PIPELINE_FORM_STATE } from '../../../ContentLibrary/Pipelines/constants/constants';
import useTranslation from 'src/hooks/useTranslation';

const AddPipelineModal = props => {
  const { isModalOpen, handleClose, dataInstance } = props;

  const nameModalRef = useRef();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState(PIPELINE_FORM_STATE);
  const [formValue, setFormValue] = useState(PIPELINE_INITIAL_STATE);
  const [pipelineName, setPipelineName] = useState('');
  const errors = useSelector(errorsSelectors.selectAddPipelineErrors);
  const isPipelineCreating = useSelector(EngPipelinesSelectors.isPipelineCreating);
  const selectedPipeline = useSelector(EngPipelinesSelectors.selectAddPipelineSelected);
  const { engagementId } = useParams();
  const { t } = useTranslation();

  const onModalClose = () => {
    setFormValue(PIPELINE_INITIAL_STATE);
    setFormState(PIPELINE_FORM_STATE);
    setStep(1);
    handleClose();
  };

  const onErrorClose = errorKey => {
    dispatch(deleteAddPipelineError(errorKey));
  };

  const pipelineChange = pipeline => {
    setPipelineName(pipeline);
  };

  const getStepModal = () => {
    switch (step) {
      case 0:
        return (
          <CreateNewPipeline
            formState={formState}
            formValue={formValue}
            handleFormState={(value, invalid) =>
              setFormState({
                ...formState,
                invalid,
                value,
              })
            }
            handleChanges={newValue => setFormValue(newValue)}
          />
        );
      case 1:
        return <ChoosePipelineForm {...props} />;
      case 2:
        return (
          <NamePipelineStep
            ref={nameModalRef}
            pipelineChange={pipelineChange}
            dataInstance={`${dataInstance}_NamePipelineStep`}
            {...props}
          />
        );
      default:
        return null;
    }
  };

  const getPrimaryButtonText = () => {
    switch (step) {
      case 0:
        return t('Components_AddNewPipelineModal_Primary');
      case 1:
        return t('Components_AddPipelineModal_Step1_Primary');
      case 2:
        return t('Components_AddPipelineModal_Step2_Primary');
      default:
        return null;
    }
  };

  const getSecondaryButtonText = () => {
    switch (step) {
      case 0:
      case 1:
        return t('Components_AddPipelineModal_Step1_Secondary');
      case 2:
        return t('Components_AddNewPipelineModal_Tertiary');
      default:
        return null;
    }
  };

  const getTertiaryButtonText = () => {
    switch (step) {
      case 0:
        return (
          <Flex alignItems='center'>
            <Icon type={IconTypes.CHEVRON_LEFT} size={18} mr={2} /> {t('Components_AddNewPipelineModal_Tertiary')}
          </Flex>
        );
      case 1:
        return (
          <Flex alignItems='center'>
            <Icon type={IconTypes.PLUS} size={18} mr={2} /> {t('Components_AddPipelineModal_Step1_Tertiary')}
          </Flex>
        );
      default:
        return null;
    }
  };

  const getHandleSecondaryButtonClick = () => {
    switch (step) {
      case 0:
      case 1:
        return handleClose;
      case 2:
        return () => setStep(1);
      default:
        return null;
    }
  };

  const getHandleTertiaryButtonClick = () => {
    switch (step) {
      case 0:
        return () => {
          setStep(1);
        };
      case 1:
        return () => setStep(0);
      default:
        return null;
    }
  };

  const getDisablePrimaryButton = () => {
    switch (step) {
      case 0:
        return false;
      case 1:
        return isEmpty(selectedPipeline);
      case 2:
        return isPipelineCreating || pipelineName === '';
      default:
        return false;
    }
  };

  const getDisableSecondaryButton = () => {
    switch (step) {
      case 2:
        return isPipelineCreating;
      case 0:
      case 1:
      default:
        return false;
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleAddPipeline = () => {
    if (((nameModalRef || {}).current || {}).submit) {
      nameModalRef.current.submit();
    }
  };

  const resetModal = () => {
    setStep(1);
    dispatch(setAddPipelineSelected(''));
    dispatch(resetAddPipelineError());
  };

  const handleAddNewPipeline = async () => {
    if (formState.invalid) {
      setFormState({ ...formState, submitted: true });

      return;
    }
    const res = await dispatch(createPipeline(engagementId, formState.value));

    if (res) {
      onModalClose();
    }
  };

  const getHandlePrimaryButtonClick = () => {
    switch (step) {
      case 0:
        return handleAddNewPipeline;
      case 1:
        return handleNext;
      case 2:
        return handleAddPipeline;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      onPrimaryButtonClick={getHandlePrimaryButtonClick()}
      onSecondaryButtonClick={getHandleSecondaryButtonClick()}
      onTertiaryButtonClick={getHandleTertiaryButtonClick()}
      onRemoveFromDom={resetModal}
      primaryButtonText={getPrimaryButtonText()}
      secondaryButtonText={getSecondaryButtonText()}
      tertiaryButtonText={getTertiaryButtonText()}
      disableSecondaryButton={getDisableSecondaryButton()}
      size={ModalSizes.LARGE}
      minHeight='auto'
      disablePrimaryButton={getDisablePrimaryButton()}
      dataInstance={`${dataInstance}_AddPipeline`}
    >
      <AlertHub alerts={errors} onClose={onErrorClose} />
      {getStepModal()}
    </Modal>
  );
};

AddPipelineModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

AddPipelineModal.defaultProps = {
  isModalOpen: false,
};

export default AddPipelineModal;
