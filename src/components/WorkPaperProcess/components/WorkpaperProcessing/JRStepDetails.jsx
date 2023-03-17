import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import env from 'env';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { Box, Flex, Text, Button, ButtonTypes, Accordion, AccordionTypes, ProgressBarTypes } from 'cortex-look-book';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { approveJRStep } from '../../../../store/workpaperProcess/step2/actions';
import { COMPONENT_NAME } from '../../constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';

/**
 * Display JR Steps as detailed in mockups.
 */

const JRStepDetails = ({ workpaperId, jrStepDetails, stepDetails, transformationDetails }) => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const [isOpened, setIsOpened] = useState(false);
  const [status, setStatus] = useState(ProgressBarTypes.DEFAULT);
  const workpaperProcess = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  const { t } = useTranslation();

  useEffect(() => {
    /**
     * If workpaper processing is waiting on this step, open the accordion
     * If the user confirms the JR, that we are waiting on, we need to close the modal; but there is a delay
     * between when a user confirms a JR and when we receives the next workpaper process
     * status so close the accordion step, even though we are waiting for it.
     */

    if (
      workpaperProcess?.status === ProgressBarTypes.WAITING &&
      stepDetails.stepId === workpaperProcess?.waitingJRStepId
    ) {
      /**
       * If someone confirms a JR that we are waiting on, close the accordion.
       */
      if (stepDetails.confirmed) {
        setIsOpened(false);
        setStatus(ProgressBarTypes.SUCCESS);
      } else {
        setIsOpened(true);
        setStatus(ProgressBarTypes.WAITING);
      }
    } else if (stepDetails.confirmed) {
      /**
       * If someone confirms a JR that we are not waiting on, close the accordion.
       */
      setIsOpened(false);
      setStatus(ProgressBarTypes.SUCCESS);
    } else if (workpaperProcess?.status === ProgressBarTypes.RUNNING) {
      setStatus(ProgressBarTypes.DEFAULT);
    } else if (workpaperProcess?.status === ProgressBarTypes.ERROR) {
      setStatus(ProgressBarTypes.ERROR);
    } else {
      setStatus(ProgressBarTypes.DEFAULT);
      setIsOpened(false);
    }
  }, [stepDetails.confirmed, workpaperProcess]);

  const onViewDataClick = () => {
    window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/data`;
  };

  const setLocalOpenState = () => {
    setIsOpened(true);
  };

  return (
    <Accordion
      type={AccordionTypes.SMALL}
      header={{
        title: stepDetails.stepName,
      }}
      status={status}
      ml={4}
      mb={2}
      isOpened={isOpened}
      onClick={setLocalOpenState}
      dataInstance={`${COMPONENT_NAME}-${stepDetails.stepId}`}
    >
      <Box
        sx={{
          borderLeft: `1px solid ${theme.colors['gray2']}`,
        }}
        ml={8}
        mb={9}
      >
        <Text ml={9}>
          <Text fontWeight='m' display='inline-block'>
            {t('Pages_WorkpaperProcess_Step2_Accordion_Description_Label')} -
          </Text>
          {` ${stepDetails.jrDescription}`}
          <br />
          {`${t('Pages_WorkpaperProcess_Step2_Accordion_Description_Text_Part1')} ${stepDetails.stepNumber} ${t(
            'Pages_WorkpaperProcess_Step2_Accordion_Description_Text_Part2'
          )}  ${transformationDetails.transformationName} ${t(
            'Pages_WorkpaperProcess_Step2_Accordion_Description_Text_Part3'
          )}`}
        </Text>
      </Box>
      <Flex ml={8}>
        <Button
          dataInstance={`${COMPONENT_NAME}-Approve`}
          type={ButtonTypes.PRIMARY}
          mr={4}
          disabled={stepDetails.confirmed}
          onClick={() => dispatch(approveJRStep(workpaperId, jrStepDetails, stepDetails.stepId))}
        >
          {t('Pages_WorkpaperProcess_Step2_ApproveTransformation_Button')}
        </Button>
        <Button dataInstance={`${COMPONENT_NAME}-ViewData`} type={ButtonTypes.SECONDARY} onClick={onViewDataClick}>
          {t('Pages_WorkpaperProcess_Step2_View_Data_Button')}
        </Button>
      </Flex>
    </Accordion>
  );
};

JRStepDetails.propTypes = {
  workpaperId: PropTypes.string,
  jrStepDetails: PropTypes.array,
  stepDetails: PropTypes.object,
};

JRStepDetails.defaultProps = {
  workpaperId: '',
  jrStepDetails: [],
  stepDetails: {},
};

export default JRStepDetails;
