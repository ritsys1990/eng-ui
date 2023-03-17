import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Accordion,
  AccordionTypes,
  Breadcrumbs,
  Container,
  Intent,
  Spinner,
  Text,
  Flex,
  Button,
  ButtonTypes,
  IconTypes,
  Modal,
  ModalSizes,
  Alert,
  AlertTypes,
} from 'cortex-look-book';
import styled, { ThemeContext } from 'styled-components';
import { getWorkpapersDetails, getChildWorkPapersStatus } from '../../store/workpaperProcess/actions';
import { getFlowIsModified, isUserPartOfTrifactaGroup } from '../../store/dataWrangler/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import env from 'env';
import useNavContext from '../../hooks/useNavContext';
import WpProcessHeader from './components/WpProcessHeader';
import { WPProcessActionTypes } from '../../store/workpaperProcess/actionTypes';
import WpProcessStep1 from './components/WpProcessStep1';
import WpProcessStep2 from './components/WpProcessStep2';
import WpProcessStep3 from './components/WpProcessStep3';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { wpStep1Selectors } from '../../store/workpaperProcess/step1/selectors';
import { datawranglerSelectors } from '../../store/dataWrangler/selectors';
import { WPProcessingSelectors } from '../../store/workpaperProcess/step2/selectors';
import { WPProcessStep1ActionTypes } from '../../store/workpaperProcess/step1/actionTypes';
import { WPProcessStep2ActionTypes } from '../../store/workpaperProcess/step2/actionTypes';
import { WPProcessStep3ActionTypes } from '../../store/workpaperProcess/step3/actionTypes';
import useConfig from './hooks/useConfig';
import {
  COMPONENT_NAME,
  ProgressBarTypes,
  WP_PROCESS_INPUT_STATUS,
  JE_GOLDEN_CHECK,
} from './constants/WorkPaperProcess.const';
import { exportTrifactaDataFlow, getTrifactaJRSteps } from '../../store/workpaperProcess/step2/actions';
import {
  getEngagementOutputLabels,
  getWorkpaperOutputLabels,
  executeJEReconciliationReport,
} from '../../store/workpaperProcess/step3/actions';
import { WORKPAPER_TYPES, WORKPAPER_CANVAS_TYPES } from '../../utils/WorkpaperTypes.const';
import { wpStep3Selectors } from '../../store/workpaperProcess/step3/selectors';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';
import StepTitle from './components/StepTitle/StepTitle';
import WpProcessDataModelStep from './components/WpProcessDataModelStep';
import { workpaperSelectors } from '../../store/workpaper/selectors';
import { isLegacyMode } from '../../utils/legacyUtils';
import { useSignalR } from '../../hooks/useSignalR';
import { NOTIFICATION_HUB } from '../../constants/signalR.const';

export const ReconButtonStyle = styled(Button)`
  button svg path {
    fill: ${props => (props.disabled ? '#868686' : '#1faee3')}  
`;

