import React, { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionTypes, Breadcrumbs, Container, Intent, Spinner } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { useDispatch, useSelector } from 'react-redux';
import useNavContext from '../../hooks/useNavContext';
import WpProcessHeader from './components/WpProcessHeader';
import { WPProcessActionTypes } from '../../store/workpaperProcess/actionTypes';
import WpProcessStep1 from './components/WpProcessStep1';
import WpProcessStep2 from './components/WpProcessStep2';
import WpProcessStep3 from './components/WpProcessStep3';
import StepTitle from './components/StepTitle/StepTitle';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { wpStep1Selectors } from '../../store/workpaperProcess/step1/selectors';
import { WPProcessingSelectors } from '../../store/workpaperProcess/step2/selectors';
import { WPProcessStep1ActionTypes } from '../../store/workpaperProcess/step1/actionTypes';
import { WPProcessStep2ActionTypes } from '../../store/workpaperProcess/step2/actionTypes';
import { WPProcessStep3ActionTypes } from '../../store/workpaperProcess/step3/actionTypes';
import { COMPONENT_NAME } from './constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';
import { WORKPAPER_TYPES } from '../../utils/WorkpaperTypes.const';
import { isLegacyMode } from '../../utils/legacyUtils';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WorkPaperProcess = props => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const { match, canvasType } = props;
  const { crumbs } = useNavContext(match);

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const template = useSelector(wpProcessSelectors.selectWTemplate);
  const isLoading = useSelector(wpProcessSelectors.selectIsLoading);
  const isAttachingFile = useSelector(wpStep1Selectors.isAttachingFile);
  const isStep1Completed = useSelector(wpStep1Selectors.selectIsStep1Completed);
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(match.params.workpaperId));
  const [spinnerLabel, setSpinnerLabel] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getWorkpapersDetails(match.params.workpaperId, WORKPAPER_TYPES.CORTEX));

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
  }, [workpaper]);

  useEffect(() => {
    if (isAttachingFile) {
      setSpinnerLabel(t('Components_AddDatatTable_Loader_Label'));
    } else {
      setSpinnerLabel('');
    }
  }, [isAttachingFile]);

  const getSecondStepStatus = () => {
    if (workpaperProgress?.status === Intent.WAITING) {
      return Intent.WAITING;
    } else if (workpaperProgress?.status === Intent.FINISHED && isStep1Completed) {
      return Intent.FINISHED;
    }

    return Intent.INFO;
  };

  const containerPadding = isLegacyMode ? { p: 0 } : { pb: 20 };
  const containerMargin = isLegacyMode ? { mt: 0 } : { mt: theme.space[12] };

  return (
    <Container {...containerPadding}>
      <Spinner
        spinning={isLoading || isAttachingFile}
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
          <WpProcessHeader wp={workpaper} />
          <Accordion
            status={isStep1Completed ? Intent.SUCCESS : Intent.INFO}
            isOpened
            type={AccordionTypes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Step1`}
            header={{
              render: () => (
                <StepTitle
                  stepNum={t('Pages_WorkpaperProcess_Step1_Name')}
                  title={t('Pages_WorkpaperProcess_Step1_Title')}
                  disabled={false}
                />
              ),
            }}
          >
            <WpProcessStep1 template={template} canvasType={canvasType} workpaper={workpaper} />
          </Accordion>
          <Accordion
            status={getSecondStepStatus()}
            isOpened={isStep1Completed}
            disabled={!isStep1Completed}
            type={AccordionTypes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Step2`}
            header={{
              render: () => (
                <StepTitle
                  stepNum={t('Pages_WorkpaperProcess_Step2_Name')}
                  title={t('Pages_WorkpaperProcess_Step2_Title')}
                  disabled={!isStep1Completed}
                />
              ),
            }}
          >
            {isStep1Completed && <WpProcessStep2 workpaperId={match.params.workpaperId} />}
          </Accordion>
          <Accordion
            isOpened={workpaperProgress?.status === Intent.FINISHED && isStep1Completed}
            disabled={workpaperProgress?.status !== Intent.FINISHED || !isStep1Completed}
            status={workpaperProgress?.status === Intent.FINISHED && isStep1Completed ? Intent.SUCCESS : Intent.INFO}
            type={AccordionTypes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Step3`}
            header={{
              render: () => (
                <StepTitle
                  title={t('Pages_WorkpaperProcess_Step3_Title')}
                  stepNum={t('Pages_WorkpaperProcess_Step3_Name')}
                  disabled
                />
              ),
            }}
          >
            {workpaperProgress?.status === Intent.FINISHED && isStep1Completed && (
              <WpProcessStep3
                workpaperId={match.params.workpaperId}
                template={template}
                engagementId={workpaper.engagementId}
                workpaper={workpaper}
                canvasType={canvasType}
              />
            )}
          </Accordion>
        </Container>
      </Spinner>
    </Container>
  );
};

export default WorkPaperProcess;
