import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { Box, Text, TextTypes } from 'cortex-look-book';
import JRStepDetails from './JRStepDetails';

import { getJRSteps } from '../../../../store/workpaperProcess/step2/actions';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import useTranslation from 'src/hooks/useTranslation';

/**
 * Get all the JRSteps
 * If there are any JR Steps -> Display the Transformatin and JR as detailed.
 * If there are no JR Steps -> Display that there are no JR Steps.
 */
const JRSteps = ({ workpaperId }) => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const jrStepDetails = useSelector(WPProcessingSelectors.jrStepDetails(workpaperId));
  const isLoading = useSelector(WPProcessingSelectors.isLoading(workpaperId));
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getJRSteps(workpaperId));
  }, [dispatch, workpaperId]);

  const renderJRSteps = () => {
    if (jrStepDetails?.length > 0) {
      return (
        <Box mb={11}>
          {jrStepDetails.map(transformation => (
            <Box key={`transformationId:${transformation.transformationId}`} mb={9}>
              <Text type={TextTypes.H3} color={theme.colors.black54} mb={5}>
                {transformation.transformationName}
              </Text>
              {transformation.judgementSteps.map(jrStep => {
                return (
                  <JRStepDetails
                    stepDetails={jrStep}
                    transformationDetails={transformation}
                    workpaperId={workpaperId}
                    jrStepDetails={jrStepDetails}
                    key={`stepId:${jrStep.stepId}`}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      );
    }

    // Only show the error message when there are no JR Steps, not when its making the API Call
    return !isLoading && <Text mb={11}>{t('Pages_WorkpaperProcess_Step2_Tab_Title_No_Steps')}</Text>;
  };

  return renderJRSteps();
};

JRSteps.propTypes = {
  workpaperId: PropTypes.string,
};

JRSteps.defaultProps = {
  workpaperId: '',
};

export default JRSteps;
