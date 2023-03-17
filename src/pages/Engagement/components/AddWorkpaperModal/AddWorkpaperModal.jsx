import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AlertHub, Flex, Icon, IconTypes, Modal, ModalSizes } from 'cortex-look-book';
import ChooseWorkpaperForm from './ChooseWorkpaperForm';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  addNewWorkpaper,
  getWorkpapersList,
  setAddWorkpaperModalList,
  setAddWorkpaperSelected,
} from '../../../../store/workpaper/actions';
import NameWorkpaperStep from './NameWorkpaperStep';
import {
  deleteAddWorkpaperError,
  resetAddWorkpaperErrors,
  addAddWorkpaperError,
} from '../../../../store/errors/actions';
import CreateNewWorkpaper from './CreateNewWorkpaper';
import { useParams } from 'react-router-dom';
import { NEW_WORKPAPER_FORM_STATE, NEW_WORKPAPER_INITIAL_STATE } from './constants/new-workpaper';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { errorsSelectors } from '../../../../store/errors/selectors';
import { COMPONENT_NAME } from './constants/constants';
import { isNameEndsWithDotChar } from '../../utils/addWorkpaperHelper';
import useTranslation from 'src/hooks/useTranslation';

const AddWorkpaperModal = props => {
  const { isModalOpen, handleClose, dataInstance } = props;

  const nameModalRef = useRef();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [newWorkpaperValues, setNewWorkpaperValues] = useState(NEW_WORKPAPER_INITIAL_STATE);
  const [newWorkpaperFormState, setNewWorkpaperFormState] = useState(NEW_WORKPAPER_FORM_STATE);
  const { engagementId } = useParams();

  const selectedWorkpaper = useSelector(workpaperSelectors.selectAddWorkpaperSelected);
  const addNewWorkpaperLoading = useSelector(workpaperSelectors.selectAddWorkpaperLoading);
  const fetchingLinkList = useSelector(workpaperSelectors.selectFetchingLinkList);
  const isCreatingWorkpaper = useSelector(workpaperSelectors.selectCreatingWorkpaper);
  const errors = useSelector(errorsSelectors.selectAddWorkpaperErrors);

  const { t } = useTranslation();

  const onModalClose = () => {
    handleClose();

    setStep(0);
    setNewWorkpaperValues(NEW_WORKPAPER_INITIAL_STATE);
  };

  const onErrorClose = errorKey => {
    dispatch(deleteAddWorkpaperError(errorKey));
  };

  const getStepModal = () => {
    switch (step) {
      case 0:
        return (
          <CreateNewWorkpaper
            loading={addNewWorkpaperLoading || fetchingLinkList}
            formState={newWorkpaperFormState}
            formValue={newWorkpaperValues}
            handleFormState={(value, invalid) =>
              setNewWorkpaperFormState({
                ...newWorkpaperFormState,
                invalid,
                value,
              })
            }
            handleChanges={newValue => setNewWorkpaperValues(newValue)}
          />
        );
      case 1:
        return <ChooseWorkpaperForm {...props} />;
      case 2:
        return <NameWorkpaperStep ref={nameModalRef} {...props} />;
      default:
        return null;
    }
  };

  const getPrimaryButtonText = () => {
    switch (step) {
      case 0:
        return t('Components_AddNewWorkpaperModal_Primary');
      case 1:
        return t('Components_AddWorkpaperModal_Step1_Primary');
      case 2:
        return t('Components_AddWorkpaperModal_Step2_Primary');
      default:
        return null;
    }
  };

  const getSecondaryButtonText = () => {
    switch (step) {
      case 0:
      case 1:
        return t('Components_AddWorkpaperModal_Step1_Secondary');
      case 2:
        return t('Components_AddWorkpaperModal_Step2_Secondary');
      default:
        return null;
    }
  };

  const getTertiaryButtonText = () => {
    switch (step) {
      case 0:
        return (
          <Flex alignItems='center'>
            <Icon type={IconTypes.CHEVRON_LEFT} size={18} mr={2} /> {t('Components_AddNewWorkpaperModal_Tertiary')}
          </Flex>
        );
      case 1:
        return (
          <Flex alignItems='center'>
            <Icon type={IconTypes.PLUS} size={18} mr={2} /> {t('Components_AddWorkpaperModal_Step1_Tertiary')}
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
          setNewWorkpaperValues(NEW_WORKPAPER_INITIAL_STATE);
          setNewWorkpaperFormState(NEW_WORKPAPER_FORM_STATE);
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
        return addNewWorkpaperLoading || fetchingLinkList;
      case 1:
        return isEmpty(selectedWorkpaper);
      case 2:
        return isCreatingWorkpaper;
      default:
        return false;
    }
  };

  const getDisableSecondaryButton = () => {
    switch (step) {
      case 2:
        return isCreatingWorkpaper;
      case 0:
      case 1:
      default:
        return false;
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleAddWorkpaper = () => {
    if (((nameModalRef || {}).current || {}).submit) {
      nameModalRef.current.submit();
    }
  };

  const resetModal = () => {
    setStep(1);
    dispatch(setAddWorkpaperModalList([]));
    dispatch(setAddWorkpaperSelected(''));
    dispatch(resetAddWorkpaperErrors());
  };

  const handleAddNewWorkpaper = async () => {
    if (newWorkpaperFormState.invalid) {
      setNewWorkpaperFormState({ ...newWorkpaperFormState, submitted: true });

      return;
    }

    if (isNameEndsWithDotChar(newWorkpaperFormState.value['name'])) {
      dispatch(
        addAddWorkpaperError({
          message: t('Pages_EngagementWorkpapers_CheckWorkpaperNameContainsDotAtEnd'),
          type: 'error',
        })
      );

      return;
    }

    const res = await dispatch(addNewWorkpaper(engagementId, newWorkpaperFormState.value));

    if (res) {
      onModalClose();
      dispatch(getWorkpapersList(`?engagementId=${engagementId}`));
    }
  };

  const getHandlePrimaryButtonClick = () => {
    switch (step) {
      case 0:
        return handleAddNewWorkpaper;
      case 1:
        return handleNext;
      case 2:
        return handleAddWorkpaper;
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
      disablePrimaryButton={getDisablePrimaryButton()}
      disableSecondaryButton={getDisableSecondaryButton()}
      size={ModalSizes.LARGE}
      minHeight='auto'
      dataInstance={`${dataInstance}_${COMPONENT_NAME}`}
    >
      <AlertHub alerts={errors} onClose={onErrorClose} />
      {getStepModal()}
    </Modal>
  );
};

AddWorkpaperModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

AddWorkpaperModal.defaultProps = {
  isModalOpen: false,
};

export default AddWorkpaperModal;
