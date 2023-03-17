import React, { useState, useEffect, useCallback } from 'react';
import { Box, Spinner, Text, TextTypes, Tag } from 'cortex-look-book';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { wpStep3Selectors } from '../../../store/workpaperProcess/step3/selectors';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import { COMPONENT_NAME } from './WorkpaperOutputs/output.consts';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import { GenWBStatus } from '../../../utils/workbooks.const';
import { GenWBPollingOpts } from '../constants/WorkPaperProcess.const';
import {
  getAndSyncFlowOutputs,
  getWorkPaperOutputs,
  getWorkbooks,
  generateWorkbooks,
  getGenWBStatus,
  getAndSyncFlowOutputsDmts,
} from '../../../store/workpaperProcess/step3/actions';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import useConfig from '../hooks/useConfig';
import useTranslation from '../../../hooks/useTranslation';
import useTimer from '../../../hooks/useTimer';

import RenderLists from './RenderLists';

const WpProcessStep3 = ({
  workpaperId,
  template,
  workpaperType,
  canvasType,
  showSimplePopUp,
  closeSimplePopup,
  isCentralizedDSUpdated,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();

  const { config } = useConfig(canvasType);
  const { t } = useTranslation();
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const loading = useSelector(wpStep3Selectors.selectLoading);
  const outputs = useSelector(wpStep3Selectors.selectOutputs(workpaperId));
  const isDownloadingAllOutputs = useSelector(wpStep3Selectors.selectIsDownloadingAllOutputs);
  const workbooks = useSelector(wpStep3Selectors.selectWorkbooks);
  const isFetchingWorkbooks = useSelector(wpStep3Selectors.selectIsFetchingWorkbooks);
  const generateWorkbooksState = useSelector(wpStep3Selectors.selectGenerateWorkbooksState);
  const [showTableauAlert, setShowTableauAlert] = useState(false);
  const [genWBDelay, setGenWBDelay] = useState(null);
  const isDMTStepShown = useSelector(WPProcessingSelectors.isDMTStepShown);
  const dmts = useSelector(wpProcessSelectors.selectDMTs);
  const isDMTStepComplete = useSelector(WPProcessingSelectors.isDMTStepComplete);
  const isDownloadingReport = useSelector(wpStep3Selectors.selectIsDownloadingReport);

  const showWorkpaperOutputsForDMT = isDMTStepShown && isDMTStepComplete;
  const isOutputWithData = outputs?.dataTable?.length > 0 || outputs?.dqc?.length > 0 || outputs?.tableau?.length > 0;

  const setSTableauAlert = state => {
    setShowTableauAlert(state);
  };

  useEffect(() => {
    switch (workpaperType) {
      case WORKPAPER_TYPES.CORTEX:
        dispatch(getWorkPaperOutputs(workpaper.id));
        break;
      case WORKPAPER_TYPES.TRIFACTA:
        if (!isDMTStepShown) {
          dispatch(getAndSyncFlowOutputs(workpaper.id));
        } else {
          dispatch(getAndSyncFlowOutputsDmts(workpaper.id));
        }
        dispatch(getWorkbooks(workpaper.id));
        break;
      default:
        break;
    }
  }, [dispatch, workpaper, workpaperType]);

  useEffect(() => {
    const hasValidSQLOutuputs = outputs?.dataTable?.some(o => o.jobId > 0 && o.sqlTableName);
    const hasWorkbooks = workbooks?.length > 0;
    if (hasWorkbooks && hasValidSQLOutuputs) {
      // Triggers workbooks generation, backend will check if needed, otherwise returns status.
      dispatch(generateWorkbooks(workpaperId));
    }
  }, [outputs, workbooks?.length]);

  // Generate WB Polling is handled reactively based on status.
  useEffect(() => {
    // Fetch error handler
    const fetchError = generateWorkbooksState?.fetchError;
    if (fetchError > 0) {
      if (fetchError <= GenWBPollingOpts.MAX_FETCH_RETRY) {
        // Increases the delay of polling.
        setGenWBDelay(GenWBPollingOpts.POLL_DELAY * (fetchError + 1));
      } else {
        // has reached maximum errors, will stop polling.
        setGenWBDelay(null);
      }

      return;
    }
    // State handler.
    switch (generateWorkbooksState?.status) {
      case GenWBStatus.Progress:
        setGenWBDelay(GenWBPollingOpts.POLL_DELAY);
        break;
      case GenWBStatus.Done:
        dispatch(getWorkbooks(workpaperId));
      // falls through
      case GenWBStatus.Error:
        setShowTableauAlert(true);
      // falls through
      default:
        // Disables polling, no need to listen anymore.
        setGenWBDelay(null);
    }
  }, [generateWorkbooksState]);

  // Handler for timer.
  const getGenStatusHandler = useCallback(async () => {
    await dispatch(getGenWBStatus(workpaper.id));
  }, [workpaper]);

  // Initialize timer, it will not be active without a delay value.
  useTimer(getGenStatusHandler, genWBDelay);

  const isLoading = () => {
    return loading || isFetchingWorkbooks || isDownloadingAllOutputs || isDownloadingReport;
  };

  return (
    <Spinner
      spinning={isLoading()}
      minHeight={200}
      label={
        isDownloadingReport
          ? t('Components_WorkpaperProcess_Step3_DownloadingJEReconReport')
          : t('Components_AddPipelineModal_Step3_SpinnerLoading')
      }
    >
      <Box pl={90}>
        {config?.step3?.analyticTemplate && (
          <Box mb={20}>
            <Text type={TextTypes.BODY} mb={3} color='gray'>
              {t('Pages_WorkpaperProcess_Step3_AnalyticTemplate')}
            </Text>
            <Tag dataInstance={COMPONENT_NAME}>{template?.name}</Tag>
          </Box>
        )}

        {dmts.length > 0 && (
          <>
            <Text fontSize={16} color='black' fontWeight='bold' mr={4} mb={6}>
              {t('Pages_WorkpaperProcess_Step3_DMTOutputs')}
            </Text>
            <Text type={TextTypes.BODY} color='gray' mr={4}>
              {t('Pages_WorkpaperProcess_Step3_DMTOutputsDescription')}
            </Text>
          </>
        )}
        {dmts.length > 0 &&
          dmts.map((dmt, index) => {
            return (
              <React.Fragment key={index}>
                <Text type={TextTypes.BODY} color='gray' mr={4} mb={6} mt={10} key={`text-${index}`}>
                  {dmt.connectedInputName}
                </Text>
                <RenderLists
                  canvasType={canvasType}
                  workpaperId={dmt.id}
                  isCentralizedDSUpdated={isCentralizedDSUpdated}
                  showSimplePopUp={showSimplePopUp}
                  closeSimplePopup={closeSimplePopup}
                  key={`render-list-${index}`}
                  showTableauAlert={showTableauAlert}
                  setSTableauAlert={setSTableauAlert}
                  isDMT
                />
              </React.Fragment>
            );
          })}

        {((outputs && !isDMTStepShown && isOutputWithData) ||
          (outputs && showWorkpaperOutputsForDMT && isOutputWithData)) && (
          <>
            <Text fontSize={16} color='black' fontWeight='bold' mr={4} mb={6} mt={10}>
              {t('Pages_WorkpaperProcess_Step3_WorkpaperOutputs')}
            </Text>
            <Text type={TextTypes.BODY} color='gray' mr={4} mb={10}>
              {t('Pages_WorkpaperProcess_Step3_WorkpaperOutputsDescription')}
            </Text>
          </>
        )}
        {((outputs && !isDMTStepShown && isOutputWithData) ||
          (outputs && showWorkpaperOutputsForDMT && isOutputWithData)) && (
          <RenderLists
            canvasType={canvasType}
            workpaperId={workpaperId}
            isCentralizedDSUpdated={isCentralizedDSUpdated}
            showSimplePopUp={showSimplePopUp}
            closeSimplePopup={closeSimplePopup}
            showTableauAlert={showTableauAlert}
            setSTableauAlert={setSTableauAlert}
          />
        )}
      </Box>
    </Spinner>
  );
};

WpProcessStep3.propTypes = {
  template: PropTypes.object,
  workpaperId: PropTypes.string.isRequired,
};

WpProcessStep3.defaultProps = {
  template: {},
};

export default WpProcessStep3;
