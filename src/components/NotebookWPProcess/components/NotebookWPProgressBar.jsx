import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ProgressBar, Box } from 'cortex-look-book';
import env from 'env';
import { ProgressBarTypes, NOTEBOOK_WP_STATUS } from '../../../pages/WorkPaperProcess/constants/WorkPaperProcess.const';
import useTranslation from '../../../hooks/useTranslation';
import { notebookWPStep3Selector } from '../../../store/notebookWorkpaperProcess/step3/selectors';
import { notebookWPProcessSelectors } from '../../../store/notebookWorkpaperProcess/selectors';
import { useSignalR } from '../../../hooks/useSignalR';
import { NOTIFICATION_HUB } from '../../../constants/signalR.const';

const TRANSLATION_KEY = 'Pages_NotebookWorkpaperProcessStep2';

// eslint-disable-next-line sonarjs/cognitive-complexity
const NotebookWPProgressBar = ({ workpaperData, progressStatus, disableProperties, isFileReplaced }) => {
  const { t } = useTranslation();

  const outputs = useSelector(notebookWPStep3Selector.selectOutputs(workpaperData.id));
  const executionStatus = useSelector(notebookWPProcessSelectors.executionStatus);

  const [progress, setProgress] = useState({});
  const [updatedProgressStatus, setUpdatedProgressStatus] = useState(progressStatus);
  const { joinGroup, removeFromGroup } = useSignalR();
  const groupName = `Notebook-${workpaperData.id}-Status`;

  useEffect(() => {
    if (isFileReplaced) {
      setProgress({});
    }
  }, [isFileReplaced]);

  useEffect(() => {
    if (outputs && Object.keys(outputs).length && outputs.dataTable.length) {
      const conditionForEnableOp = outputs.dataTable.some(data => {
        return data.nodePath !== null;
      });
      if (conditionForEnableOp) {
        setUpdatedProgressStatus(executionStatus);
      }
    }
    if (Object.keys(progressStatus).length) {
      if (
        progressStatus.status === ProgressBarTypes.RESET ||
        progressStatus.status === NOTEBOOK_WP_STATUS.NOT_STARTED
      ) {
        setProgress({});
      } else {
        setUpdatedProgressStatus(progressStatus);
      }
    }
  }, [progressStatus, outputs]);

  useEffect(() => {
    if (
      executionStatus.status === ProgressBarTypes.RESET ||
      executionStatus.status === NOTEBOOK_WP_STATUS.NOT_STARTED
    ) {
      setProgress({});
    } else {
      setUpdatedProgressStatus(executionStatus);
      if (
        executionStatus.status === ProgressBarTypes.FINISHED ||
        executionStatus.status === ProgressBarTypes.ERROR ||
        executionStatus.status === ProgressBarTypes.FAILED_EXECUTION ||
        executionStatus.status === ProgressBarTypes.FAILED_SUBMISSION
      ) {
        removeFromGroup(`${env.API_URL}/${NOTIFICATION_HUB}`, groupName);
      }
    }
  }, [executionStatus]);

  useEffect(() => {
    if (
      updatedProgressStatus.status === ProgressBarTypes.QUEUED ||
      updatedProgressStatus.status === ProgressBarTypes.RUNNING
    ) {
      joinGroup(`${env.API_URL}/${NOTIFICATION_HUB}`, groupName);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(updatedProgressStatus).length) {
      const progressInfo = {
        status: null,
        header: null,
        subtitle: null,
        percentage: 0,
        waitingJRStepId: null,
      };

      switch (updatedProgressStatus.status) {
        case ProgressBarTypes.QUEUED:
          progressInfo.status = ProgressBarTypes.QUEUED;
          progressInfo.percentage = 10;
          progressInfo.header = t(`${TRANSLATION_KEY}_Queued`);
          break;
        case ProgressBarTypes.RUNNING:
          progressInfo.status = ProgressBarTypes.RUNNING;
          progressInfo.percentage = 10;
          progressInfo.header = t(`${TRANSLATION_KEY}_Running`);
          break;
        case ProgressBarTypes.FINISHED:
          progressInfo.status = ProgressBarTypes.FINISHED;
          progressInfo.percentage = 100;
          progressInfo.header = t(`${TRANSLATION_KEY}_Finished`);
          disableProperties(false);
          break;
        case ProgressBarTypes.FAILED_EXECUTION:
        case ProgressBarTypes.FAILED_SUBMISSION:
          progressInfo.status = ProgressBarTypes.ERROR;
          progressInfo.percentage = 10;
          progressInfo.header = t(`PageTitle_Error`);
          progressInfo.subtitle = updatedProgressStatus.error
            ? updatedProgressStatus.error.title
            : updatedProgressStatus.Error.Title;
          disableProperties(false);
          break;
        case ProgressBarTypes.CANCELED:
          progressInfo.status = ProgressBarTypes.CANCELED;
          progressInfo.percentage = 0;
          progressInfo.header = t(`${TRANSLATION_KEY}_Canceled`);
          disableProperties(false);
          break;
        case ProgressBarTypes.UNKNOWN:
          progressInfo.status = ProgressBarTypes.UNKNOWN;
          progressInfo.percentage = 0;
          progressInfo.header = t(`${TRANSLATION_KEY}_Unknown`);
          disableProperties(false);
          break;
        case NOTEBOOK_WP_STATUS.NOT_STARTED:
          progressInfo.status = NOTEBOOK_WP_STATUS.NOT_STARTED;
          progressInfo.percentage = 0;
          progressInfo.header = t(`${TRANSLATION_KEY}_Not_Started`);
          break;
        default:
          break;
      }
      setProgress(progressInfo);
    }
  }, [updatedProgressStatus]);

  return (
    <Box>
      {Object.keys(progress).length ? (
        <ProgressBar
          progress={progress.percentage}
          status={progress?.status}
          header={progress?.header}
          subtitle={progress?.subtitle}
          mb={7}
        />
      ) : (
        ''
      )}
    </Box>
  );
};

export default NotebookWPProgressBar;
