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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const [isOpened, setIsOpened] = useState(false);
  const [status, setStatus] = useState('default');
  const workpaperProcess = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));

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
        setStatus('success');
      } else {
        setIsOpened(true);
        setStatus('waiting');
      }
    } else if (stepDetails.confirmed) {
      /**
       * If someone confirms a JR that we are not waiting on, close the accordion.
       */
      setIsOpened(false);
      setStatus('success');
    } else if (workpaperProcess?.status === ProgressBarTypes.RUNNING) {
      setStatus('default');
    } else if (workpaperProcess?.status === ProgressBarTypes.ERROR) {
      setStatus('error');
    } else {
      setStatus('default');
      setIsOpened(false);
    }
  }, [stepDetails.confirmed, workpaperProcess]);

  const onViewDataClick = (wpId, hostWorkpaperId) => {
    if (wpId === hostWorkpaperId) {
      window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${wpId}/data`;
    } else {
      window.location.href = `${env.ANALYTICSUI_URL}/bundleTransformations/${wpId}/data`;
    }
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
          type={ButtonTypes.PRIMARY}
          mr={4}
          disabled={stepDetails.confirmed}
          onClick={() => dispatch(approveJRStep(workpaperId, jrStepDetails, stepDetails.stepId))}
          dataInstance={`${COMPONENT_NAME}-Approve`}
        >
          {t('Pages_WorkpaperProcess_Step2_ApproveTransformation_Button')}
        </Button>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={() => onViewDataClick(transformationDetails.workpaperId, transformationDetails.hostWorkpaperId)}
          dataInstance={`${COMPONENT_NAME}-ViewData`}
        >
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
