import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import env from 'env';
import { Box, Flex, Input, Button, Text, ButtonTypes, AlertTypes, Alert } from 'cortex-look-book';
import NotebookWPProgressBar from './NotebookWPProgressBar';
import useTranslation from '../../../hooks/useTranslation';
import {
  getParameters,
  saveParameters,
  executeNotebook,
  executeNotebookStatus,
  executionReset,
} from '../../../store/notebookWorkpaperProcess/actions';
import { WP_STATE_STATUS, WP_PROCESS_INPUT_STATUS } from '../../WorkPaperProcess/constants/WorkPaperProcess.const';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { notebookWPProcessSelectors } from '../../../store/notebookWorkpaperProcess/selectors';
import { ProgressBarTypes } from '../../../pages/WorkPaperProcess/constants/WorkPaperProcess.const';
import { notebookWPStep1Selector } from '../../../store/notebookWorkpaperProcess/step1/selectors';
import { useSignalR } from '../../../hooks/useSignalR';
import { NOTIFICATION_HUB } from '../../../constants/signalR.const';

const TRANSLATION_KEY = 'Pages_NotebookWorkpaperProcessStep2';

const NoteBookWPProcessStep2 = ({
  parameterDataOnAttach,
  workpaperData,
  disableOnExec,
  isFileReplaced,
  runExecCalled,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [parameterData, setParameterData] = useState({});
  const [progressStatus, setProgressStatus] = useState({});
  const [showText, setShowText] = useState('');
  const [showNoti, setShowNoti] = useState('');
  const [notiType, setNotiType] = useState(AlertTypes.SUCCESS);
  const [disableBtn, setDisableBtn] = useState(false);
  const [isEmptyInput, setIsEmptyInput] = useState(false);

  const inputData = useSelector(wpStep1Selectors.selectInputs);

  const errorOnSaveParameters = useSelector(notebookWPProcessSelectors.errorOnSaveParameters);
  const isNotebookAttached = useSelector(notebookWPProcessSelectors.isNotebookAttached);
  const isFileAttached = useSelector(notebookWPStep1Selector.isFileAttached);

  const borderStyle = {
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    marginRight: '50px',
  };

  const getExecStatus = () => {
    dispatch(executionReset());
    dispatch(executeNotebookStatus(workpaperData.id)).then(statusResponse => {
      if (statusResponse.status === ProgressBarTypes.RESET) setProgressStatus(statusResponse);
    });
  };

  const groupName = `Notebook-${workpaperData.id}-Status`;
  const { joinGroup } = useSignalR();

  useEffect(() => {
    if (isFileAttached) {
      getExecStatus();
    }
  }, [isFileAttached]);

  useEffect(() => {
    setShowNoti('');
  }, [isNotebookAttached]);

  useEffect(() => {
    if (errorOnSaveParameters) {
      setShowNoti(t(`${TRANSLATION_KEY}_Parameters_Exception`));
      setNotiType(AlertTypes.ERROR);
    }
  }, [errorOnSaveParameters]);

  useEffect(() => {
    if (showNoti && !isEmptyInput) {
      setTimeout(() => {
        setShowNoti('');
      }, 5000);
    }
  }, [showNoti]);

  useEffect(() => {
    if (inputData?.length) {
      const isInputFileMissing = inputData.some(data => {
        return data.required && data.status !== WP_PROCESS_INPUT_STATUS.DONE;
      });

      if (!isInputFileMissing) {
        setShowText('');
      }
    }
  }, [inputData]);

  useEffect(() => {
    if (parameterDataOnAttach !== null && parameterDataOnAttach.length) {
      const mainObj = {};
      parameterDataOnAttach.forEach(data => {
        mainObj[data.key] = data;
      });
      setParameterData(mainObj);
    } else {
      setParameterData({});
    }
  }, [parameterDataOnAttach]);

  const disableProperties = value => {
    disableOnExec(value);
    setDisableBtn(value);
  };

  useEffect(() => {
    if (workpaperData.notebook) {
      dispatch(getParameters(workpaperData.id)).then(response => {
        if (response.length) {
          const mainObj = {};

          response.forEach(data => {
            mainObj[data.key] = data;
          });

          setParameterData(mainObj);
        }
      });

      dispatch(executeNotebookStatus(workpaperData.id)).then(statusResponse => {
        if (statusResponse.status !== ProgressBarTypes.NOTSTARTED) {
          setProgressStatus(statusResponse);
          if (statusResponse.status === ProgressBarTypes.QUEUED || statusResponse.status === ProgressBarTypes.RUNNING) {
            disableProperties(true);
          }
        }
      });
    }
  }, []);

  const resetNotification = () => {
    setShowNoti('');
  };

  const updateInputField = (e, item) => {
    resetNotification();
    setIsEmptyInput(false);
    const mainObj = JSON.parse(JSON.stringify(parameterData));
    mainObj[item.key].parameterValue = e.target.value;
    setParameterData(mainObj);
  };

  const saveParameterData = () => {
    const savedData = {};
    let callDispatch = true;
    if (Object.keys(parameterData).length) {
      Object.values(parameterData).forEach(item => {
        if (item.parameterValue === '') {
          callDispatch = false;
          setIsEmptyInput(true);
          setShowNoti(t(`${TRANSLATION_KEY}_Parameters_Empty`));
          setNotiType(AlertTypes.WARNING);
        } else {
          savedData[parameterData[item.key].key] = {
            ParameterValue: item.parameterValue,
          };
        }
      });
    }
    if (callDispatch) {
      setShowNoti(t(`${TRANSLATION_KEY}_Parameters_Saved`));
      setNotiType(AlertTypes.SUCCESS);
      dispatch(saveParameters(workpaperData.id, savedData)).then(response => {
        if (response) {
          getExecStatus();
        }
      });
    }
  };

  const runExecuteNotebook = () => {
    if (inputData?.length) {
      const isInputFileMissing = inputData.some(data => {
        return data.required && data.status !== WP_PROCESS_INPUT_STATUS.DONE;
      });

      if (!isInputFileMissing) {
        joinGroup(`${env.API_URL}/${NOTIFICATION_HUB}`, groupName);
        dispatch(executeNotebook(workpaperData.id)).then(response => {
          if (Object.keys(response).length) {
            disableProperties(true);
          }
        });
        runExecCalled();
        setShowText('');
      } else {
        setShowText(t(`${TRANSLATION_KEY}_Input_File_Alert`));
      }
    }
  };

  return (
    <Box pl={90} style={{ pointerEvents: disableBtn ? 'none' : '' }}>
      {showNoti && <Alert message={showNoti} type={notiType} mb={7} onClose={() => setShowNoti('')} />}
      <Flex
        flexGrow={2}
        flexWrap='wrap'
        style={{
          gridRowGap: '5px',
          marginBottom: Object.keys(parameterData).length ? '' : '10px',
        }}
      >
        {Object.keys(parameterData).length ? (
          Object.values(parameterData).map(item => {
            return (
              <Input
                key={item.key}
                id={item.key}
                type='text'
                label={item.parameterName}
                style={borderStyle}
                placeholder={t(`${TRANSLATION_KEY}_Input_Text`)}
                value={item.parameterValue ? item.parameterValue : ''}
                onChange={e => updateInputField(e, item)}
                disabled={workpaperData.status === WP_STATE_STATUS.PUBLISHED}
              />
            );
          })
        ) : (
          <Text style={{ position: 'relative', top: -16 }}>{t(`${TRANSLATION_KEY}_No_Data_Found`)}</Text>
        )}
      </Flex>

      <Box mt={25}>
        <NotebookWPProgressBar
          workpaperData={workpaperData}
          progressStatus={progressStatus}
          disableProperties={disableProperties}
          isFileReplaced={isFileReplaced}
        />
        <Flex>
          {Object.keys(parameterData).length ? (
            <Button
              type={ButtonTypes.PRIMARY}
              onClick={saveParameterData}
              mr={5}
              disabled={disableBtn || workpaperData.status === WP_STATE_STATUS.PUBLISHED}
            >
              {t(`${TRANSLATION_KEY}_Save`)}
            </Button>
          ) : (
            ''
          )}
          <Button
            type={ButtonTypes.SECONDARY}
            onClick={runExecuteNotebook}
            disabled={
              workpaperData.status &&
              workpaperData.status !== WP_STATE_STATUS.DRAFT &&
              workpaperData.status !== WP_STATE_STATUS.READY_FOR_REVIEW
            }
          >
            {t(`${TRANSLATION_KEY}_Run_Databricks_Notebooks`)}
          </Button>
        </Flex>
        {showText && <Alert message={showText} type={AlertTypes.WARNING} mt={5} onClose={() => setShowText('')} />}
      </Box>
    </Box>
  );
};

export default NoteBookWPProcessStep2;