// eslint-disable-next-line sonarjs/cognitive-complexity
const WorkPaperProcess = props => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const { match, workpaperType, canvasType } = props;
  const { crumbs } = useNavContext(match);
  const { config } = useConfig(canvasType);
  const { t } = useTranslation();
  const readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const isCentralizedDSUpdated = useSelector(wpProcessSelectors.isCentralizedDSUpdated);
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const template = useSelector(wpProcessSelectors.selectWTemplate);
  const latestTemplate = useSelector(wpProcessSelectors.selectLatestTemplate);
  const isLoading = useSelector(wpProcessSelectors.selectIsLoading);
  const isStep1Completed = useSelector(wpStep1Selectors.selectIsStep1Completed);
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(match.params.workpaperId));
  const flowButtonLoading = useSelector(WPProcessingSelectors.flowButtonLoading);
  const loading = useSelector(wpStep3Selectors.selectLoading);
  const isFetchingWorkbooks = useSelector(wpStep3Selectors.selectIsFetchingWorkbooks);
  const isSettingUpTableau = useSelector(wpStep3Selectors.selectIsSettingUpTableau);
  const outputs = useSelector(wpStep3Selectors.selectOutputs(match.params.workpaperId));
  const isFlowModified = useSelector(datawranglerSelectors.isFlowModified(match.params.workpaperId));
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [showTrifactaRecipeHistoryModal, setShowTrifactaRecipeHistoryModal] = useState(false);
  const [isImportFlowsShown, setIsImportFlowsShown] = useState(false);
  const [isShowSimplePopup, showSimplePopup] = useState(false);
  const [showModifiedWarning, setShowModifiedWarning] = useState(false);
  const [isAnyInputProcessing, setIsAnyInputProcessing] = useState(false);
  const [spinnerLabel, setSpinnerLabel] = useState('');
  const isAttachingFile = useSelector(wpStep1Selectors.isAttachingFile);
  const updatingCentralizedInputs = useSelector(wpStep1Selectors.updatingCentralizedInputs);
  const isDMTStepComplete = useSelector(WPProcessingSelectors.isDMTStepComplete);
  const isDMTStepPartiallyComplete = useSelector(WPProcessingSelectors.isDMTStepPartiallyComplete);
  const isDMTStepShown = useSelector(WPProcessingSelectors.isDMTStepShown);
  const isChildWorkpapersStatusCompleted = useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted);
  const isCreatingDataRequest = useSelector(workpaperSelectors.selectIsCreatingDataRequest);
  const isCloningBundle = useSelector(wpProcessSelectors.isCloningBundle);
  const isDataModelReplaced = useSelector(wpStep1Selectors.isDataModelReplaced);
  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const { joinGroup, removeFromGroup } = useSignalR();
  const groupName = `trifacta-${workpaper.id}-reconciliation`;
  const isReportGenerated = useSelector(wpStep3Selectors.selectIsReportGenerated);

  useEffect(() => {
    if (isReportGenerated) {
      removeFromGroup(`${env.API_URL}/${NOTIFICATION_HUB}`, groupName);
    }
  }, [isReportGenerated]);

  useEffect(() => {
    dispatch(getWorkpapersDetails(match.params.workpaperId, WORKPAPER_TYPES.TRIFACTA, workpaper.trifactaFlowId));
    if (workpaper?.engagementId) {
      dispatch(isUserPartOfTrifactaGroup(workpaper?.engagementId));
    }

    return () => {
      dispatch({ type: WPProcessActionTypes.RESET });
      dispatch({ type: WPProcessStep1ActionTypes.RESET });
      dispatch({ type: WPProcessStep2ActionTypes.RESET });
      dispatch({ type: WPProcessStep3ActionTypes.RESET });
    };
  }, [match.params.workpaperId, dispatch]);

  useEffect(() => {
    if (workpaper?.name) {
      document.title = `${workpaper?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [workpaper, t]);

  useEffect(() => {
    if (isAttachingFile) {
      setSpinnerLabel(t('Components_AddDatatTable_Loader_Label'));
    } else {
      setSpinnerLabel('');
    }
  }, [isAttachingFile]);

  useEffect(() => {
    switch (workpaperType) {
      case WORKPAPER_TYPES.TRIFACTA:
        dispatch(getFlowIsModified(workpaper.id, workpaper.trifactaFlowId));
        break;
      case WORKPAPER_TYPES.CORTEX:
      default:
        break;
    }
  }, [workpaperType, workpaper]);

  useEffect(() => {
    if (inputs.length && isAnyInputProcessing && workpaperType === WORKPAPER_TYPES.TRIFACTA) {
      const isDone = inputs.some(input => input.status === WP_PROCESS_INPUT_STATUS.DONE);
      if (isDone) {
        dispatch(getTrifactaJRSteps(workpaper.id, workpaper.trifactaFlowId));
        dispatch(getFlowIsModified(workpaper.id, workpaper.trifactaFlowId));
      }
    }
  }, [dispatch, inputs, isAnyInputProcessing, workpaper.id, workpaper.trifactaFlowId, workpaperType]);

  useEffect(() => {
    setShowModifiedWarning(isFlowModified);
  }, [isFlowModified]);

  useEffect(() => {
    setShowModifiedWarning(isDataModelReplaced);
  }, [isDataModelReplaced]);

  useEffect(() => {
    if (!readOnlyfromWP) {
      dispatch(getChildWorkPapersStatus(match.params.workpaperId));
    }
  }, [readOnlyfromWP, match.params.workpaperId]);
  const getSecondStepStatus = () => {
    if (workpaperProgress?.status === Intent.WAITING) {
      return Intent.WAITING;
    } else if (workpaperProgress?.status === Intent.FINISHED && isStep1Completed) {
      return Intent.FINISHED;
    }

    return Intent.INFO;
  };

  const getThirdStepStatus = () => {
    const allOutputs = outputs ? Object.values(outputs) : [];
    if (
      workpaperProgress?.status === Intent.FINISHED &&
      isStep1Completed &&
      allOutputs.some(outputList => Array.isArray(outputList) && outputList.length > 0)
    ) {
      return Intent.SUCCESS;
    }

    return Intent.INFO;
  };

  const getIsStep2Open = useCallback(() => {
    if (
      workpaperType === WORKPAPER_TYPES.TRIFACTA &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD
    ) {
      return true;
    }

    if (isDMTStepShown) {
      return isStep1Completed && !updatingCentralizedInputs && isDMTStepComplete && !isCloningBundle;
    }

    return isStep1Completed && !updatingCentralizedInputs && !isCloningBundle;
  }, [
    workpaperType,
    isStep1Completed,
    updatingCentralizedInputs,
    isDMTStepShown,
    isDMTStepComplete,
    canvasType,
    isCloningBundle,
  ]);

  const getIsStep3Open = useCallback(() => {
    if (
      workpaperType === WORKPAPER_TYPES.TRIFACTA &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD
    ) {
      return true;
    }

    if (isDMTStepShown) {
      return isDMTStepPartiallyComplete;
    }

    const isComplete =
      workpaperProgress?.status === ProgressBarTypes.FINISHED ||
      workpaperProgress?.status === ProgressBarTypes.PARTIALLY_COMPLETE;

    return isComplete && isStep1Completed && !updatingCentralizedInputs;
  }, [workpaperType, isStep1Completed, workpaperProgress, updatingCentralizedInputs, isDMTStepPartiallyComplete]);

  const getIsStep2Disabled = useCallback(() => {
    if (
      workpaperType === WORKPAPER_TYPES.TRIFACTA &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD
    ) {
      return false;
    }

    if (isDMTStepShown) {
      return !isStep1Completed || updatingCentralizedInputs || !isDMTStepComplete || isCloningBundle;
    }

    return !isStep1Completed || updatingCentralizedInputs || isCloningBundle;
  }, [
    workpaperType,
    isStep1Completed,
    updatingCentralizedInputs,
    isDMTStepShown,
    isDMTStepComplete,
    canvasType,
    isCloningBundle,
  ]);

  const getIsStep3Disabled = useCallback(() => {
    if (
      workpaperType === WORKPAPER_TYPES.TRIFACTA &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD
    ) {
      return false;
    }

    if (isDMTStepShown) {
      return !isDMTStepPartiallyComplete;
    }

    const isComplete =
      workpaperProgress?.status === ProgressBarTypes.FINISHED ||
      workpaperProgress?.status === ProgressBarTypes.PARTIALLY_COMPLETE;

    return !isComplete || !isStep1Completed || updatingCentralizedInputs;
  }, [workpaperType, workpaperProgress, isStep1Completed, updatingCentralizedInputs, isDMTStepPartiallyComplete]);

  const onCloseWarning = () => {
    setIsWarningShown(false);
    setShowTrifactaRecipeHistoryModal(false);
    setIsImportFlowsShown(false);
  };

  const onPrimaryButtonClick = () => {
    setIsWarningShown(false);
    setShowTrifactaRecipeHistoryModal(false);
    setIsImportFlowsShown(true);
  };

  const onExportDataFlow = () => {
    if (workpaper) {
      dispatch(exportTrifactaDataFlow(workpaper.trifactaFlowId, workpaper.name));
    }
  };

  const openCreateChildWorkpaper = () => {
    history.push(`/workpaper/${match.params.workpaperId}/childworkpaper`);
  };

  const closeSimplePopup = () => {
    showSimplePopup(false);
  };

  const getLabelsCallback = response => {
    if (!response) {
      closeSimplePopup();
    }
  };

  const fetchEngagementLabelDetails = () => {
    showSimplePopup(true);

    if (
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS &&
      canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS
    ) {
      dispatch(getEngagementOutputLabels(workpaper.engagementId, workpaper.id)).then(getLabelsCallback);
    } else {
      dispatch(getWorkpaperOutputLabels([...outputs?.dataTable, ...outputs?.dqc])).then(getLabelsCallback);
    }
  };

  const closeTrifactaRecipeHistoryModal = () => {
    setShowTrifactaRecipeHistoryModal(false);
  };

  const containerPadding = isLegacyMode ? { p: 0 } : { pb: 20 };
  const containerMargin = isLegacyMode ? { mt: 0 } : { mt: theme.space[12] };

  const generateReconciliationReport = () => {
    dispatch(executeJEReconciliationReport(workpaper));
    joinGroup(`${env.API_URL}/${NOTIFICATION_HUB}`, groupName);
  };

  return (
    <Container {...containerPadding}>
      <Spinner
        spinning={isLoading || isAttachingFile || isCreatingDataRequest}
        overlayOpacity={0.85}
        minHeight='calc(100vh - 120px)'
        size={theme.space[11]}
        pathSize={theme.space[2]}
        optionalRender={isLoading}
        label={spinnerLabel}
      >
        {!isLegacyMode && (
          <Breadcrumbs
            crumbs={crumbs}
            fontSize='s'
            fontWeight={theme.fontWeights.m}
            mt={theme.space[9] - 4}
            dataInstance={COMPONENT_NAME}
          />
        )}
        <Container px={theme.space[0]} {...containerMargin}>
          {showModifiedWarning && (
            <Alert
              message={t('Pages_TrifactaWorkpaperProcess_DataWrangler_Warning_FlowModified')}
              type={AlertTypes.WARNING}
              mb={5}
              id={`${COMPONENT_NAME}_Warning_Modified`}
              onClose={() => setShowModifiedWarning(false)}
            />
          )}
          <WpProcessHeader wp={workpaper} workpaperType={workpaperType} canvasType={canvasType} />
          <Modal
            isOpen={isWarningShown}
            onClose={onCloseWarning}
            onPrimaryButtonClick={onPrimaryButtonClick}
            onSecondaryButtonClick={onCloseWarning}
            primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
            secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
            size={ModalSizes.SMALL}
          >
            <Text>{t('Pages_WorkpaperProcess_Step2_Import_Data_Flows')}</Text>
          </Modal>
          <Accordion
            status={isStep1Completed ? Intent.SUCCESS : Intent.INFO}
            isOpened
            type={AccordionTypes.LARGE}
            header={{
              render: () => <StepTitle stepNum={config.stepNum[0]} title={config.headers[0]} disabled={false} />,
            }}
            dataInstance={`${COMPONENT_NAME}-Step1`}
          >
            <WpProcessStep1
              template={template}
              workpaperType={workpaperType}
              workpaper={workpaper}
              canvasType={canvasType}
              isCentralizedDSUpdated={isCentralizedDSUpdated}
              latestTemplate={latestTemplate}
              isProcessing={setIsAnyInputProcessing}
            />
          </Accordion>

          <WpProcessDataModelStep
            workpaperId={match.params.workpaperId}
            canvasType={canvasType}
            workpaperType={workpaperType}
          />

          <Accordion
            status={getSecondStepStatus()}
            isOpened={getIsStep2Open()}
            disabled={getIsStep2Disabled()}
            type={AccordionTypes.LARGE}
            header={{
              render: () => (
                <Flex justifyContent='space-between' flexGrow='1'>
                  <Flex>
                    <StepTitle stepNum={config.stepNum[1]} title={config.headers[1]} disabled={!isStep1Completed} />
                  </Flex>
                  {config?.step2?.importAndExportFlows && (
                    <Flex fontSize={theme.fontSizes.s}>
                      <Button
                        disabled={!workpaper?.trifactaFlowId}
                        type={ButtonTypes.LINK}
                        icon={IconTypes.CLOCK}
                        iconWidth={20}
                        onClick={event => {
                          event.stopPropagation();
                          setShowTrifactaRecipeHistoryModal(true);
                        }}
                        dataInstance={`${COMPONENT_NAME}-History`}
                        mr={4}
                      >
                        {t('Pages_WorkpaperProcess_Step2_Recipe_History')}
                      </Button>
                      <Button
                        disabled={flowButtonLoading}
                        type={ButtonTypes.LINK}
                        icon={flowButtonLoading ? IconTypes.ANIMATED_REFRESH : IconTypes.UPLOAD}
                        iconWidth={20}
                        onClick={event => {
                          event.stopPropagation();
                          onExportDataFlow();
                        }}
                        mr={4}
                      >
                        {t('Pages_WorkpaperProcess_Step2_Export_Data_Flow')}
                      </Button>
                      <Button
                        disabled={readOnlyfromWP || isChildWorkpapersStatusCompleted}
                        type={ButtonTypes.LINK}
                        icon={IconTypes.EXTERNAL_TAB}
                        iconWidth={20}
                        onClick={event => {
                          event.stopPropagation();
                          setIsWarningShown(true);
                        }}
                      >
                        {t('Pages_WorkpaperProcess_Step2_Import_Data_Flow')}
                      </Button>
                    </Flex>
                  )}
                </Flex>
              ),
            }}
            dataInstance={`${COMPONENT_NAME}-Step2`}
          >
            <WpProcessStep2
              workpaperId={match.params.workpaperId}
              workpaperType={workpaperType}
              isImportFlowsShown={isImportFlowsShown}
              workpaper={workpaper}
              onClose={onCloseWarning}
              canvasType={canvasType}
              showTrifactaRecipeHistoryModal={showTrifactaRecipeHistoryModal}
              closeTrifactaRecipeHistoryModal={closeTrifactaRecipeHistoryModal}
              isCentralizedDSUpdated={isCentralizedDSUpdated}
            />
          </Accordion>
          <Accordion
            isOpened={getIsStep3Open()}
            disabled={getIsStep3Disabled()}
            status={getThirdStepStatus()}
            type={AccordionTypes.LARGE}
            header={{
              render: () => (
                <Flex justifyContent='space-between' flexGrow='1'>
                  <Flex>
                    <StepTitle stepNum={config.stepNum[2]} title={config.headers[2]} disabled />
                  </Flex>
                  <Flex fontSize={theme.fontSizes.s}>
                    {workpaper.templateId &&
                      template?.name?.toLowerCase().indexOf(JE_GOLDEN_CHECK.WORKPAPER_NAME.toLowerCase()) !== -1 && (
                        <ReconButtonStyle
                          disabled={
                            loading ||
                            workpaperProgress?.status !== ProgressBarTypes.FINISHED ||
                            outputs?.dataTable?.length === 0
                          }
                          type={ButtonTypes.LINK}
                          icon={IconTypes.UPLOAD}
                          iconWidth={20}
                          onClick={event => {
                            event.stopPropagation();
                            generateReconciliationReport();
                          }}
                          mr={8}
                        >
                          {t('Components_Generate_JE_Reconciliation_Report_Button')}
                        </ReconButtonStyle>
                      )}
                    {workpaperType === WORKPAPER_TYPES.TRIFACTA &&
                      !workpaper?.parentWorkpaperId &&
                      workpaper?.engagementId && (
                        <Button
                          disabled={
                            loading ||
                            workpaperProgress?.status !== ProgressBarTypes.FINISHED ||
                            outputs?.dataTable?.length === 0
                          }
                          type={ButtonTypes.LINK}
                          icon={IconTypes.LOCK_HIERARCHY}
                          iconWidth={20}
                          onClick={event => {
                            event.stopPropagation();
                            openCreateChildWorkpaper();
                          }}
                          mr={8}
                        >
                          {t('Components_Create_Child_Workpaper_Button')}
                        </Button>
                      )}
                    {outputs && [...outputs?.dataTable, ...outputs?.dataTable].length > 0 && (
                      <Button
                        disabled={loading || isFetchingWorkbooks || isSettingUpTableau}
                        type={ButtonTypes.LINK}
                        icon={IconTypes.TAG}
                        iconWidth={20}
                        onClick={event => {
                          event.stopPropagation();
                          fetchEngagementLabelDetails();
                        }}
                      >
                        {t('Pages_WorkpaperProcess_Step3_Label_Dataset')}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              ),
            }}
            dataInstance={`${COMPONENT_NAME}-Step3`}
          >
            <WpProcessStep3
              workpaperId={match.params.workpaperId}
              template={template}
              workpaperType={workpaperType}
              canvasType={canvasType}
              engagementId={workpaper.engagementId}
              showSimplePopUp={isShowSimplePopup}
              closeSimplePopup={closeSimplePopup}
              isCentralizedDSUpdated={isCentralizedDSUpdated}
            />
          </Accordion>
        </Container>
      </Spinner>
    </Container>
  );
};

export default WorkPaperProcess;
