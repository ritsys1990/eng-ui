import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ProgressBar, ProgressBarTypes, useInterval } from 'cortex-look-book';

import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { processWorkpaperStatus } from '../../../../store/workpaperProcess/step2/actions';
import { COMPONENT_NAME } from '../../constants/WorkPaperProcess.const';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';
import useTranslation from 'src/hooks/useTranslation';

// Interval of 3 seconds
const RUNNING_REFRESH_INTERVAL = 3 * 1000;

// Interval of 1 minute
const FINISHED_REFRESH_INTERVAL = 60 * 1000;

const WPProgressBar = ({ workpaperId }) => {
  const dispatch = useDispatch();
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));

  const [progress, setProgress] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(FINISHED_REFRESH_INTERVAL);
  const { t } = useTranslation();

  const setRunningInterval = () => {
    setRefreshInterval(RUNNING_REFRESH_INTERVAL);
  };

  const setFinishedInterval = () => {
    setRefreshInterval(FINISHED_REFRESH_INTERVAL);
  };

  /**
   * Run on page load to determine current workpaper process state.
   */
  useEffect(() => {
    dispatch(processWorkpaperStatus(workpaperId, false, WORKPAPER_TYPES.CORTEX));
  }, [workpaperId]);

  /**
   * Only Poll if the workpaper state is in Running State.
   * Stop Polling for all other cases.
   */
  useInterval(() => {
    dispatch(processWorkpaperStatus(workpaperId, false, WORKPAPER_TYPES.CORTEX));
  }, refreshInterval);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    /**
     * To optimize polling, I am disabling polling when its not running to reduce
     * network traffic. This makes things challenging now as when you make an action like approveJR, processWorkpaper, etc.
     * the processWorkpaperStatus can return before the fired action has completed in its downstream impacts,
     * or before shareDB has finished updating its states, so if that call does not return the running state, or returns
     * the same state, or a state with missing attributes polling will stop. So adding the following to check when to
     * poll and when to stop polling.
     */
    const generateProgressInfo = () => {
      const progressInfo = {
        status: null,
        header: null,
        subtitle: null,
        percentage: null,
        waitingJRStepId: null,
      };

      progressInfo.percentage =
        (workpaperProgress?.progress?.completedSteps / workpaperProgress?.progress?.totalSteps) * 100;

      switch (workpaperProgress?.status) {
        case ProgressBarTypes.NOTSTARTED:
          progressInfo.status = ProgressBarTypes.NOTSTARTED;
          progressInfo.header = '';
          progressInfo.subtitle = '';
          break;
        case ProgressBarTypes.WAITING:
          progressInfo.status = ProgressBarTypes.WAITING;
          progressInfo.percentage = progressInfo.percentage > 10 ? progressInfo.percentage : 10;
          progressInfo.header = t('Pages_WorkpaperProcess_Step2_Progress_Paused_Label');
          progressInfo.subtitle = t('Pages_WorkpaperProcess_Step2_Progress_Paused_Text');
          progressInfo.waitingJRStepId = workpaperProgress?.waitingJRStepId;
          break;
        case ProgressBarTypes.ERROR:
          progressInfo.status = ProgressBarTypes.ERROR;
          progressInfo.percentage = progressInfo.percentage > 10 ? progressInfo.percentage : 10;
          progressInfo.header = t('Pages_WorkpaperProcess_Step2_Progress_Error_Label');
          progressInfo.subtitle = t('Pages_WorkpaperProcess_Step2_Progress_Error_Text');
          break;
        case ProgressBarTypes.RUNNING:
          progressInfo.status = ProgressBarTypes.RUNNING;
          progressInfo.percentage = progressInfo.percentage > 10 ? progressInfo.percentage : 10;
          progressInfo.header = t('Pages_WorkpaperProcess_Step2_Progress_Running_Label');
          progressInfo.subtitle = t('Pages_WorkpaperProcess_Step2_Progress_Running_Text');
          break;
        case ProgressBarTypes.FINISHED:
          progressInfo.status = ProgressBarTypes.FINISHED;
          progressInfo.percentage = 100;
          progressInfo.header = t('Pages_WorkpaperProcess_Step2_Progress_Finished_Label');
          progressInfo.subtitle = '';
          break;
        case ProgressBarTypes.PARTIALLY_COMPLETE:
          progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Partially_Complete_Label';
          progress.subtitle = [
            'Pages_WorkpaperProcess_Step2_Progress_Partially_Complete_Text_Trifacta_DataFlow',
            'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_ClickHere',
            'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_DetailedStatus',
          ];
          break;
        default:
          break;
      }

      return progressInfo;
    };

    const updatedProgress = generateProgressInfo();
    switch (updatedProgress?.status) {
      case ProgressBarTypes.NOTSTARTED:
        break;
      case ProgressBarTypes.WAITING:
        if (updatedProgress?.waitingJRStepId && updatedProgress?.waitingJRStepId === progress?.waitingJRStepId) {
          setRunningInterval();
        } else if (updatedProgress?.waitingJRStepId === '') {
          /**
           * If the JRStepID is missing and status is waiting, the general behavior is to open accordion, but if we do not have
           * the JRStepID we cannot open accordion, so instead of showing paused and the user wondering at what step, just show
           * running and then when all params are returned we can show appropriate status.
           */
          updatedProgress.status = ProgressBarTypes.RUNNING;
          setRunningInterval();
        } else {
          setFinishedInterval();
        }
        break;
      case ProgressBarTypes.ERROR:
        setFinishedInterval();
        break;
      case ProgressBarTypes.RUNNING:
        setRunningInterval();
        break;
      case ProgressBarTypes.FINISHED:
        setFinishedInterval();
        break;
      case ProgressBarTypes.PARTIALLY_COMPLETE:
        setFinishedInterval();
        break;
      default:
        break;
    }
    setProgress(updatedProgress);
  }, [workpaperProgress, workpaperId]);

  return (
    <>
      {progress.status && progress.status !== ProgressBarTypes.NOTSTARTED && (
        <ProgressBar
          progress={progress.percentage}
          status={progress?.status}
          header={progress?.header}
          subtitle={progress?.subtitle}
          mb={7}
          dataInstance={COMPONENT_NAME}
        />
      )}
    </>
  );
};

WPProgressBar.propTypes = {
  workpaperId: PropTypes.string,
};

WPProgressBar.defaultProps = {
  workpaperId: '',
};

export default WPProgressBar;
