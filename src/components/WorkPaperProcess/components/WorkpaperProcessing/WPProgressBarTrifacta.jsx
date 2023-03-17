import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex, ProgressBar, ProgressBarTypes, useInterval, Button, ButtonTypes } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { processWorkpaperStatus } from '../../../../store/workpaperProcess/step2/actions';
import { COMPONENT_NAME, WP_PROCESS_INPUT_STATUS, FLOW_IMPORT_STATUS } from '../../constants/WorkPaperProcess.const';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';
import FlowJobListModal from '../../../FlowJobsList/FlowJobsListModal';
import { getAndSyncFlowOutputsDmts } from '../../../../store/workpaperProcess/step3/actions';
import useTranslation from 'src/hooks/useTranslation';
import { datawranglerSelectors } from '../../../../store/dataWrangler/selectors';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { wpStep3Selectors } from '../../../../store/workpaperProcess/step3/selectors';

// Interval of 3 seconds
const RUNNING_REFRESH_INTERVAL = 3 * 1000;

// Interval of 1 minute
const FINISHED_REFRESH_INTERVAL = 60 * 1000;

// eslint-disable-next-line sonarjs/cognitive-complexity
const WPProgressBarTrifacta = ({ workpaperId, flowIsRunning, isDMT }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  const isFetchingStatus = useSelector(WPProcessingSelectors.isFetchingStatus(workpaperId));
  const importProgress = useSelector(WPProcessingSelectors.importProgress);
  const workpaper = useSelector(isDMT ? wpProcessSelectors.selectDMT(workpaperId) : wpProcessSelectors.selectWorkPaper);
  const isFetchingFlowDetails = useSelector(datawranglerSelectors.isFetchingFlowDetails(workpaperId));
  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const dmt = useSelector(wpProcessSelectors.selectDMT(workpaperId));
  const didFinishAutoRun = useSelector(WPProcessingSelectors.didFinishAutoRun);

  const outputs = useSelector(wpStep3Selectors.selectOutputs(workpaperId));

  const hasValidDataTableOutuputs = outputs?.dataTable?.every(o => o.status === ProgressBarTypes.FINISHED);
  const hasValidTableauOutuputs = outputs?.dqc?.every(o => o.jobId > 0 && o.status === ProgressBarTypes.FINISHED);
  const hasValidDqcOutuputs = outputs?.tableau?.every(o => o.status === ProgressBarTypes.FINISHED);

  const [progress, setProgress] = useState({});
  const [finishedProcessing, setFinishedProcessing] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [displayJobList, setDisplayJobList] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(FINISHED_REFRESH_INTERVAL);

  const openJobList = () => setDisplayJobList(true);

  const setRunningInterval = () => {
    setRefreshInterval(RUNNING_REFRESH_INTERVAL);
  };

  const setFinishedInterval = () => {
    setRefreshInterval(FINISHED_REFRESH_INTERVAL);
  };

  /**
   * Only Poll if the workpaper state is in Running State.
   * Increase polling interval for all other cases.
   */
  useInterval(() => {
    if (
      !isFetchingStatus &&
      errorCount < 3 &&
      !isFetchingFlowDetails &&
      importProgress !== FLOW_IMPORT_STATUS.PENDING
    ) {
      dispatch(processWorkpaperStatus(workpaperId, false, WORKPAPER_TYPES.TRIFACTA, workpaper.trifactaFlowId)).then(
        response => {
          if (!response) {
            setErrorCount(errorCount + 1);
          }
        }
      );
    }
  }, refreshInterval);

  /**
   * Poll DMT status when it is done.
   * Increase interval when it is pending.
   */
  useEffect(() => {
    if (isDMT) {
      const filteredInput = inputs?.find(input =>
        input?.dataRequestInfo?.find(dr => dr?.bundleTransformationId === dmt?.id)
      );
      if (filteredInput?.processState === WP_PROCESS_INPUT_STATUS.DONE) {
        setRunningInterval();
        setFinishedProcessing(false);
      } else if (filteredInput?.processState === WP_PROCESS_INPUT_STATUS.PENDING) {
        setFinishedInterval();
        setFinishedProcessing(true);
      }
    }
  }, [dmt, isDMT]);

  useEffect(() => {
    if (!isDMT && didFinishAutoRun && finishedProcessing) {
      setFinishedProcessing(false);
      setRunningInterval();
    }
  }, [didFinishAutoRun]);

  useEffect(() => {
    switch (workpaperProgress?.status) {
      case ProgressBarTypes.NOTSTARTED:
      case ProgressBarTypes.ERROR:
      case ProgressBarTypes.FINISHED:
      case ProgressBarTypes.PARTIALLY_COMPLETE:
        setFinishedInterval();
        setFinishedProcessing(true);
        break;
      case ProgressBarTypes.RUNNING:
      case ProgressBarTypes.RUNNING_WITH_ERRORS:
      case ProgressBarTypes.QUEUED:
        setRunningInterval();
        setFinishedProcessing(false);
        break;
      default:
        break;
    }
    setProgress(workpaperProgress);
  }, [workpaperProgress]);

  useEffect(() => {
    if (finishedProcessing && (!hasValidDataTableOutuputs || !hasValidDqcOutuputs || !hasValidTableauOutuputs)) {
      dispatch(getAndSyncFlowOutputsDmts(workpaperId));
    }
  }, [finishedProcessing, isDMT]);

  useEffect(() => {
    if (flowIsRunning) {
      flowIsRunning(
        (progress?.status === ProgressBarTypes.RUNNING || progress?.status === ProgressBarTypes.RUNNING_WITH_ERRORS) &&
          progress?.jobsList?.length > 0
      );
    }
  }, [progress]);

  const closeModalHandler = () => {
    setDisplayJobList(false);
  };

  const progressBarSubtitle = text => {
    return typeof text === 'string' ? (
      t(text)
    ) : (
      <>
        {t(text[0])}&nbsp;
        <Button display='inline-block' type={ButtonTypes.LINK} onClick={openJobList}>
          {t(text[1])}
        </Button>
        &nbsp;{t(text[2])}
      </>
    );
  };

  return (
    <>
      <FlowJobListModal isOpen={displayJobList} onClose={closeModalHandler} jobs={workpaperProgress?.jobsList} />
      {progress?.status && (
        <Flex width='100%' justifyContent='space-between'>
          <ProgressBar
            width='100%'
            progress={progress?.percentage || 0}
            status={progress?.status}
            header={t(progress?.header)}
            subtitle={progressBarSubtitle(progress?.subtitle || '')}
            mb={theme.space[9] - 4}
            dataInstance={COMPONENT_NAME}
          />
        </Flex>
      )}
    </>
  );
};

WPProgressBarTrifacta.propTypes = {};

WPProgressBarTrifacta.defaultProps = {
  isDMT: false,
};

export default WPProgressBarTrifacta;
