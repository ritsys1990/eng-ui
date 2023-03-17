import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from 'styled-components';
import {
  Container,
  Breadcrumbs,
  Spinner,
  Accordion,
  AccordionTypes,
  Button,
  ButtonTypes,
  ModalSizes,
  Modal,
  Box,
  Text,
  Alert,
  AlertTypes,
  Flex,
  IconTypes,
} from 'cortex-look-book';
import { isObject } from 'lodash';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';
import useNavContext from '../../hooks/useNavContext';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { attachNotebooks, replaceNotebook, executeNotebookStatus } from '../../store/notebookWorkpaperProcess/actions';
import { getWorkpaper, getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { WORKPAPER_TYPES } from '../../utils/WorkpaperTypes.const';
import { WPProcessActionTypes } from '../../store/workpaperProcess/actionTypes';
import { WPProcessStep1ActionTypes } from '../../store/workpaperProcess/step1/actionTypes';
import { getWPStep1Details } from '../../store/workpaperProcess/step1/actions';
import { notebookWPStep1Selector } from '../../store/notebookWorkpaperProcess/step1/selectors';
import { NotebookWPStep1ActionTypes } from '../../store/notebookWorkpaperProcess/step1/actionTypes';
import { COMPONENT_NAME, WP_STATE_STATUS } from '../WorkPaperProcess/constants/WorkPaperProcess.const';
import WpProcessHeader from '../WorkPaperProcess/components/WpProcessHeader';
import StepTitle from '../WorkPaperProcess/components/StepTitle/StepTitle';
import AddDatabrickNotebookWPModal from './components/AddDatabrickNotebookWPModal';
import NoteBookWPProcessStep1 from './components/NoteBookWPProcessStep1';
import NoteBookWPProcessStep2 from './components/NoteBookWPProcessStep2';
import { notebookWPProcessSelectors } from '../../store/notebookWorkpaperProcess/selectors';
import NoteBookWPProcessStep3 from './components/NoteBookWPProcessStep3';
import { notebookWPStep3Selector } from '../../store/notebookWorkpaperProcess/step3/selectors';
import { ProgressBarTypes } from '../../pages/WorkPaperProcess/constants/WorkPaperProcess.const';

const TRANSLATION_KEY = 'Pages_NotebookWorkpaperProcess';

// eslint-disable-next-line sonarjs/cognitive-complexity
const NotebookWPProcess = props => {
  const { match, workpaperType, canvasType } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const isLoading = useSelector(wpProcessSelectors.selectIsLoading);
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const template = useSelector(wpProcessSelectors.selectWTemplate);
  const isAttachingFile = useSelector(notebookWPStep1Selector.isAttachingFile);
  const errorOnLinking = useSelector(notebookWPProcessSelectors.errorOnLinking);
  const resetExecution = useSelector(notebookWPProcessSelectors.resetExecution);
  const outputs = useSelector(notebookWPStep3Selector.selectOutputs(workpaper.id));
  const workpaperProgress = useSelector(notebookWPProcessSelectors.workpaperProgress(match.params.workpaperId));

  const [isDatabrickNotebookAddShown, setIsDatabrickNotebookAddShown] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState({});
  const [databrickBtn, setDatabrickBtn] = useState(t(`${TRANSLATION_KEY}_Add_Notebook_btn`));
  const [inputsData, setInputsData] = useState({});
  const [parameterData, setParameterData] = useState({});
  const [spinnerLabel, setSpinnerLabel] = useState('');
  const [showReplaceAlert, setShowReplaceAlert] = useState(false);
  const [updatedWPData, setUpdatedWPData] = useState(workpaper);
  const [disableProperties, setDisableProperties] = useState(false);
  const { crumbs } = useNavContext(match);
  const containerMargin = { mt: theme.space[12] };
  const [runningExecMsg, setRunningExecMsg] = useState('');
  const [resetNoti, setResetNoti] = useState('');
  const [isFileReplaced, setIsFileReplaced] = useState(false);
  const [isShowSimplePopup, showSimplePopup] = useState(false);
  const [showNoti, setShowNoti] = useState('');
  const [notiType, setNotiType] = useState(AlertTypes.SUCCESS);
  const [showExistingReplaceNotification, setShowExistingReplaceNotification] = useState('');
  const [enableOutput, setEnableOutput] = useState(false);

  const closeSimplePopup = () => {
    showSimplePopup(false);
  };

  const onCloseWarning = () => {
    setShowExistingReplaceNotification('');
    setIsDatabrickNotebookAddShown(false);
  };

  const setNotebook = data => {
    setSelectedNotebook(data);
  };

  const changeAttachBtn = response => {
    if (Object.keys(response).length) {
      setUpdatedWPData(response);
      setInputsData(response.notebook.inputs);
      setSelectedNotebook(response.notebook);
      setParameterData(response.notebook.parameters);
      setDatabrickBtn(t(`${TRANSLATION_KEY}_Replace_Notebook_btn`));
      dispatch(getWorkpaper(workpaper.id)).then(() => {
        dispatch(getWPStep1Details(workpaper.id, true, workpaperType));
      });
    }
  };

  const replaceNotebookAPI = () => {
    dispatch(replaceNotebook(selectedNotebook, workpaper.id)).then(response => {
      setUpdatedWPData(response);
      changeAttachBtn(response);
      setIsFileReplaced(true);
      setShowNoti(t(`${TRANSLATION_KEY}_Attach_Notebook`).replace('NotebookName', response.notebook?.notebookTitle));
      setNotiType(AlertTypes.SUCCESS);
    });
    setShowReplaceAlert(false);
    setIsDatabrickNotebookAddShown(false);
  };

  const onAttachClick = () => {
    if (Object.keys(selectedNotebook).length) {
      if (updatedWPData.notebook && Object.keys(updatedWPData.notebook).length) {
        setShowExistingReplaceNotification(
          t(`${TRANSLATION_KEY}_Replace_Existing_Notification`).replace(
            'NotebookName',
            updatedWPData.notebook.notebookTitle
          )
        );
        if (updatedWPData.notebook.sourceAppId !== selectedNotebook.sourceAppId) {
          setShowExistingReplaceNotification('');
          setShowReplaceAlert(true);
        }
      } else {
        setShowExistingReplaceNotification('');
        dispatch(attachNotebooks(selectedNotebook, updatedWPData.id)).then(response => {
          setShowNoti(
            t(`${TRANSLATION_KEY}_Attach_Notebook`).replace('NotebookName', response.notebook?.notebookTitle)
          );
          setNotiType(AlertTypes.SUCCESS);
          changeAttachBtn(response);
        });
        setIsDatabrickNotebookAddShown(false);
      }
    }
  };

  useEffect(() => {
    if (resetExecution && workpaperProgress?.status === ProgressBarTypes.RESET) {
      setResetNoti(t(`${TRANSLATION_KEY}_Reset_Execution`));
    } else {
      setResetNoti('');
    }
  }, [resetExecution, workpaperProgress]);

  useEffect(() => {
    if (errorOnLinking) {
      setShowNoti(t(`${TRANSLATION_KEY}_Attach_Exception`));
      setNotiType(AlertTypes.ERROR);
    }
  }, [errorOnLinking]);

  useEffect(() => {
    if (showNoti || !resetExecution) {
      setTimeout(() => {
        setShowNoti('');
      }, 5000);
    }
  }, [showNoti]);

  useEffect(() => {
    if (outputs && Object.keys(outputs).length && outputs.dataTable.length) {
      const conditionForEnableOp = outputs.dataTable.some(data => {
        return data.nodePath !== null;
      });
      setEnableOutput(conditionForEnableOp);
    }
  }, [outputs]);

  useEffect(() => {
    dispatch(getWorkpapersDetails(match.params.workpaperId, WORKPAPER_TYPES.NOTEBOOK, workpaper.trifactaFlowId));

    return () => {
      dispatch({ type: WPProcessActionTypes.RESET });
      dispatch({ type: WPProcessStep1ActionTypes.RESET });
      dispatch({ type: NotebookWPStep1ActionTypes.RESET_INPUT });
    };
  }, [match.params.workpaperId, dispatch]);

  useEffect(() => {
    if (workpaper.notebook) {
      setSelectedNotebook(workpaper.notebook);
      setDatabrickBtn(t(`${TRANSLATION_KEY}_Replace_Notebook_btn`));
    }
    dispatch(executeNotebookStatus(workpaper.id)).then(statusResponse => {
      if (statusResponse.status === ProgressBarTypes.QUEUED || statusResponse.status === ProgressBarTypes.RUNNING) {
        setRunningExecMsg(t(`${TRANSLATION_KEY}_RUNNNG_EXEC_MSG`));
      }
    });
  }, [t, workpaper]);

  useEffect(() => {
    if (isAttachingFile) {
      setSpinnerLabel(t('Components_AddDatatTable_Loader_Label'));
    } else {
      setSpinnerLabel('');
    }
  }, [isAttachingFile]);

  const closePopups = () => {
    setShowReplaceAlert(false);
    setIsDatabrickNotebookAddShown(false);
  };

  const disableOnExec = value => {
    setDisableProperties(value);
    if (value === false) {
      setRunningExecMsg('');
    }
  };

  const runExecCalled = () => {
    setRunningExecMsg(t(`${TRANSLATION_KEY}_RUNNNG_EXEC_MSG`));
  };

  return (
    <Container>
      <Spinner
        spinning={isLoading || isAttachingFile}
        overlayOpacity={0.85}
        minHeight='calc(100vh - 120px)'
        size={theme.space[11]}
        pathSize={theme.space[2]}
        optionalRender={isLoading}
        label={spinnerLabel}
      >
        <Breadcrumbs
          crumbs={crumbs}
          fontSize='s'
          fontWeight={theme.fontWeights.m}
          mt={theme.space[9] - 4}
          dataInstance={COMPONENT_NAME}
        />
        {showNoti && <Alert message={showNoti} type={notiType} mt={5} onClose={() => setShowNoti('')} />}
        <Container px={theme.space[0]} {...containerMargin}>
          <WpProcessHeader wp={workpaper} workpaperType={workpaperType} canvasType={canvasType} />
          <Button
            type={ButtonTypes.PRIMARY}
            onClick={() => setIsDatabrickNotebookAddShown(true)}
            mb={10}
            mt={30}
            disabled={disableProperties || updatedWPData.status === WP_STATE_STATUS.PUBLISHED}
          >
            {databrickBtn}
          </Button>
          {runningExecMsg && (
            <Alert
              message={runningExecMsg}
              type={AlertTypes.WARNING}
              mt={5}
              mb={10}
              onClose={() => setRunningExecMsg('')}
            />
          )}
          {resetNoti && (
            <Alert message={resetNoti} type={AlertTypes.WARNING} mt={5} mb={10} onClose={() => setResetNoti('')} />
          )}
          <Modal
            isOpen={isDatabrickNotebookAddShown}
            onClose={onCloseWarning}
            onPrimaryButtonClick={onAttachClick}
            onSecondaryButtonClick={onCloseWarning}
            primaryButtonText={t('Attach')}
            secondaryButtonText={t('Close')}
            size={ModalSizes.Large}
            dataInstance={`${COMPONENT_NAME}-Warning`}
          >
            <AddDatabrickNotebookWPModal
              onNoteBookSelect={setNotebook}
              selectedNotebook={selectedNotebook}
              workpaperData={updatedWPData}
              showExistingReplaceNotification={showExistingReplaceNotification}
              setShowExistingReplaceNotification={setShowExistingReplaceNotification}
            />
          </Modal>
          <Modal
            isOpen={showReplaceAlert}
            onClose={closePopups}
            onPrimaryButtonClick={replaceNotebookAPI}
            onSecondaryButtonClick={closePopups}
            primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
            secondaryButtonText={t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
            size={ModalSizes.Large}
            dataInstance={`${COMPONENT_NAME}-Warning`}
          >
            <Text>{t(`${TRANSLATION_KEY}_Replace_Msg`)}</Text>
          </Modal>
          <Accordion
            isOpened={isObject(updatedWPData.notebook)}
            type={AccordionTypes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Step1`}
            header={{
              render: () => <StepTitle stepNum='' title={t(`${TRANSLATION_KEY}_Step1`)} disabled={false} />,
            }}
            disabled={!isObject(updatedWPData.notebook) || disableProperties}
          >
            <NoteBookWPProcessStep1
              template={template}
              workpaperType={workpaperType}
              workpaper={workpaper}
              canvasType={canvasType}
              disableProperties={disableProperties}
            />
          </Accordion>
          <Accordion
            isOpened={isObject(updatedWPData.notebook)}
            type={AccordionTypes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Step2`}
            header={{
              render: () => <StepTitle stepNum='' title={t(`${TRANSLATION_KEY}_Step2`)} disabled={false} />,
            }}
            disabled={!isObject(updatedWPData.notebook) || disableProperties}
          >
            <NoteBookWPProcessStep2
              parameterDataOnAttach={parameterData}
              workpaperData={updatedWPData}
              disableOnExec={disableOnExec}
              inputsData={inputsData}
              isFileReplaced={isFileReplaced}
              runExecCalled={runExecCalled}
            />
          </Accordion>
          <Accordion
            isOpened={workpaperProgress?.status === ProgressBarTypes.FINISHED || enableOutput}
            type={AccordionTypes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Step3`}
            header={{
              render: () => (
                <Flex justifyContent='space-between' flexGrow='1'>
                  <Flex>
                    <StepTitle stepNum='' title={t(`${TRANSLATION_KEY}_Step3`)} disabled={false} />
                  </Flex>
                  <Flex fontSize={theme.fontSizes.s}>
                    {outputs?.dataTable && (
                      <Button
                        disabled={workpaperProgress?.status !== ProgressBarTypes.FINISHED}
                        type={ButtonTypes.LINK}
                        icon={IconTypes.TAG}
                        iconWidth={20}
                        onClick={event => {
                          event.stopPropagation();
                          showSimplePopup(true);
                        }}
                      >
                        {t('Pages_WorkpaperProcess_Step3_Label_Dataset')}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              ),
            }}
            disabled={workpaperProgress?.status !== ProgressBarTypes.FINISHED && !enableOutput}
          >
            {isObject(updatedWPData.notebook) && (
              <NoteBookWPProcessStep3
                workpaperId={workpaper.id}
                showSimplePopUp={isShowSimplePopup}
                closeSimplePopup={closeSimplePopup}
                outputs={outputs}
              />
            )}
          </Accordion>
        </Container>
        <Box style={{ float: 'right', marginTop: '20px' }}>
          <Button type={ButtonTypes.PRIMARY} disabled>
            {t(`${TRANSLATION_KEY}_Submit_btn`)}
          </Button>
        </Box>
      </Spinner>
    </Container>
  );
};

export default NotebookWPProcess;
