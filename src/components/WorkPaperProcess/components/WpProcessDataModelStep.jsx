import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionTypes, Box, Intent, Spinner, Text, TextTypes } from 'cortex-look-book';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { getWorkpaperDMTs, resetDMTS } from '../../../store/workpaperProcess/actions';
import WorkpaperDataModelTransformation from './WorkpaperDataModelTransformation/WorkpaperDataModelTransformation';
import StepTitle from './StepTitle/StepTitle';
import useConfig from '../hooks/useConfig';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import {
  resetDMTStep,
  setIsDMTStepComplete,
  setIsDMTStepPartiallyComplete,
  setIsDMTStepShown,
} from '../../../store/workpaperProcess/step2/actions';
import useTranslation from '../../../hooks/useTranslation';

const COMPONENT_NAME = 'WpProcessDataModelStep';

const WpProcessDataModelStep = ({ workpaperId, canvasType, workpaperType }) => {
  const dispatch = useDispatch();

  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const isFetchingDMTs = useSelector(wpProcessSelectors.selectIsFetchingDMTs);
  const dmts = useSelector(wpProcessSelectors.selectDMTs);
  const overallProgress = useSelector(WPProcessingSelectors.overallProgress);
  const isDMTStepComplete = useSelector(WPProcessingSelectors.isDMTStepComplete);
  const isDMTStepShown = useSelector(WPProcessingSelectors.isDMTStepShown);
  const isCloningBundle = useSelector(wpProcessSelectors.isCloningBundle);
  const overallCloningBundle = useSelector(wpProcessSelectors.overallCloningBundle);

  const { config } = useConfig(canvasType);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setIsDMTStepShown(inputs, canvasType));
  }, [inputs, canvasType]);

  useEffect(() => {
    if (isDMTStepShown) {
      dispatch(getWorkpaperDMTs(workpaperId));
    }
  }, [dispatch, isDMTStepShown]);

  useEffect(() => {
    return () => {
      dispatch(resetDMTStep());
      dispatch(resetDMTS());
    };
  }, [dispatch, workpaperId]);

  useEffect(() => {
    dispatch(setIsDMTStepComplete(dmts, overallProgress));
    dispatch(setIsDMTStepPartiallyComplete(dmts, overallProgress));
  }, [dispatch, overallProgress, dmts]);

  const getDataModelStepStatus = () => {
    return isDMTStepComplete ? Intent.SUCCESS : Intent.INFO;
  };

  const getIsDataModelStepOpen = () => {
    return dmts?.length > 0 || isCloningBundle;
  };

  const getIsDataModelStepDisabled = () => {
    return dmts?.length === 0 && !isCloningBundle;
  };

  const getIsDataModelLoading = inputId => {
    return overallCloningBundle.get(inputId) && !dmts?.some(dmt => dmt.connectedInputId === inputId);
  };

  const sortByNameAlphabetically = (a, b) => {
    const nameA = a.connectedInputName?.toUpperCase() || a.name?.toUpperCase();
    const nameB = b.connectedInputName?.toUpperCase() || b.name?.toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  const getSortedDMTS = useCallback(() => {
    return [...(dmts || [])].sort(sortByNameAlphabetically);
  }, [dmts]);

  return isDMTStepShown ? (
    <Accordion
      status={getDataModelStepStatus()}
      isOpened={getIsDataModelStepOpen()}
      disabled={getIsDataModelStepDisabled()}
      type={AccordionTypes.LARGE}
      header={{
        render: () => <StepTitle stepNum={config.stepNum[3]} title={config.headers[3]} disabled={false} />,
      }}
      dataInstance={`${COMPONENT_NAME}`}
    >
      <Box ml={90}>
        <Text type={TextTypes.BODY} mb={9} color='gray'>
          {t('Pages_WorkpaperProcess_DataModelStep_Instructions')}
        </Text>
        <Spinner spinning={isFetchingDMTs} overlayOpacity={0.5} size={11} pathSize={2} label='' optionalRender={false}>
          {getSortedDMTS().map(dmt => {
            return (
              <Box mb={10} key={dmt.id}>
                <WorkpaperDataModelTransformation
                  workpaperId={dmt.id}
                  canvasType={canvasType}
                  workpaperType={workpaperType}
                  inputName={dmt?.connectedInputName || dmt?.name}
                />
              </Box>
            );
          })}
        </Spinner>
        {inputs?.map(input => {
          return (
            <Spinner
              spinning={getIsDataModelLoading(input.id)}
              overlayOpacity={0.2}
              size={11}
              pathSize={2}
              label={t('Pages_WorkpaperProcess_DataModelStep_Bundle_Cloning_Label')}
              optionalRender={false}
            />
          );
        })}
      </Box>
    </Accordion>
  ) : null;
};

WpProcessDataModelStep.propTypes = {
  workpaperId: PropTypes.string,
};

WpProcessDataModelStep.defaultProps = {
  workpaperId: '',
};

export default WpProcessDataModelStep;
