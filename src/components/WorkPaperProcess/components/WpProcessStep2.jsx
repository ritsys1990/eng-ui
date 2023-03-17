import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { Box, Spinner, Tabs, AlertHub, Text, ProgressBarTypes, Modal, ModalSizes, TextTypes } from 'cortex-look-book';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import { errorsSelectors } from '../../../store/errors/selectors';
import { deleteWPProcessingErrors } from '../../../store/errors/actions';
import WPProgressBar from './WorkpaperProcessing/WPProgressBar';
import JRSteps from './WorkpaperProcessing/JRSteps';
import TrifactaParameters from './WorkpaperProcessing/TrifactaParameters';
import TrifactaJRSteps from './WorkpaperProcessing/TrifactaJRSteps';
import ProcessWorkpaper from './WorkpaperProcessing/ProcessWorkpaper';
import ProcessWorkpaperTrifacta from './WorkpaperProcessing/ProcessWorkpaperTrifacta';
import { COMPONENT_NAME } from '../constants/WorkPaperProcess.const';
import ImportFlowsModal from './importTrifactaFlows/ImportFlowsModal';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import WPProgressBarTrifacta from './WorkpaperProcessing/WPProgressBarTrifacta';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { getFlowDetails } from '../../../store/dataWrangler/actions';
import { datawranglerSelectors } from '../../../store/dataWrangler/selectors';
import TrifactaRecipeHistoryModal from '../../TrifactaRecipeHistory/TrifactaRecipeHistoryModal';

