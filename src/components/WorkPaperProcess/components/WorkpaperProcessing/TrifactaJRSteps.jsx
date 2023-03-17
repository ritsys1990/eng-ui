import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Text, TextTypes } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { setTrifactaJRStep } from '../../../../store/workpaperProcess/step2/actions';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { WORKPAPER_CANVAS_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { generateUnconfirmJRStepsPayload } from '../../utils/WorkPaperProcess.utils';
import TrifacataJRStepDetails from './TrifacataJRStepDetails';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_TrifactaWorkpaperProcess_Step2_JRSteps_List';

const TrifactaJRSteps = ({ canvasType, workpaperId, isDMT }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const trifactaParams = useSelector(WPProcessingSelectors.trifactaJRSteps(workpaperId));
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const workpaper = useSelector(isDMT ? wpProcessSelectors.selectDMT(workpaperId) : wpProcessSelectors.selectWorkPaper);
  const hasInputChanged = useSelector(wpStep1Selectors.hasInputChanged);
  const { t } = useTranslation();

  /**
   * This only unconfirms sync process for input change like clear data, delete dataset, upload new input.
   * Reset of Append and Replace has to be done from the Rabbit Task as the user can refresh their page and
   * the current status may not reflect.
   */
  useEffect(() => {
    if (hasInputChanged && trifactaParams?.trifactaJRSteps.length > 0) {
      const jrStepsToUnconfirm = generateUnconfirmJRStepsPayload(trifactaParams.trifactaJRSteps);
      dispatch(
        setTrifactaJRStep(
          workpaperId,
          workpaper.trifactaFlowId,
          jrStepsToUnconfirm,
          false,
          false,
          true,
          engagement?.encryption
        )
      );
    }
  }, [hasInputChanged, workpaperId]);

  return (
    <>
      {trifactaParams?.trifactaJRSteps.length > 0 && (
        <>
          <Text type={TextTypes.H3} color={theme.colors.black54} mb={5}>
            {t(`${TRANSLATION_KEY}_JRStepTitle`)}
          </Text>
          <Text
            type={TextTypes.BODY}
            color={theme.colors.black54}
            mb={
              trifactaParams.trifactaJRSteps.length <= 0 &&
              canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD
                ? 11
                : 7
            }
          >
            {t(`${TRANSLATION_KEY}_JRStepDescription`)}
          </Text>
          {trifactaParams?.trifactaJRSteps.length > 0 &&
            trifactaParams.trifactaJRSteps.map((recipe, index) => (
              <TrifacataJRStepDetails
                recipe={recipe}
                key={`recipeId:${recipe?.receipeId}`}
                flowId={workpaper.trifactaFlowId}
                workpaperId={workpaperId}
                isDMT={isDMT}
                mb={index === trifactaParams?.trifactaJRSteps.length - 1 ? 11 : 2}
                index={index}
              />
            ))}
        </>
      )}
    </>
  );
};

TrifactaJRSteps.propTypes = {
  canvasType: PropTypes.string,
  isDMT: PropTypes.bool,
};

TrifactaJRSteps.defaultProps = {
  canvasType: '',
  isDMT: false,
};

export default TrifactaJRSteps;
