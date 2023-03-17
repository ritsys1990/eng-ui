import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Button, ButtonTypes, Modal, ModalSizes, Text, ProgressBarTypes } from 'cortex-look-book';

import { approveAllJRSteps, processWorkpaper } from '../../../../store/workpaperProcess/step2/actions';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { WP_PROCESS_INPUT_ERRORS, COMPONENT_NAME } from '../../constants/WorkPaperProcess.const';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

/**
 * Process Workpaper and Approve All Buttons
 * Process Workpaper - Excutes WP in Batch Mode.
 * Approve All - Approves all JR Steps
 * Process Workpaper can only be clicked once and subsequent tries should
 * show a modal saying workpaper is already running. If the workpaper is
 * in waiting state or error then enable this button and it should allow
 * it to run.
 */

const ProcessWorkpaper = ({ workpaperId }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [disableApproveAll, setDisableApproveAll] = useState(false);
  const [disableProcessWorkpaper, setDisableProcessWorkpaper] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDMVModal, setIsOpenDMVModal] = useState(false);

  const jrStepDetails = useSelector(WPProcessingSelectors.jrStepDetails(workpaperId));
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  const inputs = useSelector(wpStep1Selectors.selectInputs);

  const onButtonShowModalClickHandler = () => {
    setIsOpenModal(!isOpenModal);
  };

  const process = () => {
    if (disableProcessWorkpaper) {
      setIsOpenModal(true);
    } else if (workpaperProgress?.status === ProgressBarTypes.RUNNING) {
      setDisableProcessWorkpaper(true);
    } else {
      setDisableProcessWorkpaper(true);
      dispatch(processWorkpaper(workpaperId));
    }
  };

  const onDMVModalClick = () => {
    setIsOpenDMVModal(false);
    process();
  };

  const approveAllClick = () => {
    dispatch(approveAllJRSteps(workpaperId, jrStepDetails));
  };

  const checkIfAllApproved = () => {
    const jrConfirmations = jrStepDetails?.map(transformation => {
      return transformation.judgementSteps.every(jrStep => jrStep.confirmed === true);
    });

    return jrConfirmations?.every(jrConfirm => jrConfirm === true);
  };

  const checkDMVIssues = useCallback(() => {
    return inputs.some(
      input =>
        input?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_ERROR ||
        input?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING
    );
  }, [inputs]);

  const processWorkpaperClick = () => {
    if (checkDMVIssues()) {
      setIsOpenDMVModal(true);
    } else {
      process();
    }
  };

  useEffect(() => {
    setDisableApproveAll(checkIfAllApproved);
  }, [jrStepDetails]);

  useEffect(() => {
    if (workpaperProgress?.status === ProgressBarTypes.RUNNING) {
      setDisableProcessWorkpaper(true);
    } else {
      setDisableProcessWorkpaper(false);
    }
  }, [workpaperProgress]);

  return (
    <Flex>
      <Modal
        isOpen={isOpenDMVModal}
        size={ModalSizes.SMALL}
        primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onPrimaryButtonClick={onDMVModalClick}
        secondaryButtonText={t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onSecondaryButtonClick={() => {
          setIsOpenDMVModal(false);
        }}
        dataInstance={`${COMPONENT_NAME}-DMV`}
      >
        <Text pb={6}>{t('Pages_WorkpaperProcess_Step2_DMV_Warning')}</Text>
      </Modal>
      <Modal
        isOpen={isOpenModal}
        size={ModalSizes.SMALL}
        primaryButtonText={t('Upper_OK', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onPrimaryButtonClick={onButtonShowModalClickHandler}
        dataInstance={`${COMPONENT_NAME}-Trans-In-Progress`}
      >
        <Text>{t('Pages_WorkpaperProcess_Step2_Transformation_In_Progress')}</Text>
      </Modal>
      <Button
        type={ButtonTypes.PRIMARY}
        mr={4}
        onClick={processWorkpaperClick}
        dataInstance={`${COMPONENT_NAME}-Primary`}
      >
        {t('Pages_WorkpaperProcess_Step2_Process_Workpaper_Button')}
      </Button>
      <Button
        type={ButtonTypes.SECONDARY}
        onClick={approveAllClick}
        disabled={disableApproveAll}
        dataInstance={`${COMPONENT_NAME}-Secondary`}
      >
        {t('Pages_WorkpaperProcess_Step2_Approve_All_Button')}
      </Button>
    </Flex>
  );
};

ProcessWorkpaper.propTypes = {
  workpaperId: PropTypes.string,
};

ProcessWorkpaper.defaultProps = {
  workpaperId: '',
};

export default ProcessWorkpaper;