const WpProcessStep2 = ({
  workpaperId,
  workpaperType,
  isImportFlowsShown,
  onClose,
  workpaper,
  canvasType,
  showTrifactaRecipeHistoryModal,
  closeTrifactaRecipeHistoryModal,
}) => {
  // Setup
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const [isModalShown, setIsModalShown] = useState(false);
  const [isImportErrorsModalShown, setIsImportErrorsModalShown] = useState(false);
  const [importFailureMessages, setImportFailureMessages] = useState([]);
  const [isRecipeHistoryLoading, setIsRecipeHistoryLoading] = useState(false);

  // State from Redux
  const isLoading = useSelector(WPProcessingSelectors.isLoading(workpaperId));
  const fetchingTrifactaJRSteps = useSelector(WPProcessingSelectors.fetchingTrifactaJRSteps(workpaperId));
  const fetchingTrifactaParams = useSelector(WPProcessingSelectors.fetchingTrifactaParams(workpaperId));
  const errors = useSelector(errorsSelectors.selectWorkpaperProcessingErrors(workpaperId));
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  const isFetchingFlowDetails = useSelector(datawranglerSelectors.isFetchingFlowDetails(workpaperId));
  const isValidatingFlow = useSelector(datawranglerSelectors.selectIsValidatingFlow(workpaperId));
  const isRunningSpecificDataFlows = useSelector(datawranglerSelectors.isRunningSpecificDataFlows(workpaperId));
  const isFetchingAutoRun = useSelector(WPProcessingSelectors.isFetchingAutoRun);

  useEffect(() => {
    dispatch(getFlowDetails(workpaper?.id, workpaper?.trifactaFlowId));
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('dataTransformationTab');
  const [batchMode, setBatchMode] = useState(workpaperProgress?.batchMode);
  const { t } = useTranslation();

  const onTabClickHandler = tabId => {
    setActiveTab(tabId);
  };

  const onErrorClose = errorKey => {
    dispatch(deleteWPProcessingErrors(errorKey, { workpaperId }));
  };

  const handleClose = () => {
    setIsModalShown(false);
    onClose();
  };

  const showImportErrors = failureMessages => {
    handleClose();
    setImportFailureMessages(failureMessages);
    setIsImportErrorsModalShown(true);
  };

  const onRecipeHistoryLoader = isLoaded => {
    setIsRecipeHistoryLoading(isLoaded);
  };

  useEffect(() => {
    setBatchMode(workpaperProgress?.batchMode);
  }, [workpaperProgress]);

  useEffect(() => {
    setIsModalShown(isImportFlowsShown);
  }, [isImportFlowsShown]);

  const getModalContent = () => {
    if (importFailureMessages.length > 0) {
      return importFailureMessages.map(failureMessage => (
        <Text type={TextTypes.BODY} my={6} sx={{ wordWrap: 'break-word' }}>
          {failureMessage}
        </Text>
      ));
    }

    return null;
  };

  const renderBasedOnBatchMode = () => {
    if (batchMode === false) {
      if (
        workpaperProgress?.status === ProgressBarTypes.RUNNING ||
        workpaperProgress?.status === ProgressBarTypes.FINISHED
      ) {
        return <Text>{t('Pages_WorkpaperProcess_Step2_Batch_Mode_Off')}</Text>;
      }

      return <WPProgressBar workpaperId={workpaperId} />;
    }

    return (
      <>
        <WPProgressBar workpaperId={workpaperId} />
        <Tabs
          dataInstance={COMPONENT_NAME}
          activeTab={activeTab}
          onTabClicked={onTabClickHandler}
          tabs={[
            {
              id: 'dataTransformationTab',
              label: t('Pages_WorkpaperProcess_Step2_Tab_Title'),
            },
          ]}
          header
          mb={theme.space[9] - 4}
        />
        <JRSteps workpaperId={workpaperId} />
        <ProcessWorkpaper workpaperId={workpaperId} workpaperType={workpaperType} />
      </>
    );
  };

  const hideModal = () => {
    setIsImportErrorsModalShown(false);
  };

  const renderBasedOnWPType = () => {
    switch (workpaperType) {
      case WORKPAPER_TYPES.TRIFACTA:
        return (
          // eslint-disable-next-line react/jsx-no-comment-textnodes

          <>
            <ImportFlowsModal
              isOpen={isModalShown}
              handleClose={handleClose}
              workpaperId={workpaperId}
              trifactaFlowId={workpaper?.trifactaFlowId}
              canvasType={canvasType}
              showImportErrors={showImportErrors}
            />
            <Modal
              isOpen={isImportErrorsModalShown}
              onClose={hideModal}
              onPrimaryButtonClick={hideModal}
              primaryButtonText={t('Upper_OK', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
              size={ModalSizes.SMALL}
            >
              {getModalContent()}
            </Modal>
            <WPProgressBarTrifacta workpaperId={workpaperId} />
            <TrifactaParameters workpaperId={workpaperId} workpaperType={workpaperType} canvasType={canvasType} />
            <TrifactaJRSteps workpaperId={workpaperId} canvasType={canvasType} />
            <ProcessWorkpaperTrifacta workpaperId={workpaperId} canvasType={canvasType} />
          </>
        );
      case WORKPAPER_TYPES.CORTEX:
      default:
        return renderBasedOnBatchMode();
    }
  };

  return (
    <Box ml={90}>
      <Spinner
        spinning={
          isLoading ||
          fetchingTrifactaParams ||
          fetchingTrifactaJRSteps ||
          isFetchingFlowDetails ||
          isValidatingFlow ||
          isRunningSpecificDataFlows ||
          isRecipeHistoryLoading ||
          isFetchingAutoRun
        }
        overlayOpacity={0.5}
        size={theme.space[11]}
        pathSize={theme.space[2]}
        label=''
        optionalRender={false}
      >
        <AlertHub dataInstance={COMPONENT_NAME} alerts={errors || []} onClose={onErrorClose} mb={5} />
        {renderBasedOnWPType()}
        {showTrifactaRecipeHistoryModal && (
          <TrifactaRecipeHistoryModal
            isOpen={showTrifactaRecipeHistoryModal}
            onClose={closeTrifactaRecipeHistoryModal}
            onRecipeHistoryLoader={onRecipeHistoryLoader}
          />
        )}
      </Spinner>
    </Box>
  );
};

WpProcessStep2.propTypes = {
  workpaperId: PropTypes.string,
};

WpProcessStep2.defaultProps = {
  workpaperId: '',
};

export default WpProcessStep2;
