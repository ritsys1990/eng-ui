import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInterval } from 'cortex-look-book';
import { wpProcessSelectors } from '../store/workpaperProcess/selectors';
import { downloadWPOutputs, downloadWPOutputsJob, downloadOutputAsZip } from '../store/workpaperProcess/actions';

const DOWNLOAD_STATUS = {
  WAITING_FOR_CONTEXT: 'WAITINGFORCONTEXT',
  PENDING_EXECUTION: 'PENDINGEXECUTION',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

export const useFileSystem = (outputType = '', delay) => {
  const dispatch = useDispatch();

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);

  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobResult, setJobResult] = useState('');
  const [refreshInterval] = useState(delay);

  const downloadWorkpaperOutputs = (workpaperId, outputId = null, filename = null) => {
    setFileName(filename);
    dispatch(downloadWPOutputs(workpaperId, outputId)).then(response => {
      setJobId(response['_id']);

      dispatch(downloadWPOutputsJob(response['_id'])).then(jobResponse => {
        setStatus(jobResponse.status);
        setJobResult(jobResponse.result);
      });
    });
  };

  useInterval(() => {
    if (status && status !== DOWNLOAD_STATUS.SUCCESS && status !== DOWNLOAD_STATUS.FAILURE) {
      dispatch(downloadWPOutputsJob(jobId)).then(jobResponse => {
        setStatus(jobResponse.status);
        setJobResult(jobResponse.result);
      });
    }
  }, refreshInterval);

  useEffect(() => {
    if (status === DOWNLOAD_STATUS.SUCCESS && jobResult) {
      dispatch(downloadOutputAsZip(jobResult?.downloadAsZip_Out?.outputPath, fileName, workpaper.name, outputType));
    }
  }, [status, jobResult]);

  return { downloadWorkpaperOutputs };
};
