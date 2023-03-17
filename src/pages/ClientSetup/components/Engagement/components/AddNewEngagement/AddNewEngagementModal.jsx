import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Flex,
  Icon,
  Text,
  TextTypes,
  Modal,
  ModalSizes,
  Button,
  ButtonTypes,
  IconTypes,
  AlertHub,
  Spinner,
} from 'cortex-look-book';
import useTranslation from '../../../../../../hooks/useTranslation';
import { EngagementTypes, EngagementStatus } from '../../constants/engagment.constants';
import CreateNewEngModal from './CreateNewEngModal';
import ChooseCreateEngType from './ChooseCreateEngType';
import RollForwardEngModal from './RollForwardEngModal';
import { deleteAddEngagementError, resetAddEngagementError } from '../../../../../../store/errors/actions';
import { errorsSelectors } from '../../../../../../store/errors/selectors';
import { engagementSelectors } from '../../../../../../store/engagement/selectors';
import { AddNewEngagementModalStep } from './constants/AddNewEngagement.constants';
import useCheckAuth from '../../../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../../../utils/permissionsHelper';

const COMPONENT_NAME = 'Client_Setup_Add_New_EngagementModal';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement';

const AddNewEngagementModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const createNewEngModal = useRef();
  const rollforwardEngModal = useRef();

  const [openNewEngagementModal, setOpenNewEngagementModal] = useState(false);
  const [current, setCurrent] = useState(AddNewEngagementModalStep.CHOOSE);
  const [modalMode, setModalMode] = useState(EngagementTypes.NEW);
  const [canRollForward, setCanRollForward] = useState(false);
  const [rollforwardData, setRollforwardData] = useState({});

  const errors = useSelector(errorsSelectors.selectAddEngagementErrors);
  const engagementList = useSelector(engagementSelectors.selectClientEngagementList);
  const isAddingEngagement = useSelector(engagementSelectors.selectIsAddingEngagement);
  const isRollforwardInProgress = useSelector(engagementSelectors.selectIsRollforwardInProgress);
  const createEngagementUserInProgress = useSelector(engagementSelectors.selectCreateEngagementUserInProgress);

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  const onErrorClose = errorKey => {
    dispatch(deleteAddEngagementError(errorKey));
  };

  const showCreateEngType = () => {
    return engagementList.filter(eng => eng?.closeoutStatus === EngagementStatus.APPROVED).length > 0;
  };

  const handleClose = () => {
    dispatch(resetAddEngagementError());
    setRollforwardData({});
    setOpenNewEngagementModal(false);
  };

  const handleBackStep = () => {
    switch (current) {
      case AddNewEngagementModalStep.CHOOSE:
        break;
      case AddNewEngagementModalStep.GENERAL_DETAILS:
        setRollforwardData({});
        setCurrent(AddNewEngagementModalStep.CHOOSE);
        break;
      case AddNewEngagementModalStep.ROLLFORWARD_DETAILS:
        setCurrent(AddNewEngagementModalStep.GENERAL_DETAILS);
        break;
      default:
        break;
    }
  };

  const handleNextStep = () => {
    switch (current) {
      case AddNewEngagementModalStep.CHOOSE:
        setCurrent(AddNewEngagementModalStep.GENERAL_DETAILS);
        break;
      case AddNewEngagementModalStep.GENERAL_DETAILS:
        setCurrent(AddNewEngagementModalStep.ROLLFORWARD_DETAILS);
        break;
      case AddNewEngagementModalStep.ROLLFORWARD_DETAILS:
      default:
        break;
    }
  };

  const handleCreateNewEngagement = () => {
    if (((createNewEngModal || {}).current || {}).submit) {
      createNewEngModal.current.submit();
    }
  };

  const handleRollforwardEngagement = () => {
    if (((rollforwardEngModal || {}).current || {}).submit) {
      rollforwardEngModal.current.submit();
    }
  };

  const getHandlePrimaryButtonClick = () => {
    switch (current) {
      case AddNewEngagementModalStep.CHOOSE:
        return handleNextStep;
      case AddNewEngagementModalStep.GENERAL_DETAILS:
        return handleCreateNewEngagement;
      case AddNewEngagementModalStep.ROLLFORWARD_DETAILS:
        return handleRollforwardEngagement;
      default:
        return null;
    }
  };

  const getHandleSecondaryButtonClick = () => {
    switch (current) {
      case AddNewEngagementModalStep.CHOOSE:
        return handleClose;
      case AddNewEngagementModalStep.GENERAL_DETAILS:
        return handleClose;
      case AddNewEngagementModalStep.ROLLFORWARD_DETAILS:
        return handleClose;
      default:
        return null;
    }
  };

  const getHandleTertiaryButtonClick = () => {
    switch (current) {
      case AddNewEngagementModalStep.CHOOSE:
        return null;
      case AddNewEngagementModalStep.GENERAL_DETAILS:
        if (canRollForward) {
          return handleBackStep;
        }

        return null;
      case AddNewEngagementModalStep.ROLLFORWARD_DETAILS:
        return handleBackStep;
      default:
        return null;
    }
  };

  const getPrimaryButtonText = () => {
    switch (current) {
      case AddNewEngagementModalStep.CHOOSE:
        return t(`${TRANSLATION_KEY}_PrimaryCTA_Next`);
      case AddNewEngagementModalStep.GENERAL_DETAILS:
        if (modalMode === EngagementTypes.EDIT) {
          return t(`${TRANSLATION_KEY}_PrimaryCTA_Edit`);
        } else if (modalMode === EngagementTypes.ROLLFORWARD) {
          return t(`${TRANSLATION_KEY}_PrimaryCTA_Next`);
        }

        return t(`${TRANSLATION_KEY}_PrimaryCTA`);
      case AddNewEngagementModalStep.ROLLFORWARD_DETAILS:
        return t(`${TRANSLATION_KEY}_PrimaryCTA_Rollforward`);
      default:
        return t(`${TRANSLATION_KEY}_PrimaryCTA_Next`);
    }
  };

  const getSecondaryButtonText = () => {
    return t(`${TRANSLATION_KEY}_SecondaryCTA`);
  };

  const getTertiaryButtonText = () => {
    return (
      <Flex alignItems='center'>
        <Icon type={IconTypes.CHEVRON_LEFT} size={18} mr={2} /> {t(`${TRANSLATION_KEY}_TertiaryCTA`)}
      </Flex>
    );
  };

  useEffect(() => {
    if (!openNewEngagementModal) {
      setCurrent(showCreateEngType() ? 0 : 1);
    }
  }, [openNewEngagementModal]);

  useEffect(() => {
    const hasClosedOutEngs = showCreateEngType();
    setCurrent(hasClosedOutEngs ? AddNewEngagementModalStep.CHOOSE : AddNewEngagementModalStep.GENERAL_DETAILS);
    setCanRollForward(hasClosedOutEngs);
  }, [engagementList]);

  const views = [
    <ChooseCreateEngType value={modalMode} setSelectedValue={setModalMode} />,
    <CreateNewEngModal
      ref={createNewEngModal}
      closeModal={handleClose}
      showBackButton={canRollForward}
      mode={modalMode}
      setRollforwardData={setRollforwardData}
      handleNextStep={handleNextStep}
      selectedEngagement={rollforwardData}
    />,
    <RollForwardEngModal ref={rollforwardEngModal} rollforwardData={rollforwardData} closeModal={handleClose} />,
  ];

  return (
    <>
      <Button
        type={ButtonTypes.LINK}
        icon={IconTypes.PLUS}
        iconWidth={20}
        onClick={() => setOpenNewEngagementModal(true)}
        dataInstance={`${COMPONENT_NAME}-New-Engagement`}
        disabled={!checkPermissions(permissions, Permissions.ENGAGEMENTS, Actions.ADD)}
      >
        <Text type={TextTypes.H3}>{t(`${TRANSLATION_KEY}_New`)}</Text>
      </Button>
      <Modal
        isOpen={openNewEngagementModal}
        onClose={handleClose}
        onPrimaryButtonClick={getHandlePrimaryButtonClick()}
        onSecondaryButtonClick={getHandleSecondaryButtonClick()}
        onTertiaryButtonClick={getHandleTertiaryButtonClick()}
        primaryButtonText={getPrimaryButtonText()}
        secondaryButtonText={getSecondaryButtonText()}
        tertiaryButtonText={getTertiaryButtonText()}
        disablePrimaryButton={isAddingEngagement || isRollforwardInProgress || createEngagementUserInProgress}
        disableTertiaryButton={isAddingEngagement || isRollforwardInProgress || createEngagementUserInProgress}
        size={ModalSizes.MEDIUM}
        dataInstance={`${COMPONENT_NAME}`}
      >
        <AlertHub alerts={errors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}`} />
        <Spinner spinning={isAddingEngagement || isRollforwardInProgress || createEngagementUserInProgress}>
          {views[current]}
        </Spinner>
      </Modal>
    </>
  );
};

export default AddNewEngagementModal;
