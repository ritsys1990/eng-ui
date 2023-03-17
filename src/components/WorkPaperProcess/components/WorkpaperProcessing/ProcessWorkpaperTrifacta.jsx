import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Flex, Button, ButtonTypes, ProgressBarTypes, Modal, ModalSizes, Text, AlertTypes } from 'cortex-look-book';
import { COMPONENT_NAME, CONTENT_LIBRARY_WP, WP_PROCESS_INPUT_ERRORS } from '../../constants/WorkPaperProcess.const';
import { securitySelectors } from '../../../../store/security/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import {
  processWorkpaper,
  processWorkpaperStatus,
  getTrifactaJRSteps,
  autoRunWorkpaper,
  isDecryptionNeeded,
  triggerWorkpaperDecryption,
} from '../../../../store/workpaperProcess/step2/actions';
import { getEngagementPermissions } from '../../../../store/security/actions';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { WORKPAPER_TYPES, WORKPAPER_CANVAS_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { checkIfAllJRStepsApproved } from '../../utils/WorkPaperProcess.utils';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import useWarningModal from '../../../../hooks/useWarningModal';
import WorkpaperRunDataFlowsModal from '../WorkpaperRunDataFlowsModal/WorkpaperRunDataFlowsModal';
import { runSpecificDataFlows, validateFlowRecipes } from '../../../../store/dataWrangler/actions';
import { addWPProcessingErrors } from '../../../../store/errors/actions';
import { generateValidateAlertMessage } from './utils/WorkpaperProcessing.utils';
import { downloadFile } from '../../../../store/staging/actions';
import useConfig from '../../hooks/useConfig';

const TRANSLATION_KEY = 'Pages_TrifactaWorkpaperProcess_Step2_Process_Workpaper';

const ProcessWorkpaperTrifacta = ({
  workpaperId,
  canvasType,
  fromDataWrangler,
  isDMT,
  hideValidateRecipeButton,
  hideRunSpecificButton,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { config } = useConfig(canvasType);
  const { t } = useTranslation();

  const [isWorkpaperRunning, setIsWorkpaperRunning] = useState(false);
  const [isWPRunningModalOpen, showWPRunningModal] = useState(false);
  const [isDMVErrorExists, setIsDMVErrorExists] = useState(false);
  const isCentralizedDSUpdated = useSelector(wpProcessSelectors.isCentralizedDSUpdated);
  const [areAllJRStepsApproved, setAreAllJRStepsApproved] = useState(false);
  const [isOpenDataWranglerClicked, setIsOpenDataWranglerClicked] = useState(false);
  const [isRunSelectedFlowsModalOpen, setIsRunSelectedFlowsModalOpen] = useState(false);
  const [reRunSpecificOutputs, setReRunSpecificOutputs] = useState(false);
  const [specificOutputs, setSpecificOutputs] = useState(null);

  const baseWorkpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const workpaper = useSelector(isDMT ? wpProcessSelectors.selectDMT(workpaperId) : wpProcessSelectors.selectWorkPaper);
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const engagementPermissions = useSelector(securitySelectors.selectEngagementPermissions);
  const trifactaParams = useSelector(WPProcessingSelectors.trifactaJRSteps(workpaperId));
  const permissions = useSelector(securitySelectors.selectPermissions);
  const fetchingTrifactaJRSteps = useSelector(WPProcessingSelectors.fetchingTrifactaJRSteps(workpaperId));
  const isStep1Completed = useSelector(wpStep1Selectors.selectIsStep1Completed);
  const updatingCentralizedInputs = useSelector(wpStep1Selectors.updatingCentralizedInputs);
  const isDMTStepComplete = useSelector(WPProcessingSelectors.isDMTStepComplete);
  const shouldAutoDmt = useSelector(wpStep1Selectors.autoDMTFlag);
  const engagement = useSelector(engagementSelectors.selectEngagement);

  const { renderWarningModal, showWarningModal } = useWarningModal();

  let readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  readOnlyfromWP = !readOnlyfromWP ? useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted) : readOnlyfromWP;

  const engagementId =
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS ||
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS ||
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS
      ? CONTENT_LIBRARY_WP.ENGAGEMENT_ID
      : workpaper?.engagementId;

  const checkPermission = () => {
    return canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS ||
      canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS ||
      canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS
      ? permissions.permissions.workItems
      : engagementPermissions.permissions.engagementWorkpapers;
  };

  const hasPermission =
    engagementPermissions ||
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS ||
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS ||
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS
      ? checkPermission()
      : { view: true };

  const { view, ...restPermissions } = hasPermission;

  useEffect(() => {
    if (workpaperId && workpaper?.trifactaFlowId) {
      dispatch(processWorkpaperStatus(workpaperId, false, WORKPAPER_TYPES.TRIFACTA, workpaper.trifactaFlowId));
      dispatch(getTrifactaJRSteps(workpaperId, workpaper.trifactaFlowId));
    }
  }, [dispatch, workpaperId, workpaper?.trifactaFlowId]);

  useEffect(() => {
    if (trifactaParams?.trifactaJRSteps) {
      setAreAllJRStepsApproved(checkIfAllJRStepsApproved(trifactaParams?.trifactaJRSteps));
    }
  }, [trifactaParams?.trifactaJRSteps]);

  useEffect(() => {
    if (
      workpaper?.engagementId &&
      !engagementPermissions &&
      canvasType &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS
    ) {
      dispatch(getEngagementPermissions(workpaper.engagementId));
    }
  }, [dispatch, canvasType, engagementPermissions, workpaper?.engagementId]);

  useEffect(() => {
    if (
      workpaperId &&
      isStep1Completed &&
      !updatingCentralizedInputs &&
      !isDMT &&
      isDMTStepComplete &&
      shouldAutoDmt &&
      areAllJRStepsApproved &&
      (workpaperProgress?.status === 'notStarted' || workpaperProgress?.status === 'finished') &&
      !engagement?.encryption
    ) {
      dispatch(autoRunWorkpaper(workpaperId));
    }
  }, [
    isStep1Completed,
    isDMT,
    isDMTStepComplete,
    shouldAutoDmt,
    areAllJRStepsApproved,
    dispatch,
    workpaperId,
    updatingCentralizedInputs,
    workpaperProgress?.status,
  ]);

  useEffect(() => {
    if (
      workpaperProgress?.status === ProgressBarTypes.QUEUED ||
      workpaperProgress?.status === ProgressBarTypes.RUNNING ||
      workpaperProgress?.status === ProgressBarTypes.RUNNING_WITH_ERRORS
    ) {
      setIsWorkpaperRunning(true);
    } else {
      setIsWorkpaperRunning(false);
    }
  }, [workpaperProgress]);

  const checkDMVIssues = useCallback(() => {
    return inputs.some(
      input =>
        input?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_ERROR ||
        input?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING
    );
  }, [inputs]);

  const onOpenDataWranglerClick = () => {
    if (!workpaper?.engagementId && workpaper?.isDMT && !!workpaper?.trifactaFlowId) {
      history.push(`/library/datamodelTransformations/${workpaperId}/data`);
    } else if (!workpaper?.engagementId && workpaper?.bundleTransformation && !!workpaper?.trifactaFlowId) {
      history.push(`/library/bundleTransformations/${workpaperId}/data`);
    } else if (workpaper?.engagementId) {
      if (isDMT) {
        history.push(`/workpapers/${baseWorkpaper?.id}/datamodelTransformation/${workpaperId}`);
      } else {
        history.push(`/workpapers/${workpaperId}/data`);
      }
    } else {
      history.push(`/library/workpapers/${workpaperId}/data`);
    }
  };

  const processTrifactaWorkpaper = () => {
    if (isWorkpaperRunning) {
      showWPRunningModal(true);
    } else {
      dispatch(processWorkpaper(workpaperId, WORKPAPER_TYPES.TRIFACTA, workpaper?.trifactaFlowId)).then(response =>
        response ? setIsWorkpaperRunning(true) : setIsWorkpaperRunning(false)
      );
    }
  };

  const reRunDataFlows = () => {
    showWPRunningModal(!isWPRunningModalOpen);
    if (reRunSpecificOutputs) {
      dispatch(runSpecificDataFlows(workpaper?.trifactaFlowId, specificOutputs, engagementId, workpaperId)).then(
        response => {
          setSpecificOutputs(null);
          setReRunSpecificOutputs(false);
          if (response) {
            setIsWorkpaperRunning(true);
          } else {
            setIsWorkpaperRunning(false);
          }
        }
      );
    } else {
      dispatch(processWorkpaper(workpaperId, WORKPAPER_TYPES.TRIFACTA, workpaper?.trifactaFlowId)).then(response =>
        response ? setIsWorkpaperRunning(true) : setIsWorkpaperRunning(false)
      );
    }
  };

  const onButtonShowModalClickHandler = () => {
    showWPRunningModal(!isWPRunningModalOpen);
    setSpecificOutputs(null);
    setReRunSpecificOutputs(false);
  };

  const resumeProcess = isOpenDataWrangler => {
    setIsDMVErrorExists(false);
    if (isOpenDataWrangler) {
      onOpenDataWranglerClick();
    } else {
      processTrifactaWorkpaper();
    }
  };

  const triggerDecryption = () => {
    dispatch(triggerWorkpaperDecryption(workpaper)).then(resp => {
      if (resp) {
        showWarningModal(t('Pages_WorkpaperProcess_Decryption_Progress'), null, true);
      }
    });
  };

  const checkForDMVStatus = openDataWrangler => {
    setIsOpenDataWranglerClicked(openDataWrangler);
    if (config?.step1?.smartUploadExists && checkDMVIssues()) {
      setIsDMVErrorExists(true);
    } else if (workpaper.engagementId && workpaper.trifactaFlowId && engagement && engagement.encryption) {
      dispatch(isDecryptionNeeded(workpaper)).then(response => {
        if (!response) {
          resumeProcess(openDataWrangler);
        } else if (response !== 'inprogress') {
          triggerDecryption();
        } else {
          showWarningModal(t('Pages_WorkpaperProcess_Decryption_Progress'), null, true);
        }
      });
    } else {
      resumeProcess(openDataWrangler);
    }
  };

  const checkForRecipeeErrors = () => {
    dispatch(validateFlowRecipes(workpaperId, workpaper?.trifactaFlowId, addWPProcessingErrors)).then(response => {
      if (response) {
        dispatch(
          addWPProcessingErrors(
            {
              type: response.hasErrors ? AlertTypes.ERROR : AlertTypes.SUCCESS,
              message: generateValidateAlertMessage(t, response.hasErrors, () => {
                dispatch(
                  downloadFile(
                    response.reportUrl,
                    `${workpaper?.name}${t(`${TRANSLATION_KEY}_DownloadRecipeErrorReportName`)}`,
                    'csv',
                    'text/csv'
                  )
                );
              }),
            },
            { workpaperId }
          )
        );
      }
    });
  };

  const handleValidateFlowRecipes = () => {
    if (workpaper.engagementId && workpaper.trifactaFlowId && engagement && engagement.encryption) {
      dispatch(isDecryptionNeeded(workpaper)).then(response => {
        if (!response) {
          checkForRecipeeErrors();
        } else if (response !== 'inprogress') {
          triggerDecryption();
        } else {
          showWarningModal(t('Pages_WorkpaperProcess_Decryption_Progress'), null, true);
        }
      });
    } else {
      checkForRecipeeErrors();
    }
  };

  const handleIsRunnigWorkpaper = outputs => {
    if (isWorkpaperRunning) {
      setReRunSpecificOutputs(true);
      setIsRunSelectedFlowsModalOpen(false);
      showWPRunningModal(true);
      setSpecificOutputs(outputs);

      return true;
    }
    setIsWorkpaperRunning(true);

    return false;
  };

  const checkForDecryption = () => {
    if (workpaper.engagementId && workpaper.trifactaFlowId && engagement && engagement.encryption) {
      dispatch(isDecryptionNeeded(workpaper)).then(response => {
        if (!response) {
          setIsRunSelectedFlowsModalOpen(true);
        } else if (response !== 'inprogress') {
          triggerDecryption();
        } else {
          showWarningModal(t('Pages_WorkpaperProcess_Decryption_Progress'), null, true);
        }
      });
    } else {
      setIsRunSelectedFlowsModalOpen(true);
    }
  };

  return (
    <Flex minWidth='605px'>
      {renderWarningModal()}
      <Modal
        isOpen={isWPRunningModalOpen}
        size={ModalSizes.SMALL}
        primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onPrimaryButtonClick={reRunDataFlows}
        secondaryButtonText={t('Upper_Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onSecondaryButtonClick={onButtonShowModalClickHandler}
        dataInstance={`${COMPONENT_NAME}-Trans-In-Progress`}
      >
        <Text>{t('Pages_WorkpaperProcess_Step2_Transformation_In_Progress_Trifacta')}</Text>
      </Modal>
      <Modal
        isOpen={isDMVErrorExists}
        size={ModalSizes.SMALL}
        primaryButtonText={t('Pages_WorkpaperProcess_Input_ExistingMappingPrimaryButton')}
        secondaryButtonText={t('Pages_WorkpaperProcess_Input_ExistingMappingSecondaryButton')}
        onPrimaryButtonClick={() => {
          resumeProcess(isOpenDataWranglerClicked);
        }}
        onSecondaryButtonClick={() => {
          setIsDMVErrorExists(false);
        }}
        dataInstance={COMPONENT_NAME}
      >
        <Text>{t('Pages_WorkpaperProcess_Step2_DMVErrors_Exists')}</Text>
      </Modal>
      {workpaper?.trifactaFlowId && engagementId && (
        <WorkpaperRunDataFlowsModal
          trifactaFlowId={workpaper.trifactaFlowId}
          engagementId={engagementId}
          workpaperId={workpaperId}
          isOpen={isRunSelectedFlowsModalOpen}
          onClose={() => setIsRunSelectedFlowsModalOpen(false)}
          isRunningWorkpaper={handleIsRunnigWorkpaper}
          onDone={() => setIsWorkpaperRunning(false)}
        />
      )}
      {!hideValidateRecipeButton && (
        <Button
          dataInstance={`${COMPONENT_NAME}-CheckErrors`}
          type={ButtonTypes.TEXT}
          mr={4}
          onClick={handleValidateFlowRecipes}
          disabled={
            ((readOnlyfromWP ||
              (!fromDataWrangler && view && Object.values(restPermissions).every(permission => permission === false)) ||
              !areAllJRStepsApproved ||
              fetchingTrifactaJRSteps) &&
              !isCentralizedDSUpdated) ||
            inputs.length === 0 ||
            isWorkpaperRunning
          }
        >
          {t(`${TRANSLATION_KEY}_ButtonCheckErrors`)}
        </Button>
      )}
      <Button
        dataInstance={`${COMPONENT_NAME}${fromDataWrangler ? '-Primary' : '-Secondary'}`}
        type={fromDataWrangler ? ButtonTypes.PRIMARY : ButtonTypes.SECONDARY}
        onClick={() => checkForDMVStatus(false)}
        mr={4}
        disabled={
          (readOnlyfromWP ||
            (!fromDataWrangler && view && Object.values(restPermissions).every(permission => permission === false)) ||
            !areAllJRStepsApproved ||
            fetchingTrifactaJRSteps) &&
          !isCentralizedDSUpdated
        }
      >
        {isDMT ? t(`${TRANSLATION_KEY}_ButtonSecondaryDMT`) : t(`${TRANSLATION_KEY}_ButtonSecondary`)}
      </Button>
      {!hideRunSpecificButton && (
        <Button
          dataInstance={`${COMPONENT_NAME}-Tertiary`}
          type={ButtonTypes.SECONDARY}
          onClick={() => checkForDecryption()}
          disabled={
            (readOnlyfromWP ||
              (!fromDataWrangler && view && Object.values(restPermissions).every(permission => permission === false)) ||
              !areAllJRStepsApproved ||
              fetchingTrifactaJRSteps) &&
            !isCentralizedDSUpdated
          }
        >
          {t(`${TRANSLATION_KEY}_ButtonTertiary`)}
        </Button>
      )}
      {!fromDataWrangler && (
        <Button
          dataInstance={`${COMPONENT_NAME}-Primary`}
          type={ButtonTypes.PRIMARY}
          ml={4}
          onClick={() => checkForDMVStatus(true)}
          disabled={
            inputs.length === 0 ||
            (view && Object.values(restPermissions).every(permission => permission === false)) ||
            isCentralizedDSUpdated
          }
        >
          {isDMT ? t(`${TRANSLATION_KEY}_ButtonPrimaryDMT`) : t(`${TRANSLATION_KEY}_ButtonPrimary`)}
        </Button>
      )}
    </Flex>
  );
};

ProcessWorkpaperTrifacta.propTypes = {};

ProcessWorkpaperTrifacta.defaultProps = {
  fromDataWrangler: false,
  hideRunSpecificButton: false,
  hideValidateRecipeButton: false,
  isDMT: false,
};

export default ProcessWorkpaperTrifacta;
